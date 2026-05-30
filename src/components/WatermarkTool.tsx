import { useState, useRef } from 'react'

interface WatermarkToolProps {
  files: File[]
  onComplete: (processedCount: number) => void
  onCancel: () => void
}

function WatermarkTool({ files, onComplete, onCancel }: WatermarkToolProps) {
  const [text, setText] = useState('© 2026')
  const [fontSize, setFontSize] = useState(36)
  const [opacity, setOpacity] = useState(0.5)
  const [position, setPosition] = useState<'center' | 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'>('bottom-right')
  const [processing, setProcessing] = useState(false)

  const positions = [
    { value: 'center', label: 'Centro' },
    { value: 'top-right', label: 'Arriba derecha' },
    { value: 'top-left', label: 'Arriba izquierda' },
    { value: 'bottom-right', label: 'Abajo derecha' },
    { value: 'bottom-left', label: 'Abajo izquierda' },
  ]

  const handleApply = async () => {
    if (!text.trim()) {
      alert('Escribe el texto de la marca de agua')
      return
    }

    setProcessing(true)

    try {
      let processedCount = 0

      for (const file of files) {
        const img = new Image()
        const reader = new FileReader()

        await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            img.src = e.target?.result as string

            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext('2d')

              if (!ctx) {
                reject(new Error('No se pudo crear el contexto'))
                return
              }

              // Dibujar imagen
              ctx.drawImage(img, 0, 0)

              // Configurar texto
              ctx.font = `${fontSize}px Arial`
              ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
              ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.5})`
              ctx.lineWidth = 2

              const textMetrics = ctx.measureText(text)
              const textWidth = textMetrics.width
              const textHeight = fontSize

              let x = 0
              let y = 0

              // Calcular posición
              switch (position) {
                case 'center':
                  x = (canvas.width - textWidth) / 2
                  y = (canvas.height + textHeight) / 2
                  break
                case 'top-right':
                  x = canvas.width - textWidth - 20
                  y = textHeight + 20
                  break
                case 'top-left':
                  x = 20
                  y = textHeight + 20
                  break
                case 'bottom-right':
                  x = canvas.width - textWidth - 20
                  y = canvas.height - 20
                  break
                case 'bottom-left':
                  x = 20
                  y = canvas.height - 20
                  break
              }

              // Dibujar texto con borde
              ctx.strokeText(text, x, y)
              ctx.fillText(text, x, y)

              canvas.toBlob((blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `watermarked_${file.name}`
                  a.click()
                  URL.revokeObjectURL(url)
                  processedCount++
                  resolve(null)
                }
              }, file.type)
            }

            img.onerror = () => reject(new Error('Error cargando imagen'))
          }

          reader.onerror = () => reject(new Error('Error leyendo archivo'))
          reader.readAsDataURL(file)
        })
      }

      onComplete(processedCount)
    } catch (error) {
      console.error('Error aplicando marca de agua:', error)
      alert('Error al aplicar marca de agua')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-100 mb-4">Watermark Settings</h3>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="© 2026 My Company"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Font Size: <span className="text-indigo-400">{fontSize}px</span>
            </label>
            <input
              type="range"
              min="12"
              max="120"
              step="4"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Opacity: <span className="text-indigo-400">{Math.round(opacity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200"
            >
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value} className="bg-slate-800">
                  {pos.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-700/30 p-4 rounded-xl text-center border border-slate-600/50">
            <p className="text-sm text-slate-400 mb-2">Preview:</p>
            <div
              style={{
                fontSize: `${fontSize * 0.3}px`,
                opacity: opacity,
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {text || 'Sample text'}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={processing}
            className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={processing}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50"
          >
            {processing ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WatermarkTool
