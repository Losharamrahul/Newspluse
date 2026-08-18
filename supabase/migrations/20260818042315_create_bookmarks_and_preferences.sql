/*
# NewsPulse: bookmarks and user preferences

## Purpose
Stores saved (bookmarked) news articles per authenticated user, plus lightweight
user preferences (theme preference, favorite categories) so the experience can
persist across devices for signed-in users.

## New Tables

### bookmarks
- `id` uuid primary key (default gen_random_uuid)
- `user_id` uuid NOT NULL, defaults to the authenticated user, references auth.users with ON DELETE CASCADE
- `article_id` text NOT NULL — stable hash/id of the article (from news feed) so we can dedupe
- `title` text NOT NULL
- `description` text
- `image_url` text
- `article_url` text NOT NULL — original source URL
- `source` text NOT NULL — source name (e.g. "BBC")
- `category` text
- `published_at` timestamptz
- `created_at` timestamptz default now()
- Unique constraint on (user_id, article_id) so a user can't bookmark the same article twice.

### user_preferences
- `id` uuid primary key (default gen_random_uuid)
- `user_id` uuid NOT NULL UNIQUE, defaults to authenticated user, references auth.users with ON DELETE CASCADE
- `theme` text NOT NULL DEFAULT 'system' — 'light' | 'dark' | 'system'
- `favorite_categories` text[] DEFAULT '{}' — list of preferred categories
- `updated_at` timestamptz default now()

## Security
- RLS enabled on both tables.
- bookmarks: owner-scoped CRUD — authenticated users can only read/insert/update/delete their own bookmarks.
  The `user_id` column defaults to `auth.uid()` so inserts that omit user_id still satisfy WITH CHECK.
- user_preferences: owner-scoped CRUD — authenticated users can only manage their own preferences row.

## Important Notes
1. Both tables require an authenticated session — the anon role has no policies and cannot read or write.
2. The frontend MUST build the sign-in/sign-up UI alongside this schema, otherwise all writes silently fail.
3. ON DELETE CASCADE on the user_id FK means deleting a user account removes their bookmarks and preferences.
*/

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  article_url text NOT NULL,
  source text NOT NULL,
  category text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookmarks" ON bookmarks;
CREATE POLICY "select_own_bookmarks" ON bookmarks
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_bookmarks" ON bookmarks;
CREATE POLICY "insert_own_bookmarks" ON bookmarks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_bookmarks" ON bookmarks;
CREATE POLICY "update_own_bookmarks" ON bookmarks
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookmarks" ON bookmarks;
CREATE POLICY "delete_own_bookmarks" ON bookmarks
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_article_unique
  ON bookmarks (user_id, article_id);

CREATE INDEX IF NOT EXISTS bookmarks_user_created_idx
  ON bookmarks (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'system',
  favorite_categories text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_preferences" ON user_preferences;
CREATE POLICY "select_own_preferences" ON user_preferences
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_preferences" ON user_preferences;
CREATE POLICY "insert_own_preferences" ON user_preferences
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_preferences" ON user_preferences;
CREATE POLICY "update_own_preferences" ON user_preferences
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_preferences" ON user_preferences;
CREATE POLICY "delete_own_preferences" ON user_preferences
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS user_preferences_user_unique
  ON user_preferences (user_id);
