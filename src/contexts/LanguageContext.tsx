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
  'pdf.merge': { en: 'Merge', es: 'Combinar' },
  'pdf.split': { en: 'Split', es: 'Dividir' },
  'pdf.compress': { en: 'Compress', es: 'Comprimir' },
  'pdf.rotate': { en: 'Rotate', es: 'Rotar' },
  'pdf.extract': { en: 'Extract Pages', es: 'Extraer Páginas' },

  // Document Tools
  'doc.title': { en: 'Document Tools', es: 'Herramientas de Documentos' },
  'doc.toWord': { en: 'To Word', es: 'A Word' },
  'doc.toExcel': { en: 'To Excel', es: 'A Excel' },
  'doc.toPowerPoint': { en: 'To PowerPoint', es: 'A PowerPoint' },

  // Modals
  'modal.cancel': { en: 'Cancel', es: 'Cancelar' },
  'modal.apply': { en: 'Apply', es: 'Aplicar' },
  'modal.compress.title': { en: 'Compression Settings', es: 'Configuración de Compresión' },
  'modal.compress.quality': { en: 'Quality', es: 'Calidad' },
  'modal.compress.maxSize': { en: 'Max Size (MB)', es: 'Tamaño Máximo (MB)' },
  'modal.compress.maxDimension': { en: 'Max Dimension (px)', es: 'Dimensión Máxima (px)' },
  'modal.resize.title': { en: 'Resize Images', es: 'Redimensionar Imágenes' },
  'modal.resize.width': { en: 'Width', es: 'Ancho' },
  'modal.resize.height': { en: 'Height', es: 'Alto' },
  'modal.resize.aspectRatio': { en: 'Lock aspect ratio', es: 'Bloquear proporción' },
  'modal.resize.presets': { en: 'Quick Presets', es: 'Ajustes Rápidos' },
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
  'history.title': { en: 'Processing History', es: 'Historial de Procesamiento' },
  'history.empty': { en: 'No operations yet', es: 'Sin operaciones todavía' },
  'history.empty.desc': { en: 'Your processing history will appear here', es: 'Tu historial de procesamiento aparecerá aquí' },
  'history.clear': { en: 'Clear History', es: 'Limpiar Historial' },
  'history.close': { en: 'Close', es: 'Cerrar' },
  'history.files': { en: 'files', es: 'archivos' },

  // Footer
  'footer.privacy': { en: '100% local processing - Your files never leave your device', es: '100% procesamiento local - Tus archivos nunca salen de tu dispositivo' },

  // Coming Soon
  'comingSoon.title': { en: 'Coming Soon', es: 'Próximamente' },
  'comingSoon.video': { en: 'Video tools are under development', es: 'Herramientas de video en desarrollo' },
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
