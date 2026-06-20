import { useState, useEffect } from "react";
import ImageTools from "./components/ImageTools";
import PDFTools from "./components/PDFTools";
import DocumentTools from "./components/DocumentTools";
import OutputGallery from "./components/OutputGallery";
import History from "./components/History";
import { useTheme } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";

type ToolCategory = "image" | "pdf" | "video" | "document" | "output";

function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("image");
  const [showHistory, setShowHistory] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [currentYear, setCurrentYear] = useState<number>(() =>
    new Date().getFullYear(),
  );

  useEffect(() => {
    document.title = t("app.pageTitle");
  }, [language, t]);

  useEffect(() => {
    const updateYear = () => setCurrentYear(new Date().getFullYear());
    // check once per minute and update if the year changed (covers year rollover)
    const id = setInterval(updateYear, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const categories = [
    { id: "image" as ToolCategory, name: t("category.image"), icon: "🖼️" },
    { id: "pdf" as ToolCategory, name: t("category.pdf"), icon: "📄" },
    // { id: 'video' as ToolCategory, name: t('category.video'), icon: '🎬' },
    {
      id: "document" as ToolCategory,
      name: t("category.document"),
      icon: "📝",
    },
    { id: "output" as ToolCategory, name: t("outputs.tab"), icon: "📥" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Header con glassmorphism */}
      <header className="border-b border-gray-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200 bg-white dark:bg-slate-800 p-1 flex-shrink-0">
                <img
                  src="/logo.svg"
                  alt="All-in-One Toolbox Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                  {t("app.title")}
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 hidden sm:block truncate">
                  {t("app.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all duration-200 border border-gray-300 dark:border-slate-700"
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium uppercase">
                    {language}
                  </span>
                </button>

                {showLanguageMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          setLanguage("en");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${
                          language === "en"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>English</span>
                        {language === "en" && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("es");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${
                          language === "es"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>Español</span>
                        {language === "es" && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setLanguage("ca");
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-between ${
                          language === "ca"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>Català</span>
                        {language === "ca" && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all duration-200 border border-gray-300 dark:border-slate-700"
                title={
                  theme === "dark"
                    ? t("header.theme.light")
                    : t("header.theme.dark")
                }
              >
                {theme === "dark" ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-all duration-200 border border-gray-300 dark:border-slate-700"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm font-medium hidden xs:inline">
                  {t("header.history")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Tabs de categorías */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <nav className="flex gap-1 sm:gap-2 p-1 bg-white dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700/50 backdrop-blur-sm shadow-lg overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-1 min-w-[70px] sm:min-w-[90px] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700/50"
                }`}
              >
                <span className="text-base sm:text-lg">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido principal */}
        <div className="bg-white dark:bg-slate-800/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-700/50 shadow-2xl p-4 sm:p-6 md:p-8">
          {activeCategory === "image" && <ImageTools />}
          {activeCategory === "pdf" && <PDFTools />}
          {activeCategory === "video" && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">
                {t("comingSoon.title")}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 px-4">
                {t("comingSoon.video")}
              </p>
            </div>
          )}
          {activeCategory === "document" && <DocumentTools />}
          {activeCategory === "output" && <OutputGallery />}
        </div>

        <footer className="text-center mt-6 sm:mt-8 text-slate-600 dark:text-slate-500 text-xs sm:text-sm px-4">
          <p className="flex items-center justify-center gap-2">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="break-words">{t("footer.privacy")}</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="break-words font-bold">© {currentYear}</span>
          </p>
        </footer>
      </div>

      <History isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}

export default App;
