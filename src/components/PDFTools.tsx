import { useState, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { useHistory } from '../hooks/useHistory'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

type PDFTool = 'merge' | 'split' | 'compress' | 'extract' | 'rotate'

function PDFTools() {
  const [activeTool, setActiveTool] = useState<PDFTool>('merge')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToHistory } = useHistory()

  const tools = [
    { id: 'merge' as PDFTool, name: 'Fusionar', icon: '🔗' },
    { id: 'split' as PDFTool, name: 'Dividir', icon: '✂️' },
    { id: 'compress' as PDFTool, name: 'Comprimir', icon: '🗜️' },
    { id: 'extract' as PDFTool, name: 'Extraer Páginas', icon: '📄' },
    { id: 'rotate' as PDFTool, name: 'Rotar', icon: '↻' },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      alert('Selecciona al menos 2 archivos PDF para fusionar')
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
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      saveAs(blob, 'merged.pdf')

      addToHistory(
        'Fusionar PDFs',
        'pdf',
        selectedFiles.length,
        `${selectedFiles.length} PDFs fusionados en uno`
      )
    } catch (error) {
      console.error('Error fusionando PDFs:', error)
      alert('Error al fusionar los PDFs')
    } finally {
      setProcessing(false)
    }
  }

  const handleSplit = async () => {
    if (selectedFiles.length !== 1) {
      alert('Selecciona exactamente 1 archivo PDF para dividir')
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
        'Dividir PDF',
        'pdf',
        1,
        `PDF dividido en ${pageCount} páginas`
      )
    } catch (error) {
      console.error('Error dividiendo PDF:', error)
      alert('Error al dividir el PDF')
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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
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
      <h2 className="text-xl font-semibold text-slate-200 mb-6">PDF Tools</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`group relative p-4 rounded-xl transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
            }`}
          >
            <div className="text-2xl mb-2">{tool.icon}</div>
            <div className="text-xs font-medium">{tool.name}</div>
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
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center mb-6 transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
            : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
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
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-indigo-500/20' : 'bg-slate-700/50'
          }`}>
            <svg className={`w-8 h-8 ${isDragging ? 'text-indigo-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className={`text-base font-medium mb-1 ${isDragging ? 'text-indigo-400' : 'text-slate-200'}`}>
              {isDragging
                ? 'Drop PDFs here'
                : activeTool === 'merge'
                ? 'Drop multiple PDFs or click to browse'
                : 'Drop PDF or click to browse'}
            </p>
            <p className="text-sm text-slate-500">PDF files only</p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-slate-300 mb-3 text-sm">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-slate-800/50 p-4 rounded-xl flex items-center gap-3 border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate font-medium">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
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
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:shadow-none"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Process PDF'
        )}
      </button>
    </div>
  )
}

export default PDFTools
