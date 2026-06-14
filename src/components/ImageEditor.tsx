import React, { useState, useRef, useEffect } from "react";
import { storage } from "../utils/storage";
import { useLanguage } from "../contexts/LanguageContext";

interface ImageEditorProps {
  file: File;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ file, onClose }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [filter, setFilter] = useState<string>("none");
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        setOriginalImage(img);
        applyFilters(img, 100, 100, 100, "none");
      };
    };

    reader.readAsDataURL(file);
  }, [file]);

  const applyFilters = (
    img: HTMLImageElement,
    b: number,
    c: number,
    s: number,
    f: string,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;

    // Apply special filters
    if (f === "grayscale") ctx.filter += " grayscale(100%)";
    if (f === "sepia") ctx.filter += " sepia(100%)";
    if (f === "invert") ctx.filter += " invert(100%)";

    ctx.drawImage(img, 0, 0);
  };

  useEffect(() => {
    if (originalImage) {
      applyFilters(originalImage, brightness, contrast, saturation, filter);
    }
  }, [brightness, contrast, saturation, filter, originalImage]);

  const handleSaveDraft = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    canvas.toBlob(async (blob) => {
      if (blob) {
        await storage.saveDraft(file.name, file.name, blob);
        setSaveMessage(t("editor.draft.saved"));
        setTimeout(() => setSaveMessage(null), 3000);
      }
      setIsSaving(false);
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `edited_${file.name}`;
    a.click();
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setFilter("none");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-xl">
              📸
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("editor.title")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {file.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Canvas Container */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 flex items-center justify-center overflow-auto min-h-[300px]">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain shadow-xl bg-white dark:bg-slate-900"
            />
          </div>

          {/* Controls Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto bg-white dark:bg-slate-900">
            {/* Adjustments */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span>🎚️</span> {t("editor.adjust")}
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-600 dark:text-slate-400">
                      {t("editor.brightness")}
                    </label>
                    <span className="text-indigo-500 font-medium">
                      {brightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-600 dark:text-slate-400">
                      {t("editor.contrast")}
                    </label>
                    <span className="text-indigo-500 font-medium">
                      {contrast}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-600 dark:text-slate-400">
                      {t("editor.saturation")}
                    </label>
                    <span className="text-indigo-500 font-medium">
                      {saturation}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-4 flex items-center gap-2">
                <span>🎨</span> {t("editor.filters")}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "none", label: "None", icon: "🚫" },
                  { id: "grayscale", label: t("editor.grayscale"), icon: "🌚" },
                  { id: "sepia", label: t("editor.sepia"), icon: "📜" },
                  { id: "invert", label: t("editor.invert"), icon: "🌗" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`p-2 text-xs rounded-lg border transition-all ${
                      filter === f.id
                        ? "bg-indigo-500 text-white border-indigo-500"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="text-lg mb-1">{f.icon}</div>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full py-2 px-4 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              🔄 {t("editor.reset")}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl">
          <div className="text-sm text-slate-500 flex items-center gap-2">
            {saveMessage && (
              <span className="text-green-500 flex items-center gap-1 animate-fade-in">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {saveMessage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl text-sm font-semibold transition-all"
            >
              {isSaving ? "..." : t("editor.draft.save")}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              💾 {t("editor.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
