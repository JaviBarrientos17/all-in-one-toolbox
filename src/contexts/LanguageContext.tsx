import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "es" | "ca";

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    ca: string;
  };
}

export const translations: Translations = {
  // Header
  "app.title": {
    en: "All-in-One Toolbox",
    es: "All-in-One Toolbox",
    ca: "All-in-One Toolbox",
  },
  "app.subtitle": {
    en: "100% Local Processing",
    es: "100% Procesamiento Local",
    ca: "100% Processament Local",
  },
  "app.pageTitle": {
    en: "All-in-One Toolbox - Local File Processing",
    es: "All-in-One Toolbox - Procesamiento Local de Archivos",
    ca: "All-in-One Toolbox - Processament Local de Fitxers",
  },
  "header.history": { en: "History", es: "Historial", ca: "Historial" },
  "header.theme.light": {
    en: "Switch to light mode",
    es: "Cambiar a modo claro",
    ca: "Canviar a mode clar",
  },
  "header.theme.dark": {
    en: "Switch to dark mode",
    es: "Cambiar a modo oscuro",
    ca: "Canviar a mode fosc",
  },

  // Categories
  "category.image": { en: "Images", es: "Imágenes", ca: "Imatges" },
  "category.pdf": { en: "PDF", es: "PDF", ca: "PDF" },
  "category.video": { en: "Video", es: "Video", ca: "Vídeo" },
  "category.document": { en: "Documents", es: "Documentos", ca: "Documents" },

  // Image Tools
  "image.title": {
    en: "Image Tools",
    es: "Herramientas de Imagen",
    ca: "Eines d'Imatge",
  },
  "image.compress": { en: "Compress", es: "Comprimir", ca: "Comprimir" },
  "image.resize": { en: "Resize", es: "Redimensionar", ca: "Redimensionar" },
  "image.convert": { en: "Convert", es: "Convertir", ca: "Convertir" },
  "image.rotate": { en: "Rotate", es: "Rotar", ca: "Girar" },
  "image.watermark": {
    en: "Watermark",
    es: "Marca de Agua",
    ca: "Marca d'Aigua",
  },
  "image.crop": { en: "Crop", es: "Recortar", ca: "Retallar" },
  "image.dropzone.drag": {
    en: "Drop files here",
    es: "Suelta los archivos aquí",
    ca: "Deixa els fitxers aquí",
  },
  "image.dropzone.browse": {
    en: "Drop files or click to browse",
    es: "Arrastra archivos o haz clic para buscar",
    ca: "Arrossega fitxers o fes clic per cercar",
  },
  "image.dropzone.formats": {
    en: "JPG, PNG, GIF, WebP, HEIC supported",
    es: "JPG, PNG, GIF, WebP, HEIC soportados",
    ca: "Suport per a JPG, PNG, GIF, WebP, HEIC",
  },
  "image.processing": {
    en: "Processing...",
    es: "Procesando...",
    ca: "Processant...",
  },
  "image.process.button": { en: "Process", es: "Procesar", ca: "Processar" },
  "image.process.single": { en: "image", es: "imagen", ca: "imatge" },
  "image.process.plural": { en: "images", es: "imágenes", ca: "imatges" },
  "image.noImage": {
    en: "Please select an image",
    es: "Por favor selecciona una imagen",
    ca: "Si us plau selecciona una imatge",
  },

  // PDF Tools
  "pdf.title": { en: "PDF Tools", es: "Herramientas PDF", ca: "Eines PDF" },
  "pdf.merge": { en: "Merge", es: "Fusionar", ca: "Fusionar" },
  "pdf.split": { en: "Split", es: "Dividir", ca: "Dividir" },
  "pdf.compress": { en: "Compress", es: "Comprimir", ca: "Comprimir" },
  "pdf.rotate": { en: "Rotate", es: "Rotar", ca: "Girar" },
  "pdf.extract": {
    en: "Extract Pages",
    es: "Extraer Páginas",
    ca: "Extreure Pàgines",
  },
  "pdf.pdfToImg": {
    en: "PDF to Images",
    es: "PDF a Imágenes",
    ca: "PDF a Imatges",
  },
  "pdf.imgToPdf": {
    en: "Images to PDF",
    es: "Imágenes a PDF",
    ca: "Imatges a PDF",
  },
  "pdf.watermark": {
    en: "Add Watermark",
    es: "Marca de Agua",
    ca: "Marca d'Aigua",
  },
  "pdf.alert.mergeMin": {
    en: "Select at least 2 PDF files to merge",
    es: "Selecciona al menos 2 archivos PDF para fusionar",
    ca: "Selecciona almenys 2 fitxers PDF per fusionar",
  },
  "pdf.alert.splitOne": {
    en: "Select exactly 1 PDF file to split",
    es: "Selecciona exactamente 1 archivo PDF para dividir",
    ca: "Selecciona exactament 1 fitxer PDF per dividir",
  },
  "pdf.alert.error": {
    en: "Error processing PDF",
    es: "Error al procesar el PDF",
    ca: "Error en processar el PDF",
  },
  "pdf.history.merge": {
    en: "Merge PDFs",
    es: "Fusionar PDFs",
    ca: "Fusionar PDFs",
  },
  "pdf.history.mergeDesc": {
    en: "PDFs merged into one",
    es: "PDFs fusionados en uno",
    ca: "PDFs fusionats en un",
  },
  "pdf.history.split": {
    en: "Split PDF",
    es: "Dividir PDF",
    ca: "Dividir PDF",
  },
  "pdf.history.splitDesc": {
    en: "pages extracted",
    es: "páginas extraídas",
    ca: "pàgines extretes",
  },
  "pdf.history.compress": {
    en: "Compress PDF",
    es: "Comprimir PDF",
    ca: "Comprimir PDF",
  },
  "pdf.history.compressDesc": {
    en: "PDF compressed",
    es: "PDF comprimido",
    ca: "PDF comprimit",
  },
  "pdf.history.rotate": { en: "Rotate PDF", es: "Rotar PDF", ca: "Girar PDF" },
  "pdf.history.rotateDesc": {
    en: "PDF rotated",
    es: "PDF rotado",
    ca: "PDF girat",
  },
  "pdf.history.pdfToImg": {
    en: "PDF to Images",
    es: "PDF a Imágenes",
    ca: "PDF a Imatges",
  },
  "pdf.history.imgToPdf": {
    en: "Images to PDF",
    es: "Imágenes a PDF",
    ca: "Imatges a PDF",
  },
  "pdf.history.watermark": {
    en: "Add Watermark to PDF",
    es: "Marca de Agua añadida",
    ca: "Marca d'Aigua afegida",
  },
  "pdf.watermark.text": {
    en: "Watermark Text",
    es: "Texto de la Marca de Agua",
    ca: "Text de la Marca d'Aigua",
  },
  "pdf.watermark.style": {
    en: "Watermark Style",
    es: "Estilo de la Marca de Agua",
    ca: "Estil de la Marca d'Aigua",
  },
  "pdf.watermark.style.center": {
    en: "Centered",
    es: "Centrado",
    ca: "Centrat",
  },
  "pdf.watermark.style.diagonal": {
    en: "Diagonal",
    es: "Diagonal",
    ca: "Diagonal",
  },
  "pdf.watermark.style.grid": {
    en: "Repeated Grid",
    es: "Cuadrícula Repetida",
    ca: "Quadrícula Repetida",
  },
  "pdf.watermark.color": {
    en: "Color",
    es: "Color",
    ca: "Color",
  },
  "pdf.watermark.fontSize": {
    en: "Font Size",
    es: "Tamaño de Fuente",
    ca: "Mida de lletra",
  },
  "pdf.watermark.opacity": {
    en: "Opacity",
    es: "Opacidad",
    ca: "Opacitat",
  },
  "pdf.compress.quality": {
    en: "Compression Level",
    es: "Nivel de Compresión",
    ca: "Nivel de Compressió",
  },
  "pdf.compress.preset.high": {
    en: "High Quality (Less compression)",
    es: "Alta Calidad (Menor compresión)",
    ca: "Alta Qualitat (Menor compressió)",
  },
  "pdf.compress.preset.medium": {
    en: "Medium Quality (Balanced)",
    es: "Calidad Media (Equilibrada)",
    ca: "Qualitat Mitjana (Equilibrada)",
  },
  "pdf.compress.preset.low": {
    en: "Low Quality (Max compression)",
    es: "Baja Calidad (Máxima compresión)",
    ca: "Baixa Qualitat (Màxima compressió)",
  },
  "pdf.pdfToImg.format": {
    en: "Image Format",
    es: "Formato de Imagen",
    ca: "Format d'Imatge",
  },
  "pdf.pdfToImg.resolution": {
    en: "Resolution Scale",
    es: "Escala de Resolución",
    ca: "Escala de Resolució",
  },

  // Document Tools
  "doc.title": {
    en: "Document Tools",
    es: "Herramientas de Documentos",
    ca: "Eines de Documents",
  },
  "doc.toPDF": { en: "TXT to PDF", es: "TXT a PDF", ca: "TXT a PDF" },
  "doc.mdToPdf": { en: "Markdown → PDF/HTML", es: "Markdown → PDF/HTML", ca: "Markdown → PDF/HTML" },
  "doc.jsonToYaml": { en: "JSON ↔ YAML", es: "JSON ↔ YAML", ca: "JSON ↔ YAML" },
  "doc.jsonToXml": { en: "JSON ↔ XML", es: "JSON ↔ XML", ca: "JSON ↔ XML" },
  "doc.toWord": { en: "Word to PDF", es: "Word a PDF", ca: "Word a PDF" },
  "doc.toExcel": { en: "Excel to PDF", es: "Excel a PDF", ca: "Excel a PDF" },
  "doc.toPowerPoint": {
    en: "To PowerPoint",
    es: "A PowerPoint",
    ca: "A PowerPoint",
  },
  "doc.history.jsonToYaml": {
    en: "JSON ↔ YAML conversion",
    es: "Conversión JSON ↔ YAML",
    ca: "Conversió JSON ↔ YAML",
  },
  "doc.history.jsonToXml": {
    en: "JSON ↔ XML conversion",
    es: "Conversión JSON ↔ XML",
    ca: "Conversió JSON ↔ XML",
  },
  "doc.history.mdToPdf": {
    en: "Markdown conversion",
    es: "Conversión Markdown",
    ca: "Conversió Markdown",
  },
  "doc.dropzone.drag": {
    en: "Drop files here",
    es: "¡Suelta los archivos aquí!",
    ca: "Deixa els fitxers aquí!",
  },
  "doc.dropzone.browse": {
    en: "Drop files or click to browse",
    es: "Arrastra archivos o haz clic para seleccionar",
    ca: "Arrossega fitxers o fes clic per seleccionar",
  },
  "doc.dropzone.formats": {
    en: "Supported format: .txt, .csv, .json",
    es: "Formato soportado: .txt, .csv, .json",
    ca: "Format suportat: .txt, .csv, .json",
  },
  "doc.processing": {
    en: "Processing...",
    es: "Procesando...",
    ca: "Processant...",
  },
  "doc.process.button": {
    en: "Process Documents",
    es: "Procesar Documentos",
    ca: "Processar Documents",
  },
  "doc.selectedFiles": {
    en: "Selected Files",
    es: "Archivos seleccionados",
    ca: "Fitxers seleccionats",
  },
  "doc.history.convert": {
    en: "Convert documents",
    es: "Convertir documentos",
    ca: "Convertir documents",
  },
  "doc.history.convertDesc": {
    en: "documents converted",
    es: "documentos convertidos",
    ca: "documents convertits",
  },

  // Modals
  "modal.cancel": { en: "Cancel", es: "Cancelar", ca: "Cancel·lar" },
  "modal.apply": { en: "Apply", es: "Aplicar", ca: "Aplicar" },
  "modal.compress.title": {
    en: "Compression Settings",
    es: "Configuración de Compresión",
    ca: "Configuració de Compressió",
  },
  "modal.compress.quality": { en: "Quality", es: "Calidad", ca: "Qualitat" },
  "modal.compress.maxSize": {
    en: "Max Size",
    es: "Tamaño Máximo",
    ca: "Mida Màxima",
  },
  "modal.compress.maxDimension": {
    en: "Max Dimension",
    es: "Dimensión Máxima",
    ca: "Dimensió Màxima",
  },
  "modal.compress.presets": {
    en: "Quick Presets:",
    es: "Ajustes Rápidos:",
    ca: "Ajustos Ràpids:",
  },
  "modal.compress.preset.high": {
    en: "High Quality",
    es: "Alta calidad",
    ca: "Alta qualitat",
  },
  "modal.compress.preset.balanced": {
    en: "Balanced",
    es: "Equilibrada",
    ca: "Equilibrada",
  },
  "modal.compress.preset.web": {
    en: "Web Optimized",
    es: "Web optimizada",
    ca: "Web optimitzada",
  },
  "modal.compress.preset.max": {
    en: "Max Compression",
    es: "Máxima compresión",
    ca: "Màxima compressió",
  },
  "modal.resize.title": {
    en: "Resize Images",
    es: "Redimensionar Imágenes",
    ca: "Redimensionar Imatges",
  },
  "modal.resize.width": {
    en: "Width (px)",
    es: "Ancho (px)",
    ca: "Amplada (px)",
  },
  "modal.resize.height": {
    en: "Height (px)",
    es: "Alto (px)",
    ca: "Alçada (px)",
  },
  "modal.resize.aspectRatio": {
    en: "Lock aspect ratio",
    es: "Bloquear proporción",
    ca: "Bloquejar proporció",
  },
  "modal.resize.aspectLocked": {
    en: "Aspect ratio locked",
    es: "Proporción bloqueada",
    ca: "Proporció bloquejada",
  },
  "modal.resize.aspectUnlocked": {
    en: "Aspect ratio unlocked",
    es: "Proporción desbloqueada",
    ca: "Proporció desbloquejada",
  },
  "modal.resize.presets": {
    en: "Quick Presets:",
    es: "Ajustes Rápidos:",
    ca: "Ajustos Ràpids:",
  },
  "modal.resize.outputSize": {
    en: "Output Size:",
    es: "Tamaño de Salida:",
    ca: "Mida de sortida:",
  },
  "modal.resize.aspectRatioLabel": {
    en: "Aspect Ratio:",
    es: "Proporción:",
    ca: "Proporció:",
  },
  "modal.convert.title": {
    en: "Convert Images",
    es: "Convertir Imágenes",
    ca: "Convertir Imatges",
  },
  "modal.convert.format": {
    en: "Output Format",
    es: "Formato de Salida",
    ca: "Format de Sortida",
  },
  "modal.convert.quality": { en: "Quality", es: "Calidad", ca: "Qualitat" },
  "modal.rotate.title": {
    en: "Rotate Images",
    es: "Rotar Imágenes",
    ca: "Girar Imatges",
  },
  "modal.rotate.selected": {
    en: "Selected Rotation:",
    es: "Rotación Seleccionada:",
    ca: "Rotació Seleccionada:",
  },
  "modal.rotate.cw90": {
    en: "90° Clockwise",
    es: "90° Horario",
    ca: "90° Sentit horari",
  },
  "modal.rotate.180": { en: "180°", es: "180°", ca: "180°" },
  "modal.rotate.ccw90": {
    en: "270° (90° CCW)",
    es: "270° (90° Antihorario)",
    ca: "270° (90° Antihorari)",
  },
  "modal.rotate.button": { en: "Rotate", es: "Rotar", ca: "Girar" },

  // Upscale Modal
  "upscale.title": {
    en: "AI Image Upscale",
    es: "Upscale con IA",
    ca: "Upscale amb IA"
  },
  "upscale.desc": {
    en: "Enhance your image resolution using Artificial Intelligence executed 100% locally in your browser.",
    es: "Mejora la resolución de tu imagen utilizando Inteligencia Artificial ejecutada 100% en tu navegador.",
    ca: "Millora la resolució de la teva imatge utilitzant Intel·ligència Artificial executada 100% al teu navegador."
  },
  "upscale.hardware": {
    en: "Hardware Diagnostics",
    es: "Diagnóstico de Hardware",
    ca: "Diagnòstic de Maquinari"
  },
  "upscale.limit": {
    en: "WebGL texture limit",
    es: "Límite de textura WebGL",
    ca: "Límit de textura WebGL"
  },
  "upscale.gpu.high": {
    en: "High Performance GPU (Fast processing)",
    es: "GPU de Alto Rendimiento (Procesamiento rápido)",
    ca: "GPU d'Alt Rendiment (Processament ràpid)"
  },
  "upscale.gpu.med": {
    en: "Standard GPU (Moderate processing)",
    es: "GPU Estándar (Procesamiento moderado)",
    ca: "GPU Estàndard (Processament moderat)"
  },
  "upscale.gpu.low": {
    en: "Basic GPU (Slow processing)",
    es: "GPU Básica (Procesamiento lento)",
    ca: "GPU Bàsica (Processament lent)"
  },
  "upscale.gpu.none": {
    en: "Hardware acceleration not detected",
    es: "Aceleración de hardware no detectada",
    ca: "Acceleració de maquinari no detectada"
  },
  "upscale.gpu.error": {
    en: "Could not read graphics card",
    es: "No se pudo leer la tarjeta gráfica",
    ca: "No s'ha pogut llegir la targeta gràfica"
  },
  "upscale.gpu.loading": {
    en: "Calculating...",
    es: "Calculando...",
    ca: "Calculant..."
  },
  "upscale.factor": {
    en: "Scale Factor",
    es: "Factor de ampliación",
    ca: "Factor d'ampliació"
  },
  "upscale.warning": {
    en: "requires much more memory and processing time.",
    es: "requiere mucha más memoria y tiempo de procesamiento.",
    ca: "requereix molta més memòria i temps de processament."
  },
  "upscale.cancel": {
    en: "Cancel",
    es: "Cancelar",
    ca: "Cancel·lar"
  },
  "upscale.start": {
    en: "Start Upscale",
    es: "Iniciar Mejora",
    ca: "Iniciar Millora"
  },

  // History
  "history.title": {
    en: "Operation History",
    es: "Historial de Operaciones",
    ca: "Historial d'Operacions",
  },
  "history.empty": {
    en: "No recent operations",
    es: "Sin operaciones recientes",
    ca: "Sense operacions recents",
  },
  "history.empty.desc": {
    en: "Your processing history will appear here",
    es: "Tu historial de procesamiento aparecerá aquí",
    ca: "El teu historial de processament apareixerà aquí",
  },
  "history.clear": {
    en: "Clear History",
    es: "Limpiar Historial",
    ca: "Netejar Historial",
  },
  "history.clearConfirm": {
    en: "Clear all history?",
    es: "¿Limpiar todo el historial?",
    ca: "Vols netejar tot l'historial?",
  },
  "history.close": { en: "Close", es: "Cerrar", ca: "Tancar" },
  "history.files": { en: "files", es: "archivos", ca: "fitxers" },
  "history.file": { en: "file", es: "archivo", ca: "fitxer" },
  "history.time.now": {
    en: "Just now",
    es: "Ahora mismo",
    ca: "Ara mateix",
  },
  "history.time.min": {
    en: "{val} min ago",
    es: "Hace {val} min",
    ca: "Fa {val} min",
  },
  "history.time.hours": {
    en: "{val} h ago",
    es: "Hace {val} h",
    ca: "Fa {val} h",
  },
  "history.time.days": {
    en: "{val} days ago",
    es: "Hace {val} días",
    ca: "Fa {val} dies",
  },

  // Footer
  "footer.privacy": {
    en: "100% local processing - Your files never leave your device",
    es: "100% procesamiento local - Tus archivos nunca salen de tu dispositivo",
    ca: "100% processament local - Els teus fitxers mai surten del teu dispositiu",
  },

  // Coming Soon
  "comingSoon.title": {
    en: "Coming Soon",
    es: "Próximamente",
    ca: "Pròximament",
  },
  "comingSoon.video": {
    en: "Video tools are under development",
    es: "Herramientas de video en desarrollo",
    ca: "Eines de vídeo en desenvolupament",
  },

  // PDF Tools
  "pdf.dropzone.drag": {
    en: "Drop files here",
    es: "Suelta los archivos aquí",
    ca: "Deixa els fitxers aquí",
  },
  "pdf.dropzone.browse": {
    en: "Drop PDF files or click to browse",
    es: "Arrastra archivos PDF o haz clic para buscar",
    ca: "Arrossega fitxers PDF o fes clic per cercar",
  },
  "pdf.dropzone.formats": {
    en: "PDF files only",
    es: "Solo archivos PDF",
    ca: "Només fitxers PDF",
  },
  "pdf.processing": {
    en: "Processing...",
    es: "Procesando...",
    ca: "Processant...",
  },
  "pdf.process.button": { en: "Process", es: "Procesar", ca: "Processar" },
  "pdf.selectedFiles": {
    en: "Selected Files",
    es: "Archivos Seleccionados",
    ca: "Fitxers Seleccionats",
  },

  // General
  "general.selectedImages": {
    en: "Selected Images",
    es: "Imágenes Seleccionadas",
    ca: "Imatges Seleccionades",
  },
  "general.applying": {
    en: "Applying...",
    es: "Aplicando...",
    ca: "Aplicant...",
  },

  // Editor
  "editor.title": {
    en: "Photo Editor",
    es: "Editor de Fotos",
    ca: "Editor de Fotos",
  },
  "editor.open": { en: "Open Editor", es: "Abrir Editor", ca: "Obrir Editor" },
  "editor.save": {
    en: "Save to Device",
    es: "Guardar en Dispositivo",
    ca: "Desar al Dispositiu",
  },
  "editor.draft.save": {
    en: "Save Draft",
    es: "Guardar Borrador",
    ca: "Desar Esborrany",
  },
  "editor.draft.saved": {
    en: "Draft saved locally",
    es: "Borrador guardado localmente",
    ca: "Esborrany desat localment",
  },
  "editor.filters": { en: "Filters", es: "Filtros", ca: "Filtres" },
  "editor.adjust": { en: "Adjust", es: "Ajustar", ca: "Ajustar" },
  "editor.brightness": { en: "Brightness", es: "Brillo", ca: "Brillantor" },
  "editor.contrast": { en: "Contrast", es: "Contraste", ca: "Contrast" },
  "editor.saturation": { en: "Saturation", es: "Saturación", ca: "Saturació" },
  "editor.grayscale": {
    en: "Grayscale",
    es: "Escala de Grises",
    ca: "Escala de Grisos",
  },
  "editor.sepia": { en: "Sepia", es: "Sepia", ca: "Sípia" },
  "editor.invert": { en: "Invert", es: "Invertir", ca: "Invertir" },
  "editor.reset": { en: "Reset", es: "Restablecer", ca: "Restablir" },
  "editor.close": {
    en: "Close Editor",
    es: "Cerrar Editor",
    ca: "Tancar Editor",
  },
  "editor.noImage": {
    en: "No image selected to edit",
    es: "No hay imagen seleccionada para editar",
    ca: "No hi ha cap imatge seleccionada per editar",
  },
  // Output Gallery
  "outputs.title": { en: "Processed Files", es: "Archivos Procesados", ca: "Fitxers Processats" },
  "outputs.empty": { en: "No processed files yet", es: "Aún no hay archivos procesados", ca: "Encara no hi ha fitxers processats" },
  "outputs.download": { en: "Download", es: "Descargar", ca: "Descarregar" },
  "outputs.delete": { en: "Delete", es: "Eliminar", ca: "Eliminar" },
  "outputs.clear": { en: "Clear All", es: "Limpiar Todo", ca: "Netejar-ho Tot" },
  "outputs.category": { en: "Category", es: "Categoría", ca: "Categoria" },
  "outputs.date": { en: "Date", es: "Fecha", ca: "Data" },
  "outputs.tab": { en: "Outputs", es: "Descargas", ca: "Descàrregues" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    if (saved && (saved === "en" || saved === "es" || saved === "ca")) {
      return saved as Language;
    }

    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "es") return "es";
    if (browserLang === "ca") return "ca";

    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}