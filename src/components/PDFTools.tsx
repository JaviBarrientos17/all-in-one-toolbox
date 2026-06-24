import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useHistory } from "../hooks/useHistory";
import { useLanguage } from "../contexts/LanguageContext";
import { outputStorage } from "../utils/outputStorage";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js`;

type PDFTool = "merge" | "split" | "compress" | "extract" | "rotate" | "pdf-to-img" | "img-to-pdf" | "watermark";

function PDFTools() {
  const [activeTool, setActiveTool] = useState<PDFTool>("merge");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useHistory();
  const { t } = useLanguage();

  // Dynamic tool options state
  const [watermarkText, setWatermarkText] = useState("CONFIDENCIAL");
  const [watermarkStyle, setWatermarkStyle] = useState<"center" | "diagonal" | "grid">("diagonal");
  const [watermarkColor, setWatermarkColor] = useState("#ef4444"); // Tailwind-like red-500
  const [watermarkFontSize, setWatermarkFontSize] = useState(50);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);

  const [compressQuality, setCompressQuality] = useState(0.7);

  const [pdfToImgFormat, setPdfToImgFormat] = useState("png");
  const [pdfToImgScale, setPdfToImgScale] = useState(1.5);

  const [imgToPdfPageSize, setImgToPdfPageSize] = useState("a4");
  const [extractPagesInput, setExtractPagesInput] = useState("1-3");
  const [rotateAngle, setRotateAngle] = useState(90);

  // Clear selected files when active tool changes
  useEffect(() => {
    setSelectedFiles([]);
  }, [activeTool]);

  const tools = [
    { id: "merge" as PDFTool, name: t("pdf.merge"), icon: "🔗" },
    { id: "split" as PDFTool, name: t("pdf.split"), icon: "✂️" },
    { id: "extract" as PDFTool, name: t("pdf.extract"), icon: "📄" },
    { id: "rotate" as PDFTool, name: t("pdf.rotate"), icon: "↻" },
    { id: "compress" as PDFTool, name: t("pdf.compress"), icon: "🗜️" },
    { id: "pdf-to-img" as PDFTool, name: t("pdf.pdfToImg"), icon: "🖼️" },
    { id: "img-to-pdf" as PDFTool, name: t("pdf.imgToPdf"), icon: "➕" },
    { id: "watermark" as PDFTool, name: t("pdf.watermark"), icon: "🔤" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert(t("pdf.alert.mergeMin"));
      return;
    }

    setProcessing(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices(),
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as BlobPart], {
        type: "application/pdf",
      });

      await outputStorage.saveOutput(
        "merged.pdf",
        "application/pdf",
        blob,
        "pdf",
      );

      saveAs(blob, "merged.pdf");

      addToHistory(
        t("pdf.history.merge"),
        "pdf",
        selectedFiles.length,
        `${selectedFiles.length} ${t("pdf.history.mergeDesc")}`,
      );
    } catch (error) {
      console.error("Error fusionando PDFs:", error);
      alert(t("pdf.alert.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (selectedFiles.length !== 1) {
      alert(t("pdf.alert.splitOne"));
      return;
    }

    setProcessing(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();

      const zip = new JSZip();

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        zip.file(`page_${i + 1}.pdf`, pdfBytes);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const zipName = `${file.name.replace(".pdf", "")}_split.zip`;

      await outputStorage.saveOutput(
        zipName,
        "application/zip",
        content,
        "pdf",
      );

      saveAs(content, zipName);

      addToHistory(
        t("pdf.history.split"),
        "pdf",
        1,
        `${pageCount} ${t("pdf.history.splitDesc")}`,
      );
    } catch (error) {
      console.error("Error dividiendo PDF:", error);
      alert(t("pdf.alert.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleExtractPages = async () => {
    if (selectedFiles.length !== 1) {
      alert("Selecciona exactamente 1 archivo PDF");
      return;
    }

    if (!extractPagesInput.trim()) {
      alert("Ingresa las páginas a extraer");
      return;
    }

    setProcessing(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const pageIndices: number[] = [];
      const parts = extractPagesInput.split(",");

      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            pageIndices.push(i - 1);
          }
        } else {
          pageIndices.push(Number(part) - 1);
        }
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], {
        type: "application/pdf",
      });
      const outputName = `extracted_${file.name}`;

      await outputStorage.saveOutput(
        outputName,
        "application/pdf",
        blob,
        "pdf",
      );

      saveAs(blob, outputName);

      addToHistory(
        "Extraer páginas de PDF",
        "pdf",
        1,
        `Páginas extraídas: ${extractPagesInput}`,
      );
    } catch (error) {
      console.error("Error extrayendo páginas:", error);
      alert("Error al extraer páginas");
    } finally {
      setProcessing(false);
    }
  };

  const handleRotate = async () => {
    if (selectedFiles.length !== 1) {
      alert("Selecciona exactamente 1 archivo PDF");
      return;
    }

    setProcessing(true);

    try {
      const { PDFDocument, degrees: degreesLib } = await import("pdf-lib");
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const pages = pdf.getPages();
      const rotationAngle = degreesLib(rotateAngle);

      pages.forEach((page) => {
        page.setRotation(rotationAngle);
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes as BlobPart], {
        type: "application/pdf",
      });
      const outputName = `rotated_${file.name}`;

      await outputStorage.saveOutput(
        outputName,
        "application/pdf",
        blob,
        "pdf",
      );

      saveAs(blob, outputName);

      addToHistory("Rotar PDF", "pdf", 1, `PDF rotado ${rotateAngle}°`);
    } catch (error) {
      console.error("Error rotando PDF:", error);
      alert("Error al rotar el PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handleCompress = async () => {
    if (selectedFiles.length !== 1) {
      alert("Selecciona exactamente 1 archivo PDF");
      return;
    }

    setProcessing(true);

    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;

      const { PDFDocument } = await import("pdf-lib");
      const compressedPdfDoc = await PDFDocument.create();

      // Lower DPI/resolution scale based on quality choice
      const scale = compressQuality === 0.5 ? 1.0 : compressQuality === 0.7 ? 1.2 : 1.5;

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        // Export canvas as JPEG with user specified quality
        const jpegBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error("Canvas export failed"));
            },
            "image/jpeg",
            compressQuality
          );
        });

        const imageBuffer = await jpegBlob.arrayBuffer();
        const embeddedImage = await compressedPdfDoc.embedJpg(imageBuffer);

        const newPage = compressedPdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }

      const pdfBytes = await compressedPdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      
      const initialSize = file.size;
      const finalSize = blob.size;
      const savingsPercent = Math.max(0, Math.round(((initialSize - finalSize) / initialSize) * 100));

      const outputName = `compressed_${file.name}`;

      await outputStorage.saveOutput(
        outputName,
        "application/pdf",
        blob,
        "pdf",
      );

      saveAs(blob, outputName);

      addToHistory(
        t("pdf.history.compress"),
        "pdf",
        1,
        `${savingsPercent}% de ahorro (${(finalSize / 1024 / 1024).toFixed(2)} MB)`
      );
    } catch (error) {
      console.error("Error compressing PDF:", error);
      alert(t("pdf.alert.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handlePdfToImg = async () => {
    if (selectedFiles.length !== 1) {
      alert("Selecciona exactamente 1 archivo PDF");
      return;
    }

    setProcessing(true);

    try {
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      const zip = new JSZip();

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: pdfToImgScale });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;

        const mimeType = pdfToImgFormat === "png" ? "image/png" : "image/jpeg";
        const fileExt = pdfToImgFormat === "png" ? "png" : "jpg";
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas a Blob falló"));
          }, mimeType, 0.9);
        });

        zip.file(`page_${i}.${fileExt}`, blob);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipName = `${file.name.replace(".pdf", "")}_images.zip`;

      await outputStorage.saveOutput(
        zipName,
        "application/zip",
        zipContent,
        "pdf",
      );

      saveAs(zipContent, zipName);

      addToHistory(
        t("pdf.history.pdfToImg"),
        "pdf",
        1,
        `${pageCount} ${t("pdf.history.splitDesc")}`
      );
    } catch (error) {
      console.error("Error convirtiendo PDF a imágenes:", error);
      alert(t("pdf.alert.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleImgToPdf = async () => {
    if (selectedFiles.length === 0) {
      alert("Selecciona al menos una imagen");
      return;
    }

    setProcessing(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        let embedImg;
        if (file.type === "image/png" || file.name.endsWith(".png")) {
          embedImg = await pdfDoc.embedPng(arrayBuffer);
        } else {
          embedImg = await pdfDoc.embedJpg(arrayBuffer);
        }

        const { width, height } = embedImg.scale(1.0);
        
        let pageWidth = width;
        let pageHeight = height;

        if (imgToPdfPageSize === "a4") {
          pageWidth = 595.27;
          pageHeight = 841.89;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        if (imgToPdfPageSize === "a4") {
          const scale = Math.min(pageWidth / width, pageHeight / height);
          const x = (pageWidth - width * scale) / 2;
          const y = (pageHeight - height * scale) / 2;
          page.drawImage(embedImg, {
            x,
            y,
            width: width * scale,
            height: height * scale,
          });
        } else {
          page.drawImage(embedImg, {
            x: 0,
            y: 0,
            width,
            height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const outputName = `images_combined.pdf`;

      await outputStorage.saveOutput(
        outputName,
        "application/pdf",
        blob,
        "pdf",
      );

      saveAs(blob, outputName);

      addToHistory(
        t("pdf.history.imgToPdf"),
        "pdf",
        selectedFiles.length,
        `${selectedFiles.length} imágenes`
      );
    } catch (error) {
      console.error("Error creando PDF desde imágenes:", error);
      alert(t("pdf.alert.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleWatermark = async () => {
    if (selectedFiles.length !== 1) {
      alert("Selecciona exactamente 1 archivo PDF");
      return;
    }

    if (!watermarkText.trim()) {
      alert("Ingresa el texto de la marca de agua");
      return;
    }

    setProcessing(true);

    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      const file = selectedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      const hex = watermarkColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        if (watermarkStyle === "diagonal") {
          page.drawText(watermarkText, {
            x: width * 0.15,
            y: height * 0.25,
            size: watermarkFontSize,
            font: font,
            color: rgb(r, g, b),
            opacity: watermarkOpacity,
            rotate: degrees(45),
          });
        } else if (watermarkStyle === "center") {
          const textWidth = font.widthOfTextAtSize(watermarkText, watermarkFontSize);
          page.drawText(watermarkText, {
            x: (width - textWidth) / 2,
            y: height / 2,
            size: watermarkFontSize,
            font: font,
            color: rgb(r, g, b),
            opacity: watermarkOpacity,
          });
        } else {
          const cols = 3;
          const rows = 4;
          const xStep = width / cols;
          const yStep = height / rows;

          for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
              page.drawText(watermarkText, {
                x: xStep * col + xStep * 0.2,
                y: yStep * row + yStep * 0.4,
                size: watermarkFontSize * 0.6,
                font: font,
                color: rgb(r, g, b),
                opacity: watermarkOpacity,
                rotate: degrees(30),
              });
            }
          }
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const outputName = `watermarked_${file.name}`;

      await outputStorage.saveOutput(
        outputName,
        "application/pdf",
        blob,
        "pdf",
      );

      saveAs(blob, outputName);

      addToHistory(
        t("pdf.history.watermark"),
        "pdf",
        1,
        `Texto: "${watermarkText}"`
      );
    } catch (error) {
      console.error("Error añadiendo marca de agua:", error);
      alert(t("pdf.alert.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleProcess = () => {
    switch (activeTool) {
      case "merge":
        handleMerge();
        break;
      case "split":
        handleSplit();
        break;
      case "extract":
        handleExtractPages();
        break;
      case "rotate":
        handleRotate();
        break;
      case "compress":
        handleCompress();
        break;
      case "pdf-to-img":
        handlePdfToImg();
        break;
      case "img-to-pdf":
        handleImgToPdf();
        break;
      case "watermark":
        handleWatermark();
        break;
    }
  };

  const getAcceptedFormats = () => {
    if (activeTool === "img-to-pdf") {
      return ".png,.jpg,.jpeg";
    }
    return "application/pdf";
  };

  const isMultipleFiles = () => {
    return activeTool === "merge" || activeTool === "img-to-pdf";
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

    const files = Array.from(e.dataTransfer.files);
    
    if (activeTool === "img-to-pdf") {
      const imgFiles = files.filter(f => f.type.startsWith("image/") || /\.(jpg|jpeg|png)$/i.test(f.name));
      if (imgFiles.length > 0) {
        setSelectedFiles(imgFiles);
      }
    } else {
      const pdfFiles = files.filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
      if (pdfFiles.length > 0) {
        if (activeTool === "merge") {
          setSelectedFiles(pdfFiles);
        } else {
          setSelectedFiles([pdfFiles[0]]);
        }
      }
    }
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4 sm:mb-6">
        {t("pdf.title")}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-4 sm:mb-6">
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

      {/* Tool settings panels */}
      {activeTool === "watermark" && (
        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-700/60 mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            {t("pdf.watermark")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t("pdf.watermark.text")}
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="CONFIDENCIAL"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t("pdf.watermark.style")}
              </label>
              <select
                value={watermarkStyle}
                onChange={(e) => setWatermarkStyle(e.target.value as any)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="diagonal">{t("pdf.watermark.style.diagonal")}</option>
                <option value="center">{t("pdf.watermark.style.center")}</option>
                <option value="grid">{t("pdf.watermark.style.grid")}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t("pdf.watermark.color")}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={watermarkColor}
                  onChange={(e) => setWatermarkColor(e.target.value)}
                  className="w-10 h-9 p-0.5 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-mono uppercase">{watermarkColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t("pdf.watermark.fontSize")} ({watermarkFontSize}px)
              </label>
              <input
                type="range"
                min="10"
                max="120"
                value={watermarkFontSize}
                onChange={(e) => setWatermarkFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t("pdf.watermark.opacity")} ({Math.round(watermarkOpacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
            </div>
          </div>
        </div>
      )}

      {activeTool === "compress" && (
        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-700/60 mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            {t("pdf.compress.quality")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { val: 0.9, label: t("pdf.compress.preset.high"), desc: "150 DPI, 90% JPG Quality" },
              { val: 0.7, label: t("pdf.compress.preset.medium"), desc: "120 DPI, 70% JPG Quality" },
              { val: 0.5, label: t("pdf.compress.preset.low"), desc: "90 DPI, 50% JPG Quality" },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setCompressQuality(preset.val)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  compressQuality === preset.val
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                    : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850"
                }`}
              >
                <div className="text-xs font-semibold">{preset.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTool === "pdf-to-img" && (
        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-700/60 mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            {t("pdf.pdfToImg")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t("pdf.pdfToImg.format")}
              </label>
              <div className="flex gap-2">
                {["png", "jpeg"].map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setPdfToImgFormat(format)}
                    className={`flex-1 py-2 text-xs font-semibold uppercase rounded-lg border transition-all ${
                      pdfToImgFormat === format
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t("pdf.pdfToImg.resolution")} ({pdfToImgScale}x)
              </label>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.5"
                value={pdfToImgScale}
                onChange={(e) => setPdfToImgScale(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                Higher values yield crisper images but larger zip files.
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTool === "img-to-pdf" && (
        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-700/60 mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            {t("pdf.imgToPdf")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Page Size Layout
              </label>
              <div className="flex gap-2">
                {[
                  { val: "original", label: "Original Size" },
                  { val: "a4", label: "Standard A4 Page" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setImgToPdfPageSize(opt.val)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      imgToPdfPageSize === opt.val
                        ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === "extract" && (
        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-700/60 mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            {t("pdf.extract")}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Pages to extract (comma separated or range, e.g. 1, 3, 5-7)
            </label>
            <input
              type="text"
              value={extractPagesInput}
              onChange={(e) => setExtractPagesInput(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="1,3,5-7"
            />
          </div>
        </div>
      )}

      {activeTool === "rotate" && (
        <div className="bg-gray-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-slate-700/60 mb-4 sm:mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            {t("pdf.rotate")}
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Rotation Angle
            </label>
            <div className="flex gap-2">
              {[90, 180, 270].map((angle) => (
                <button
                  key={angle}
                  type="button"
                  onClick={() => setRotateAngle(angle)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    rotateAngle === angle
                      ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300"
                      : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-850"
                  }`}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
          accept={getAcceptedFormats()}
          multiple={isMultipleFiles()}
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p
              className={`text-sm sm:text-base font-medium mb-1 ${isDragging ? "text-indigo-400" : "text-slate-900 dark:text-slate-200"}`}
            >
              {isDragging ? t("pdf.dropzone.drag") : t("pdf.dropzone.browse")}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-500">
              {activeTool === "img-to-pdf"
                ? "JPEG, PNG supported"
                : t("pdf.dropzone.formats")}
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">
            {t("pdf.selectedFiles")} ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-slate-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 border border-gray-300 dark:border-slate-700/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 dark:bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-200 truncate font-medium">
                    {file.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-500 mt-0.5 sm:mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
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
            <span className="truncate">{t("pdf.processing")}</span>
          </span>
        ) : (
          <span className="truncate">{t("pdf.process.button")}</span>
        )}
      </button>
    </div>
  );
}

export default PDFTools;
