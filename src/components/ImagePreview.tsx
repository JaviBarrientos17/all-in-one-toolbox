import { useState, useEffect } from 'react'

interface ImagePreviewProps {
  files: File[]
  onRemove?: (index: number) => void
}

function ImagePreview({ files, onRemove }: ImagePreviewProps) {
  const [previews, setPreviews] = useState<string[]>([])

  useEffect(() => {
    const newPreviews: string[] = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newPreviews.push(e.target.result as string)
          if (newPreviews.length === files.length) {
            setPreviews([...newPreviews])
          }
        }
      }
      reader.readAsDataURL(file)
    })

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [files])

  if (files.length === 0) return null

  return (
    <div className="mb-6">
      <h3 className="font-medium text-slate-300 mb-3 text-sm">
        Selected Images ({files.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {files.map((file, index) => (
          <div key={index} className="relative bg-slate-800/50 rounded-xl overflow-hidden group border border-slate-700/50 hover:border-slate-600 transition-colors">
            {previews[index] && (
              <div className="aspect-square overflow-hidden bg-slate-900/50">
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-3">
              <p className="text-xs text-slate-300 truncate font-medium">{file.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-600 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImagePreview
