import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'es'

interface Translations {
  [key: string]: {
    en: string
    es: string
  }
}

export const translations: Translations = {
  // Header
  'app.title': { en: 'All-in-One Toolbox', es: 'All-in-One Toolbox' },
  'app.subtitle': { en: '100% Local Processing', es: '100% Procesamiento Local' },
  'app.pageTitle': { en: 'All-in-One Toolbox - Local File Processing', es: 'All-in-One Toolbox - Procesamiento Local de Archivos' },
  'header.history': { en: 'History', es: 'Historial' },
  'header.theme.light': { en: 'Switch to light mode', es: 'Cambiar a modo claro' },
  'header.theme.dark': { en: 'Switch to dark mode', es: 'Cambiar a modo oscuro' },

  // Categories
  'category.image': { en: 'Images', es: 'Imágenes' },
  'category.pdf': { en: 'PDF', es: 'PDF' },
  'category.video': { en: 'Video', es: 'Video' },
  'category.document': { en: 'Documents', es: 'Documentos' },

  // Image Tools
  'image.title': { en: 'Image Tools', es: 'Herramientas de Imagen' },
  'image.compress': { en: 'Compress', es: 'Comprimir' },
  'image.resize': { en: 'Resize', es: 'Redimensionar' },
  'image.convert': { en: 'Convert', es: 'Convertir' },
  'image.rotate': { en: 'Rotate', es: 'Rotar' },
  'image.watermark': { en: 'Watermark', es: 'Marca de Agua' },
  'image.crop': { en: 'Crop', es: 'Recortar' },
  'image.dropzone.drag': { en: 'Drop files here', es: 'Suelta los archivos aquí' },
  'image.dropzone.browse': { en: 'Drop files or click to browse', es: 'Arrastra archivos o haz clic para buscar' },
  'image.dropzone.formats': { en: 'JPG, PNG, GIF, WebP, HEIC supported', es: 'JPG, PNG, GIF, WebP, HEIC soportados' },
  'image.processing': { en: 'Processing...', es: 'Procesando...' },
  'image.process.button': { en: 'Process', es: 'Procesar' },
  'image.process.single': { en: 'image', es: 'imagen' },
  'image.process.plural': { en: 'images', es: 'imágenes' },

  // PDF Tools
  'pdf.title': { en: 'PDF Tools', es: 'Herramientas PDF' },
  'pdf.merge': { en: 'Merge', es: 'Fusionar' },
  'pdf.split': { en: 'Split', es: 'Dividir' },
  'pdf.compress': { en: 'Compress', es: 'Comprimir' },
  'pdf.rotate': { en: 'Rotate', es: 'Rotar' },
  'pdf.extract': { en: 'Extract Pages', es: 'Extraer Páginas' },
  'pdf.alert.mergeMin': { en: 'Select at least 2 PDF files to merge', es: 'Selecciona al menos 2 archivos PDF para fusionar' },
  'pdf.alert.splitOne': { en: 'Select exactly 1 PDF file to split', es: 'Selecciona exactamente 1 archivo PDF para dividir' },
  'pdf.alert.error': { en: 'Error processing PDF', es: 'Error al procesar el PDF' },
  'pdf.history.merge': { en: 'Merge PDFs', es: 'Fusionar PDFs' },
  'pdf.history.mergeDesc': { en: 'PDFs merged into one', es: 'PDFs fusionados en uno' },
  'pdf.history.split': { en: 'Split PDF', es: 'Dividir PDF' },
  'pdf.history.splitDesc': { en: 'pages extracted', es: 'páginas extraídas' },
  'pdf.history.compress': { en: 'Compress PDF', es: 'Comprimir PDF' },
  'pdf.history.compressDesc': { en: 'PDF compressed', es: 'PDF comprimido' },
  'pdf.history.rotate': { en: 'Rotate PDF', es: 'Rotar PDF' },
  'pdf.history.rotateDesc': { en: 'PDF rotated', es: 'PDF rotado' },

  // Document Tools
  'doc.title': { en: 'Document Tools', es: 'Herramientas de Documentos' },
  'doc.toPDF': { en: 'TXT to PDF', es: 'TXT a PDF' },
  'doc.toWord': { en: 'Word to PDF', es: 'Word a PDF' },
  'doc.toExcel': { en: 'Excel to PDF', es: 'Excel a PDF' },
  'doc.toPowerPoint': { en: 'To PowerPoint', es: 'A PowerPoint' },
  'doc.dropzone.drag': { en: 'Drop files here', es: '¡Suelta los archivos aquí!' },
  'doc.dropzone.browse': { en: 'Drop files or click to browse', es: 'Arrastra archivos o haz clic para seleccionar' },
  'doc.dropzone.formats': { en: 'Supported format: .txt, .csv, .json', es: 'Formato soportado: .txt, .csv, .json' },
  'doc.processing': { en: 'Processing...', es: 'Procesando...' },
  'doc.process.button': { en: 'Process Documents', es: 'Procesar Documentos' },
  'doc.selectedFiles': { en: 'Selected Files', es: 'Archivos seleccionados' },
  'doc.history.convert': { en: 'Convert documents', es: 'Convertir documentos' },
  'doc.history.convertDesc': { en: 'documents converted', es: 'documentos convertidos' },

  // Modals
  'modal.cancel': { en: 'Cancel', es: 'Cancelar' },
  'modal.apply': { en: 'Apply', es: 'Aplicar' },
  'modal.compress.title': { en: 'Compression Settings', es: 'Configuración de Compresión' },
  'modal.compress.quality': { en: 'Quality', es: 'Calidad' },
  'modal.compress.maxSize': { en: 'Max Size', es: 'Tamaño Máximo' },
  'modal.compress.maxDimension': { en: 'Max Dimension', es: 'Dimensión Máxima' },
  'modal.compress.presets': { en: 'Quick Presets:', es: 'Ajustes Rápidos:' },
  'modal.compress.preset.high': { en: 'High Quality', es: 'Alta calidad' },
  'modal.compress.preset.balanced': { en: 'Balanced', es: 'Equilibrada' },
  'modal.compress.preset.web': { en: 'Web Optimized', es: 'Web optimizada' },
  'modal.compress.preset.max': { en: 'Max Compression', es: 'Máxima compresión' },
  'modal.resize.title': { en: 'Resize Images', es: 'Redimensionar Imágenes' },
  'modal.resize.width': { en: 'Width (px)', es: 'Ancho (px)' },
  'modal.resize.height': { en: 'Height (px)', es: 'Alto (px)' },
  'modal.resize.aspectRatio': { en: 'Lock aspect ratio', es: 'Bloquear proporción' },
  'modal.resize.aspectLocked': { en: 'Aspect ratio locked', es: 'Proporción bloqueada' },
  'modal.resize.aspectUnlocked': { en: 'Aspect ratio unlocked', es: 'Proporción desbloqueada' },
  'modal.resize.presets': { en: 'Quick Presets:', es: 'Ajustes Rápidos:' },
  'modal.resize.outputSize': { en: 'Output Size:', es: 'Tamaño de Salida:' },
  'modal.resize.aspectRatioLabel': { en: 'Aspect Ratio:', es: 'Proporción:' },
  'modal.convert.title': { en: 'Convert Images', es: 'Convertir Imágenes' },
  'modal.convert.format': { en: 'Output Format', es: 'Formato de Salida' },
  'modal.convert.quality': { en: 'Quality', es: 'Calidad' },
  'modal.rotate.title': { en: 'Rotate Images', es: 'Rotar Imágenes' },
  'modal.rotate.selected': { en: 'Selected Rotation:', es: 'Rotación Seleccionada:' },
  'modal.rotate.cw90': { en: '90° Clockwise', es: '90° Horario' },
  'modal.rotate.180': { en: '180°', es: '180°' },
  'modal.rotate.ccw90': { en: '270° (90° CCW)', es: '270° (90° Antihorario)' },
  'modal.rotate.button': { en: 'Rotate', es: 'Rotar' },

  // History
  'history.title': { en: 'Operation History', es: 'Historial de Operaciones' },
  'history.empty': { en: 'No recent operations', es: 'Sin operaciones recientes' },
  'history.empty.desc': { en: 'Your processing history will appear here', es: 'Tu historial de procesamiento aparecerá aquí' },
  'history.clear': { en: 'Clear History', es: 'Limpiar Historial' },
  'history.clearConfirm': { en: 'Clear all history?', es: '¿Limpiar todo el historial?' },
  'history.close': { en: 'Close', es: 'Cerrar' },
  'history.files': { en: 'files', es: 'archivos' },
  'history.file': { en: 'file', es: 'archivo' },

  // Footer
  'footer.privacy': { en: '100% local processing - Your files never leave your device', es: '100% procesamiento local - Tus archivos nunca salen de tu dispositivo' },

  // Coming Soon
  'comingSoon.title': { en: 'Coming Soon', es: 'Próximamente' },
  'comingSoon.video': { en: 'Video tools are under development', es: 'Herramientas de video en desarrollo' },

  // PDF Tools
  'pdf.dropzone.drag': { en: 'Drop files here', es: 'Suelta los archivos aquí' },
  'pdf.dropzone.browse': { en: 'Drop PDF files or click to browse', es: 'Arrastra archivos PDF o haz clic para buscar' },
  'pdf.dropzone.formats': { en: 'PDF files only', es: 'Solo archivos PDF' },
  'pdf.processing': { en: 'Processing...', es: 'Procesando...' },
  'pdf.process.button': { en: 'Process', es: 'Procesar' },
  'pdf.selectedFiles': { en: 'Selected Files', es: 'Archivos Seleccionados' },

  // General
  'general.selectedImages': { en: 'Selected Images', es: 'Imágenes Seleccionadas' },
  'general.applying': { en: 'Applying...', es: 'Aplicando...' },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
