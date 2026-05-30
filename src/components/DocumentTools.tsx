import { useState, useRef } from 'react'
import { useHistory } from '../hooks/useHistory'

type DocumentTool = 'word-to-pdf' | 'excel-to-pdf' | 'txt-to-pdf' | 'csv-to-json' | 'json-to-csv'

function DocumentTools() {
  const [activeTool, setActiveTool] = useState<DocumentTool>('txt-to-pdf')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [processing, setProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToHistory } = useHistory()

  const tools = [
    { id: 'txt-to-pdf' as DocumentTool, name: 'TXT a PDF', icon: '📝' },
    { id: 'csv-to-json' as DocumentTool, name: 'CSV a JSON', icon: '📊' },
    { id: 'json-to-csv' as DocumentTool, name: 'JSON a CSV', icon: '📋' },
    { id: 'word-to-pdf' as DocumentTool, name: 'Word a PDF', icon: '📄', disabled: true },
    { id: 'excel-to-pdf' as DocumentTool, name: 'Excel a PDF', icon: '📈', disabled: true },
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
        'Convertir TXT a PDF',
        'document',
        selectedFiles.length,
        'Archivos de texto convertidos a PDF'
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert('Error al convertir archivos')
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
        'Convertir CSV a JSON',
        'document',
        selectedFiles.length,
        'Archivos CSV convertidos a JSON'
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert('Error al convertir archivos')
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
          alert('El archivo JSON debe contener un array de objetos')
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
        'Convertir JSON a CSV',
        'document',
        selectedFiles.length,
        'Archivos JSON convertidos a CSV'
      )
    } catch (error) {
      console.error('Error convirtiendo:', error)
      alert('Error al convertir archivos. Verifica que el JSON tenga el formato correcto.')
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
        alert('Esta función estará disponible próximamente')
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Herramientas de Documentos</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => !tool.disabled && setActiveTool(tool.id)}
            disabled={tool.disabled}
            className={`p-3 rounded-lg transition-all ${
              activeTool === tool.id
                ? 'bg-purple-600 text-white shadow-lg'
                : tool.disabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-2xl mb-1">{tool.icon}</div>
            <div className="text-sm font-medium">{tool.name}</div>
            {tool.disabled && (
              <div className="text-xs mt-1 text-gray-400">Pronto</div>
            )}
          </button>
        ))}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-all cursor-pointer ${
          isDragging
            ? 'border-purple-600 bg-purple-50 scale-105'
            : 'border-gray-300 hover:border-purple-400'
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
        <div className="text-5xl mb-4">📁</div>
        <p className="text-gray-600 mb-2 font-medium">
          {isDragging ? '¡Suelta los archivos aquí!' : 'Arrastra archivos o haz clic para seleccionar'}
        </p>
        <p className="text-sm text-gray-400">
          Formato soportado: {getAcceptedFormats()}
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            Archivos seleccionados ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                <div className="text-3xl">📄</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
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
        className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {processing ? 'Procesando...' : 'Procesar Documentos'}
      </button>
    </div>
  )
}

export default DocumentTools
