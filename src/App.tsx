import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { BreakingTicker } from "@/components/BreakingTicker";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/pages/HomePage";
import { LatestPage } from "@/pages/LatestPage";
import { TrendingPage } from "@/pages/TrendingPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { ArticlePage } from "@/pages/ArticlePage";
import { SearchPage } from "@/pages/SearchPage";
import { SavedPage } from "@/pages/SavedPage";
import { AuthPage } from "@/pages/AuthPage";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex min-h-screen flex-col">
              <BreakingTicker />
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/latest" element={<LatestPage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/saved" element={<SavedPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
