import { useState, useRef } from 'react'
import { useHistory } from '../hooks/useHistory'
import { useLanguage } from '../contexts/LanguageContext'

type DocumentTool = 'word-to-pdf' | 'excel-to-pdf' | 'txt-to-pdf' | 'csv-to-json' | 'json-to-csv'

function DocumentTools() {
  const [activeTool, setActiveTool] = useState<DocumentTool>('txt-to-pdf')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToHistory } = useHistory()
  const { t } = useLanguage()

  const tools = [
    { id: 'txt-to-pdf' as DocumentTool, name: t('doc.toPDF'), icon: '📝' },
    { id: 'csv-to-json' as DocumentTool, name: 'CSV → JSON', icon: '📊' },
    { id: 'json-to-csv' as DocumentTool, name: 'JSON → CSV', icon: '📋' },
    { id: 'word-to-pdf' as DocumentTool, name: t('doc.toWord'), icon: '📄', disabled: true },
    { id: 'excel-to-pdf' as DocumentTool, name: t('doc.toExcel'), icon: '📈', disabled: true },
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
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

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleTxtToPdf = async () => {
    if (selectedFiles.length === 0) return

    setProcessing(true)

    try {
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

      for (const file of selectedFiles) {
        const text = await file.text()
        const pdfDoc = await PDFDocument.create()
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Courier)

        const pageWidth = 595
        const pageHeight = 842
        const margin = 50
        const fontSize = 12
        const lineHeight = fontSize * 1.2

        let page = pdfDoc.addPage([pageWidth, pageHeight])
        let yPosition = pageHeight - margin

        const lines = text.split('\n')

        for (const line of lines) {
          if (yPosition < margin + lineHeight) {
            page = pdfDoc.addPage([pageWidth, pageHeight])
            yPosition = pageHeight - margin
          }

          page.drawText(line, {
            x: margin,
            y: yPosition,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })

          yPosition -= lineHeight
        }

        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.[^/.]+$/, '.pdf')
        a.click()
        URL.revokeObjectURL(url)
      }

      addToHistory(
        t('doc.history.convert'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert(t('pdf.alert.error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleCsvToJson = async () => {
    if (selectedFiles.length === 0) return

    setProcessing(true)

    try {
      for (const file of selectedFiles) {
        const text = await file.text()
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length === 0) continue

        const headers = lines[0].split(',').map(h => h.trim())
        const data = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim())
          const obj: any = {}

          headers.forEach((header, index) => {
            obj[header] = values[index] || ''
          })

          data.push(obj)
        }

        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.[^/.]+$/, '.json')
        a.click()
        URL.revokeObjectURL(url)
      }

      addToHistory(
        t('doc.history.convert'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert(t('pdf.alert.error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleJsonToCsv = async () => {
    if (selectedFiles.length === 0) return

    setProcessing(true)

    try {
      for (const file of selectedFiles) {
        const text = await file.text()
        const data = JSON.parse(text)

        if (!Array.isArray(data) || data.length === 0) {
          alert(t('pdf.alert.error'))
          continue
        }

        const headers = Object.keys(data[0])
        const csvLines = [headers.join(',')]

        data.forEach((item: any) => {
          const values = headers.map(header => {
            const value = item[header] || ''
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value
          })
          csvLines.push(values.join(','))
        })

        const csvString = csvLines.join('\n')
        const blob = new Blob([csvString], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.[^/.]+$/, '.csv')
        a.click()
        URL.revokeObjectURL(url)
      }

      addToHistory(
        t('doc.history.convert'),
        'document',
        selectedFiles.length,
        `${selectedFiles.length} ${t('doc.history.convertDesc')}`
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert(t('pdf.alert.error'))
    } finally {
      setProcessing(false)
    }
  }

  const handleProcess = () => {
    switch (activeTool) {
      case 'txt-to-pdf':
        handleTxtToPdf()
        break
      case 'csv-to-json':
        handleCsvToJson()
        break
      case 'json-to-csv':
        handleJsonToCsv()
        break
      case 'word-to-pdf':
      case 'excel-to-pdf':
        alert(t('comingSoon.title'))
        break
    }
  }

  const getAcceptedFormats = () => {
    switch (activeTool) {
      case 'txt-to-pdf': return '.txt'
      case 'csv-to-json': return '.csv'
      case 'json-to-csv': return '.json'
      case 'word-to-pdf': return '.doc,.docx'
      case 'excel-to-pdf': return '.xls,.xlsx'
      default: return '*'
    }
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4 sm:mb-6">{t('doc.title')}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4 sm:mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => !tool.disabled && setActiveTool(tool.id)}
            disabled={tool.disabled}
            className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                : tool.disabled
                ? 'bg-gray-200 dark:bg-slate-800/30 text-gray-400 dark:text-slate-600 cursor-not-allowed border border-gray-300 dark:border-slate-700/50'
                : 'bg-gray-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600/50'
            }`}
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{tool.icon}</div>
            <div className="text-[10px] sm:text-xs font-medium leading-tight">{tool.name}</div>
            {tool.disabled && (
              <div className="text-[9px] sm:text-xs mt-0.5 sm:mt-1 opacity-75">{t('comingSoon.title')}</div>
            )}
            {activeTool === tool.id && !tool.disabled && (
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
          accept={getAcceptedFormats()}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-indigo-500/20' : 'bg-gray-200 dark:bg-slate-700/50'
          }`}>
            <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${isDragging ? 'text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className={`text-sm sm:text-base font-medium mb-1 ${isDragging ? 'text-indigo-400' : 'text-slate-900 dark:text-slate-200'}`}>
              {isDragging ? t('doc.dropzone.drag') : t('doc.dropzone.browse')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-500">
              {t('doc.dropzone.formats')}
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3 text-xs sm:text-sm">
            {t('doc.selectedFiles')} ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-gray-100 dark:bg-slate-800/50 p-3 sm:p-4 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3 border border-gray-300 dark:border-slate-700/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-200 dark:bg-slate-700/50 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-200 truncate font-medium">{file.name}</p>
                  <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-500 mt-0.5 sm:mt-1">
                    {(file.size / 1024).toFixed(2)} KB
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
            <span className="truncate">{t('doc.processing')}</span>
          </span>
        ) : (
          <span className="truncate">{t('doc.process.button')}</span>
        )}
      </button>
    </div>
  )
}

export default DocumentTools
