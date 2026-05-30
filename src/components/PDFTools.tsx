import { useState, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useHistory } from '../hooks/useHistory'
import { useLanguage } from '../contexts/LanguageContext'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

type PDFTool = 'merge' | 'split' | 'compress' | 'extract' | 'rotate'

function PDFTools() {
  const [activeTool, setActiveTool] = useState<PDFTool>('merge')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToHistory } = useHistory()
  const { t } = useLanguage()

  const tools = [
    { id: 'merge' as PDFTool, name: t('pdf.merge'), icon: '🔗' },
    { id: 'split' as PDFTool, name: t('pdf.split'), icon: '✂️' },
    { id: 'compress' as PDFTool, name: t('pdf.compress'), icon: '🗜️' },
    { id: 'extract' as PDFTool, name: t('pdf.extract'), icon: '📄' },
    { id: 'rotate' as PDFTool, name: t('pdf.rotate'), icon: '↻' },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert(t('pdf.alert.mergeMin'))
      return
    }

    setProcessing(true)

    try {
      const { PDFDocument } = await import('pdf-lib')
      const mergedPdf = await PDFDocument.create()

      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }

      const mergedPdfBytes = await mergedPdf.save()
      const blob = new Blob([mergedPdfBytes as BlobPart], { type: 'application/pdf' })
      saveAs(blob, 'merged.pdf')

      addToHistory(
        t('pdf.history.merge'),
        'pdf',
        selectedFiles.length,
        `${selectedFiles.length} ${t('pdf.history.mergeDesc')}`
      )
    } catch (error) {
      console.error('Error fusionando PDFs:', error)
      alert(t('pdf.alert.error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleSplit = async () => {
    if (selectedFiles.length !== 1) {
      alert(t('pdf.alert.splitOne'))
      return
    }

    setProcessing(true)

    try {
      const { PDFDocument } = await import('pdf-lib')
      const file = selectedFiles[0]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const pageCount = pdf.getPageCount()

      const zip = new JSZip()

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create()
        const [copiedPage] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(copiedPage)

        const pdfBytes = await newPdf.save()
        zip.file(`page_${i + 1}.pdf`, pdfBytes)
      }

      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${file.name.replace('.pdf', '')}_split.zip`)

      addToHistory(
        t('pdf.history.split'),
        'pdf',
        1,
        `${pageCount} ${t('pdf.history.splitDesc')}`
      )
    } catch (error) {
      console.error('Error dividiendo PDF:', error)
      alert(t('pdf.alert.error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleExtractPages = async () => {
    if (selectedFiles.length !== 1) {
      alert('Selecciona exactamente 1 archivo PDF')
      return
    }

    const pagesInput = prompt('Páginas a extraer (ej: 1,3,5-7):', '1-3')
    if (!pagesInput) return

    setProcessing(true)

    try {
      const { PDFDocument } = await import('pdf-lib')
      const file = selectedFiles[0]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)

      const pageIndices: number[] = []
      const parts = pagesInput.split(',')

      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number)
          for (let i = start; i <= end; i++) {
            pageIndices.push(i - 1)
          }
        } else {
          pageIndices.push(Number(part) - 1)
        }
      }

      const newPdf = await PDFDocument.create()
      const copiedPages = await newPdf.copyPages(pdf, pageIndices)
      copiedPages.forEach((page) => newPdf.addPage(page))

      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      saveAs(blob, `extracted_${file.name}`)

      addToHistory(
        'Extraer páginas de PDF',
        'pdf',
        1,
        `Páginas extraídas: ${pagesInput}`
      )
    } catch (error) {
      console.error('Error extrayendo páginas:', error)
      alert('Error al extraer páginas')
    } finally {
      setProcessing(false)
    }
  }

  const handleRotate = async () => {
    if (selectedFiles.length !== 1) {
      alert('Selecciona exactamente 1 archivo PDF')
      return
    }

    const degrees = prompt('Grados de rotación (90, 180, 270):', '90')
    if (!degrees) return

    const rotation = parseInt(degrees)
    if (![90, 180, 270].includes(rotation)) {
      alert('Solo se permiten rotaciones de 90, 180 o 270 grados')
      return
    }

    setProcessing(true)

    try {
      const { PDFDocument, degrees: degreesLib } = await import('pdf-lib')
      const file = selectedFiles[0]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)

      const pages = pdf.getPages()
      let rotationAngle

      switch (rotation) {
        case 90:
          rotationAngle = degreesLib(90)
          break
        case 180:
          rotationAngle = degreesLib(180)
          break
        case 270:
          rotationAngle = degreesLib(270)
          break
        default:
          rotationAngle = degreesLib(90)
      }

      pages.forEach((page) => {
        page.setRotation(rotationAngle)
      })

      const pdfBytes = await pdf.save()
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
      saveAs(blob, `rotated_${file.name}`)

      addToHistory(
        'Rotar PDF',
        'pdf',
        1,
        `PDF rotado ${rotation}°`
      )
    } catch (error) {
      console.error('Error rotando PDF:', error)
      alert('Error al rotar el PDF')
    } finally {
      setProcessing(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type === 'application/pdf'
    )

    if (files.length > 0) {
      if (activeTool === 'merge') {
        setSelectedFiles(files)
      } else {
        setSelectedFiles([files[0]])
      }
    }
  }

  const handleProcess = () => {
    switch (activeTool) {
      case 'merge':
        handleMerge()
        break
      case 'split':
        handleSplit()
        break
      case 'extract':
        handleExtractPages()
        break
      case 'rotate':
        handleRotate()
        break
      case 'compress':
        alert('Función de compresión en desarrollo')
        break
    }
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4 sm:mb-6">{t('pdf.title')}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4 sm:mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-gray-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600/50'
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{tool.icon}</div>
            <div className="text-[10px] sm:text-xs font-medium leading-tight">{tool.name}</div>
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
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
            : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/30 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple={activeTool === 'merge'}
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-indigo-500/20' : 'bg-gray-200 dark:bg-slate-700/50'
          }`}>
            <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${isDragging ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className={`text-sm sm:text-base font-medium mb-1 ${isDragging ? 'text-indigo-400' : 'text-slate-900 dark:text-slate-200'}`}>
              {isDragging ? t('pdf.dropzone.drag') : t('pdf.dropzone.browse')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-500">{t('pdf.dropzone.formats')}</p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">
            {t('pdf.selectedFiles')} ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-gray-100 dark:bg-slate-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 border border-gray-300 dark:border-slate-700/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 dark:bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-200 truncate font-medium">{file.name}</p>
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
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="truncate">{t('pdf.processing')}</span>
          </span>
        ) : (
          <span className="truncate">{t('pdf.process.button')}</span>
        )}
      </button>
    </div>
  )
}

export default PDFTools
