import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface CropModalProps {
  file: File
  onApply: (x: number, y: number, width: number, height: number) => void
  onCancel: () => void
}

function CropModal({ file, onApply, onCancel }: CropModalProps) {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [imageData, setImageData] = useState<{ src: string; width: number; height: number } | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 100, height: 100 })

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImageData({ src: e.target?.result as string, width: img.width, height: img.height })
        setSelection({ x: 0, y: 0, width: img.width, height: img.height })
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [file])

  useEffect(() => {
    if (!imageData || !canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const maxWidth = containerRef.current.clientWidth - 20
    const maxHeight = 400
    const scaleX = maxWidth / imageData.width
    const scaleY = maxHeight / imageData.height
    const newScale = Math.min(scaleX, scaleY, 1)

    canvas.width = imageData.width * newScale
    canvas.height = imageData.height * newScale
    ;(canvas as any).cropScale = newScale

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const sx = selection.x * newScale
      const sy = selection.y * newScale
      const sw = selection.width * newScale
      const sh = selection.height * newScale

      ctx.save()
      ctx.clearRect(sx, sy, sw, sh)
      ctx.drawImage(img, selection.x, selection.y, selection.width, selection.height, sx, sy, sw, sh)
      ctx.restore()

      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 2
      ctx.strokeRect(sx, sy, sw, sh)

      ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(sx + sw / 2, sy)
      ctx.lineTo(sx + sw / 2, sy + sh)
      ctx.moveTo(sx, sy + sh / 2)
      ctx.lineTo(sx + sw, sy + sh / 2)
      ctx.stroke()
      ctx.setLineDash([])

      const cornerSize = 10
      ctx.fillStyle = '#60a5fa'
      const corners = [[sx, sy], [sx + sw, sy], [sx, sy + sh], [sx + sw, sy + sh]]
      corners.forEach((corner) => {
        ctx.fillRect(corner[0] - cornerSize / 2, corner[1] - cornerSize / 2, cornerSize, cornerSize)
      })
    }
    img.src = imageData.src
  }, [imageData, selection])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageData) return
    const rect = canvasRef.current.getBoundingClientRect()
    const scale = (canvasRef.current as any).cropScale || 1
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale
    setIsSelecting(true)
    setStartPos({ x: Math.max(0, Math.min(x, imageData.width)), y: Math.max(0, Math.min(y, imageData.height)) })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !canvasRef.current || !imageData) return
    const rect = canvasRef.current.getBoundingClientRect()
    const scale = (canvasRef.current as any).cropScale || 1
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    let newX = Math.min(startPos.x, x)
    let newY = Math.min(startPos.y, y)
    let newWidth = Math.abs(x - startPos.x)
    let newHeight = Math.abs(y - startPos.y)

    newX = Math.max(0, Math.min(newX, imageData.width))
    newY = Math.max(0, Math.min(newY, imageData.height))
    newWidth = Math.min(newWidth, imageData.width - newX)
    newHeight = Math.min(newHeight, imageData.height - newY)

    if (newWidth > 5 && newHeight > 5) {
      setSelection({ x: newX, y: newY, width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const handlePreset = (aspect: { width: number; height: number }) => {
    if (!imageData) return
    let newWidth = Math.min(aspect.width, imageData.width)
    let newHeight = Math.min(aspect.height, imageData.height)

    const ratio = aspect.width / aspect.height
    if (Math.abs(newWidth / newHeight - ratio) > 0.01) {
      newHeight = Math.round(newWidth / ratio)
      if (newHeight > imageData.height) {
        newHeight = imageData.height
        newWidth = Math.round(newHeight * ratio)
      }
    }

    const newX = Math.max(0, (imageData.width - newWidth) / 2)
    const newY = Math.max(0, (imageData.height - newHeight) / 2)
    setSelection({ x: newX, y: newY, width: newWidth, height: newHeight })
  }

  const presets = [
    { name: '16:9', width: 1920, height: 1080 },
    { name: '4:3', width: 800, height: 600 },
    { name: '1:1 (Cuadrado)', width: 500, height: 500 },
    { name: '9:16 (Retrato)', width: 1080, height: 1920 },
  ]

  if (!imageData) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-lg w-full border border-slate-700 shadow-2xl">
          <p className="text-slate-300">{t('image.processing')}</p>
        </div>
      </div>
    )
  }

  const imgWidth = imageData.width
  const imgHeight = imageData.height

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full border border-slate-700 dark:border-slate-700 light:border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-4">
          {t('image.crop')}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-4">Haz clic y arrastra para seleccionar el área a recortar</p>

        <div ref={containerRef} className="mb-4 bg-black rounded-lg overflow-hidden border border-slate-600">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full cursor-crosshair block"
          />
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-2 sm:mb-3">
            Relación de aspecto
          </p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset)}
                className="p-2 sm:p-3 text-xs sm:text-sm bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-200 text-slate-300 dark:text-slate-300 light:text-slate-700 rounded-lg sm:rounded-xl transition-all duration-200 border border-slate-600/50 dark:border-slate-600/50 light:border-gray-300 hover:border-slate-500"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4 sm:mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">X (px)</label>
            <input
              type="number"
              value={Math.round(selection.x)}
              onChange={(e) => {
                const val = Math.max(0, Math.min(parseInt(e.target.value) || 0, imgWidth - 1))
                setSelection({ ...selection, x: val })
              }}
              min={0}
              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Y (px)</label>
            <input
              type="number"
              value={Math.round(selection.y)}
              onChange={(e) => {
                const val = Math.max(0, Math.min(parseInt(e.target.value) || 0, imgHeight - 1))
                setSelection({ ...selection, y: val })
              }}
              min={0}
              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Ancho (px)</label>
            <input
              type="number"
              value={Math.round(selection.width)}
              onChange={(e) => {
                const val = Math.max(1, Math.min(parseInt(e.target.value) || 1, imgWidth - selection.x))
                setSelection({ ...selection, width: val })
              }}
              min={1}
              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Alto (px)</label>
            <input
              type="number"
              value={Math.round(selection.height)}
              onChange={(e) => {
                const val = Math.max(1, Math.min(parseInt(e.target.value) || 1, imgHeight - selection.y))
                setSelection({ ...selection, height: val })
              }}
              min={1}
              className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            {t('modal.cancel')}
          </button>
          <button
            onClick={() => onApply(selection.x, selection.y, selection.width, selection.height)}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            {t('image.crop')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CropModal
