import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import ImagePreview from "./ImagePreview";
import CompressionSettings, { CompressionOptions } from "./CompressionSettings";
import WatermarkTool from "./WatermarkTool";
import ResizeModal from "./ResizeModal";
import ConvertModal from "./ConvertModal";
import RotateModal from "./RotateModal";
import ImageEditor from "./ImageEditor";
import { useHistory } from "../hooks/useHistory";
import { useLanguage } from "../contexts/LanguageContext";

type ImageTool =
  | "compress"
  | "resize"
  | "convert"
  | "rotate"
  | "crop"
  | "watermark"
  | "editor";

function ImageTools() {
  const [activeTool, setActiveTool] = useState<ImageTool>("compress");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showCompressionSettings, setShowCompressionSettings] = useState(false);
  const [showWatermarkTool, setShowWatermarkTool] = useState(false);
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useHistory();
  const { t } = useLanguage();

  const tools = [
    { id: "compress" as ImageTool, name: t("image.compress"), icon: "🗜️" },
    { id: "resize" as ImageTool, name: t("image.resize"), icon: "📐" },
    { id: "convert" as ImageTool, name: t("image.convert"), icon: "🔄" },
    { id: "rotate" as ImageTool, name: t("image.rotate"), icon: "↻" },
    { id: "watermark" as ImageTool, name: t("image.watermark"), icon: "©️" },
    { id: "editor" as ImageTool, name: t("editor.title"), icon: "📸" },
    { id: "crop" as ImageTool, name: t("image.crop"), icon: "✂️" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleCompress = async (customOptions?: CompressionOptions) => {
    if (selectedFiles.length === 0) return;

    if (!customOptions) {
      setShowCompressionSettings(true);
      return;
    }

    setShowCompressionSettings(false);
    setProcessing(true);
    setProgress(0);

    const options = {
      maxSizeMB: customOptions.maxSizeMB,
      maxWidthOrHeight: customOptions.maxWidthOrHeight,
      initialQuality: customOptions.quality,
      useWebWorker: true,
      onProgress: (p: number) => setProgress(p),
    };

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const compressedFile = await imageCompression(file, options);

        const url = URL.createObjectURL(compressedFile);
        const a = document.createElement("a");
        a.href = url;
        a.download = `compressed_${file.name}`;
        a.click();
        URL.revokeObjectURL(url);
      }

      addToHistory(
        "Comprimir imágenes",
        "image",
        selectedFiles.length,
        `Comprimidas con calidad ${Math.round(customOptions.quality * 100)}%`,
      );
    } catch (error) {
      console.error("Error comprimiendo:", error);
      alert("Error al comprimir las imágenes");
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  const handleResize = async (width?: number, height?: number) => {
    if (selectedFiles.length === 0) return;

    if (!width || !height) {
      setShowResizeModal(true);
      return;
    }

    setShowResizeModal(false);
    setProcessing(true);

    try {
      for (const file of selectedFiles) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target?.result as string;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);

              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `resized_${file.name}`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }, file.type);
            }
          };
        };

        reader.readAsDataURL(file);
      }

      addToHistory(
        "Redimensionar imágenes",
        "image",
        selectedFiles.length,
        `Redimensionadas a ${width}x${height}px`,
      );
    } catch (error) {
      console.error("Error redimensionando:", error);
      alert("Error al redimensionar las imágenes");
    } finally {
      setProcessing(false);
    }
  };

  const handleConvert = async (format?: string, quality?: number) => {
    if (selectedFiles.length === 0) return;

    if (!format) {
      setShowConvertModal(true);
      return;
    }

    setShowConvertModal(false);
    setProcessing(true);

    const mimeType = `image/${format}`;

    try {
      for (const file of selectedFiles) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target?.result as string;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.drawImage(img, 0, 0);

              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    const newName = file.name.replace(
                      /\.[^/.]+$/,
                      `.${format}`,
                    );
                    a.href = url;
                    a.download = `converted_${newName}`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                },
                mimeType,
                quality || 0.92,
              );
            }
          };
        };

        reader.readAsDataURL(file);
      }

      addToHistory(
        "Convertir imágenes",
        "image",
        selectedFiles.length,
        `Convertidas a formato ${format.toUpperCase()}`,
      );
    } catch (error) {
      console.error("Error convirtiendo:", error);
      alert("Error al convertir las imágenes");
    } finally {
      setProcessing(false);
    }
  };

  const handleRotate = async (rotation?: number) => {
    if (selectedFiles.length === 0) return;

    if (!rotation) {
      setShowRotateModal(true);
      return;
    }

    setShowRotateModal(false);
    setProcessing(true);

    try {
      for (const file of selectedFiles) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target?.result as string;

          img.onload = () => {
            const canvas = document.createElement("canvas");

            if (rotation === 90 || rotation === 270) {
              canvas.width = img.height;
              canvas.height = img.width;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }

            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((rotation * Math.PI) / 180);
              ctx.drawImage(img, -img.width / 2, -img.height / 2);

              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `rotated_${file.name}`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }, file.type);
            }
          };
        };

        reader.readAsDataURL(file);
      }

      addToHistory(
        "Rotar imágenes",
        "image",
        selectedFiles.length,
        `Rotadas ${rotation}°`,
      );
    } catch (error) {
      console.error("Error rotando:", error);
      alert("Error al rotar las imágenes");
    } finally {
      setProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const handleProcess = () => {
    switch (activeTool) {
      case "compress":
        handleCompress();
        break;
      case "resize":
        handleResize();
        break;
      case "convert":
        handleConvert();
        break;
      case "rotate":
        handleRotate();
        break;
      case "watermark":
        setShowWatermarkTool(true);
        break;
      case "editor":
        if (selectedFiles.length > 0) {
          setShowEditor(true);
        } else {
          alert(t("editor.noImage"));
        }
        break;
      case "crop":
        alert("Función de recorte en desarrollo");
        break;
    }
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4 sm:mb-6">
        {t("image.title")}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4 sm:mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-200 ${
              activeTool === tool.id
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                : "bg-gray-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600/50"
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{tool.icon}</div>
            <div className="text-[10px] sm:text-xs font-medium leading-tight">
              {tool.name}
            </div>
            {activeTool === tool.id && (
              <div className="absolute inset-0 rounded-xl border-2 border-white/20"></div>
            )}
          </button>
        ))}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center mb-4 sm:mb-6 transition-all duration-300 cursor-pointer ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
            : "border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/30 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
              isDragging
                ? "bg-indigo-500/20"
                : "bg-gray-200 dark:bg-slate-700/50"
            }`}
          >
            <svg
              className={`w-6 h-6 sm:w-8 sm:h-8 ${isDragging ? "text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p
              className={`text-sm sm:text-base font-medium mb-1 ${isDragging ? "text-indigo-400" : "text-slate-900 dark:text-slate-200"}`}
            >
              {isDragging
                ? t("image.dropzone.drag")
                : t("image.dropzone.browse")}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-500">
              {t("image.dropzone.formats")}
            </p>
          </div>
        </div>
      </div>

      <ImagePreview
        files={selectedFiles}
        onRemove={(index) => {
          const newFiles = selectedFiles.filter((_, i) => i !== index);
          setSelectedFiles(newFiles);
        }}
      />

      {processing && (
        <div className="mb-4 sm:mb-6 bg-gray-100 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-gray-300 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("image.processing")}
            </span>
            <span className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {progress}%
            </span>
          </div>
          <div className="bg-gray-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleProcess}
        disabled={selectedFiles.length === 0 || processing}
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm sm:text-base font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:shadow-none"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="truncate">{t("image.processing")}</span>
          </span>
        ) : (
          <span className="truncate">{`${t("image.process.button")} ${selectedFiles.length} ${selectedFiles.length !== 1 ? t("image.process.plural") : t("image.process.single")}`}</span>
        )}
      </button>

      {showCompressionSettings && (
        <CompressionSettings
          onApply={handleCompress}
          onCancel={() => setShowCompressionSettings(false)}
        />
      )}

      {showWatermarkTool && (
        <WatermarkTool
          files={selectedFiles}
          onComplete={(count) => {
            setShowWatermarkTool(false);
            addToHistory(
              "Apply watermark",
              "image",
              count,
              `Watermark applied to ${count} image${count !== 1 ? "s" : ""}`,
            );
          }}
          onCancel={() => setShowWatermarkTool(false)}
        />
      )}

      {showResizeModal && (
        <ResizeModal
          onApply={(width, height) => {
            handleResize(width, height);
          }}
          onCancel={() => setShowResizeModal(false)}
        />
      )}

      {showConvertModal && (
        <ConvertModal
          onApply={(format, quality) => {
            handleConvert(format, quality);
          }}
          onCancel={() => setShowConvertModal(false)}
        />
      )}

      {showRotateModal && (
        <RotateModal
          onApply={(degrees) => {
            handleRotate(degrees);
          }}
          onCancel={() => setShowRotateModal(false)}
        />
      )}

      {showEditor && selectedFiles.length > 0 && (
        <ImageEditor
          file={selectedFiles[0]}
          onClose={() => {
            setShowEditor(false);
            addToHistory(t("editor.title"), "image", 1, "Image edited");
          }}
        />
      )}
    </div>
  );
}

export default ImageTools;
