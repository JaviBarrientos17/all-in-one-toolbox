import { useEffect, useState } from "react";
import ImageTools from "./components/ImageTools";
import PDFTools from "./components/PDFTools";
import DocumentTools from "./components/DocumentTools";
import OutputGallery from "./components/OutputGallery";
import History from "./components/History";
import { useTheme } from "./contexts/ThemeContext";
import { useLanguage } from "./contexts/LanguageContext";

type ToolCategory = "home" | "image" | "pdf" | "video" | "document" | "output";

function CategoryIcon({ category }: { category: ToolCategory }) {
  const common = "h-[18px] w-[18px] shrink-0";
  const paths: Record<ToolCategory, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
    pdf: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    video: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3z" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    output: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
  };

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[category]}
    </svg>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("image");
  const [showHistory, setShowHistory] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    document.title = t("app.pageTitle");
  }, [language, t]);

  useEffect(() => {
    const updateYear = () => setCurrentYear(new Date().getFullYear());
    const id = window.setInterval(updateYear, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const categories: { id: ToolCategory; name: string }[] = [
    { id: "home", name: language === "ca" ? "Inici" : language === "en" ? "Home" : "Inicio" },
    { id: "image", name: t("category.image") },
    { id: "pdf", name: t("category.pdf") },
    { id: "document", name: t("category.document") },
    { id: "output", name: t("outputs.tab") },
  ];

  const activeName = categories.find((category) => category.id === activeCategory)?.name ?? "";
  const searchResults = categories.filter((category) =>
    category.name.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase()),
  );

  const selectLanguage = (nextLanguage: "en" | "es" | "ca") => {
    setLanguage(nextLanguage);
    setShowLanguageMenu(false);
  };

  const renderCategory = () => {
    switch (activeCategory) {
      case "home":
        return (
          <div className="toolbox-home space-y-7">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 sm:p-7 dark:border-indigo-400/15 dark:from-[#201b3b] dark:via-[#171b2a] dark:to-[#1c1830]">
              <div className="pointer-events-none absolute -right-8 -top-16 h-52 w-52 rounded-full bg-violet-400/15 blur-3xl" />
              <div className="relative max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-700 dark:border-indigo-300/15 dark:bg-white/[0.05] dark:text-indigo-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {language === "ca" ? "100% processament local" : language === "en" ? "100% local processing" : "100% procesamiento local"}
                </span>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  {language === "ca" ? "Tot el que necessites, en un sol lloc." : language === "en" ? "Everything you need, in one place." : "Todo lo que necesitas, en un solo lugar."}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {language === "ca" ? "Eines senzilles per transformar imatges, PDF i documents sense pujar els teus arxius." : language === "en" ? "Simple tools to transform images, PDFs and documents without uploading your files." : "Herramientas sencillas para transformar imágenes, PDF y documentos sin subir tus archivos."}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{language === "ca" ? "Explora les eines" : language === "en" ? "Explore tools" : "Explora las herramientas"}</h3>
                <span className="text-[11px] text-slate-400">{categories.length - 1} {language === "en" ? "categories" : language === "ca" ? "categories" : "categorías"}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {categories.filter((category) => category.id !== "home").map((category) => {
                  const copy = category.id === "image"
                    ? (language === "en" ? "Compress, resize, convert and edit images." : language === "ca" ? "Comprimeix, redimensiona, converteix i edita imatges." : "Comprime, redimensiona, convierte y edita imágenes.")
                    : category.id === "pdf"
                      ? (language === "en" ? "Merge, split, rotate and optimize PDF files." : language === "ca" ? "Uneix, divideix, gira i optimitza fitxers PDF." : "Une, divide, rota y optimiza archivos PDF.")
                      : category.id === "document"
                        ? (language === "en" ? "Convert text, Markdown, CSV, JSON and more." : language === "ca" ? "Converteix text, Markdown, CSV, JSON i més." : "Convierte texto, Markdown, CSV, JSON y más.")
                        : (language === "en" ? "Access your processed files and download them again." : language === "ca" ? "Accedeix als fitxers processats i descarrega'ls." : "Accede a tus archivos procesados y vuelve a descargarlos.");
                  return (
                    <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)}
                      className="toolbox-home-card group flex min-h-[126px] items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:border-indigo-400/40 dark:hover:bg-white/[0.045]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100 dark:bg-indigo-400/10 dark:text-indigo-300 dark:group-hover:bg-indigo-400/15">
                        <CategoryIcon category={category.id} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900 dark:text-white">{category.name}</span>
                        <span className="mt-1.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">{copy}</span>
                      </span>
                      <svg className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case "image": return <ImageTools />;
      case "pdf": return <PDFTools />;
      case "document": return <DocumentTools />;
      case "output": return <OutputGallery />;
      case "video":
        return (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <CategoryIcon category="video" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t("comingSoon.title")}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{t("comingSoon.video")}</p>
          </div>
        );
    }
  };

  return (
    <div className="toolbox-shell min-h-screen bg-[#f6f7fb] text-slate-900 transition-colors duration-200 dark:bg-[#0b0d12] dark:text-slate-100">
      {/* Desktop sidebar */}
      <aside className="toolbox-sidebar fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200/80 bg-white/90 px-4 py-5 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#10131a]/95 lg:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-white/10">
            <img src="/logo.svg" alt="All-in-One Toolbox" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-slate-950 dark:text-white">{t("app.title")}</p>
            <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">{t("app.subtitle")}</p>
          </div>
        </div>

        <div className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Workspace
        </div>
        <nav aria-label="Main navigation" className="space-y-1">
          {categories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)}
                aria-current={active ? "page" : undefined}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/15"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
                }`}>
                <CategoryIcon category={category.id} />
                <span className="flex-1">{category.name}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 dark:border-emerald-400/10 dark:bg-emerald-400/[0.06]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>
            </span>
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">{t("app.privacyFirst")}</span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-emerald-800/80 dark:text-emerald-200/65">{t("footer.privacy")}</p>
        </div>
        <p className="mt-4 px-2 text-[10px] text-slate-400 dark:text-slate-600">© {currentYear} All-in-One Toolbox</p>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0d1016]/85">
          <div className="mx-auto flex h-[66px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
            <div className="flex min-w-0 items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-white/10">
                <img src="/logo.svg" alt="" className="h-full w-full object-contain" />
              </div>
              <span className="truncate text-sm font-bold text-slate-950 dark:text-white">{t("app.title")}</span>
            </div>
            <div className="hidden min-w-0 lg:block">
              <div className="text-xs text-slate-400 dark:text-slate-500">Workspace <span className="px-1.5">/</span> <span className="font-medium text-slate-700 dark:text-slate-200">{activeName}</span></div>
              <h1 className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">{activeName}</h1>
            </div>
            <div className="relative mx-4 hidden min-w-0 max-w-[420px] flex-1 md:block">
              <label className="sr-only" htmlFor="toolbox-category-search">Buscar secciones</label>
              <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/90 px-3 text-slate-400 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-white/10 dark:bg-white/[0.035] dark:focus-within:border-indigo-400/60 dark:focus-within:bg-white/[0.06]">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
                <input id="toolbox-category-search" value={searchQuery}
                  onChange={(event) => { setSearchQuery(event.target.value); setShowSearchResults(true); }}
                  onFocus={() => setShowSearchResults(true)}
                  onKeyDown={(event) => { if (event.key === "Escape") setShowSearchResults(false); if (event.key === "Enter" && searchResults[0]) { setActiveCategory(searchResults[0].id); setSearchQuery(""); setShowSearchResults(false); } }}
                  placeholder={language === "es" ? "Buscar secciones..." : language === "ca" ? "Cerca seccions..." : "Search sections..."}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-slate-100 dark:placeholder:text-slate-500" />
                <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 dark:border-white/10 dark:bg-white/[0.04] sm:inline">↵</kbd>
              </div>
              {showSearchResults && searchQuery.trim() && <>
                <button aria-label="Cerrar resultados" className="fixed inset-0 z-20 cursor-default" onClick={() => setShowSearchResults(false)} />
                <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#171b24]">
                  {searchResults.length ? searchResults.map((category) => (
                    <button key={category.id} type="button" onClick={() => { setActiveCategory(category.id); setSearchQuery(""); setShowSearchResults(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-400/10 dark:hover:text-indigo-200">
                      <CategoryIcon category={category.id} />{category.name}
                    </button>
                  )) : <p className="px-3 py-3 text-xs text-slate-400">{language === "es" ? "No se encontraron secciones" : language === "ca" ? "No s'han trobat seccions" : "No sections found"}</p>}
                </div>
              </>}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <div className="relative">
                <button type="button" onClick={() => setShowLanguageMenu((value) => !value)}
                  aria-expanded={showLanguageMenu} aria-label="Change language"
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>
                  {language}
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor"><path d="m5 7 5 5 5-5H5Z"/></svg>
                </button>
                {showLanguageMenu && <>
                  <button aria-label="Close language menu" className="fixed inset-0 z-30 cursor-default" onClick={() => setShowLanguageMenu(false)} />
                  <div className="absolute right-0 top-11 z-40 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#171b24]">
                    {(["en", "es", "ca"] as const).map((code) => (
                      <button key={code} type="button" onClick={() => selectLanguage(code)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${language === code ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.05]"}`}>
                        {code === "en" ? "English" : code === "es" ? "Español" : "Català"}
                        {language === code && <span aria-hidden="true">✓</span>}
                      </button>
                    ))}
                  </div>
                </>}
              </div>

              <button type="button" onClick={toggleTheme}
                title={theme === "dark" ? t("header.theme.light") : t("header.theme.dark")}
                aria-label={theme === "dark" ? t("header.theme.light") : t("header.theme.dark")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]">
                {theme === "dark" ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.7 8.7 0 1 0 20.5 14.2Z"/></svg>
                )}
              </button>

              <button type="button" onClick={() => setShowHistory(true)}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"/><path d="M3 3v5h5m4-1v5l3 2"/></svg>
                <span className="hidden sm:inline">{t("header.history")}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile/tablet category navigation */}
        <div className="border-b border-slate-200/70 bg-white/75 px-3 py-2 dark:border-white/[0.06] dark:bg-[#0d1016]/75 lg:hidden">
          <nav aria-label="Tool categories" className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto scrollbar-none">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button key={category.id} type="button" onClick={() => setActiveCategory(category.id)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${
                    active ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                  }`}>
                  <CategoryIcon category={category.id} />
                  {category.name}
                </button>
              );
            })}
          </nav>
        </div>

        <main className="mx-auto w-full max-w-[1600px] px-3 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-9 lg:pt-8">
          <div className="toolbox-page-hero mb-5 flex items-end justify-between gap-4 lg:mb-6">
            <div className="min-w-0">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400 lg:hidden">All-in-One Toolbox</p>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">{activeName}</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">{t("app.subtitle")}</p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-400/15 dark:bg-emerald-400/[0.07] dark:text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t("app.localProcessing")}
            </div>
          </div>

          <section className="toolbox-workspace min-w-0 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5 md:p-6 lg:rounded-[20px] lg:p-7 dark:border-white/[0.08] dark:bg-[#11151d] dark:shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
            {renderCategory()}
          </section>

          <footer className="mt-6 flex flex-col items-center justify-between gap-2 px-1 text-center text-[11px] text-slate-400 dark:text-slate-600 sm:flex-row sm:text-left">
            <span>© {currentYear} All-in-One Toolbox</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path fillRule="evenodd" d="M5 8V6a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm8 0V6a3 3 0 1 0-6 0v2h6Z" clipRule="evenodd"/></svg>
              {t("footer.privacy")}
            </span>
          </footer>
        </main>
      </div>

      <History isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}

export default App;
