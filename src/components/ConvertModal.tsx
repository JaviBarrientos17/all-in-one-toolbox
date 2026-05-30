import { useState } from 'react'

interface ConvertModalProps {
  onApply: (format: string, quality: number) => void
  onCancel: () => void
}

function ConvertModal({ onApply, onCancel }: ConvertModalProps) {
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState(0.92)

  const formats = [
    { id: 'png', name: 'PNG', desc: 'Lossless, best quality, larger file' },
    { id: 'jpeg', name: 'JPEG', desc: 'Lossy, smaller file, adjustable quality' },
    { id: 'webp', name: 'WebP', desc: 'Modern, smaller than JPEG, great quality' },
  ]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-2xl p-6 max-w-md w-full border border-slate-700 dark:border-slate-700 light:border-gray-200 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-6">Convert Format</h3>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-3">Output Format:</p>
            <div className="space-y-2">
              {formats.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id)}
                  className={`w-full p-4 rounded-xl transition-all duration-200 text-left ${
                    format === fmt.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border-2 border-transparent'
                      : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 text-slate-300 dark:text-slate-300 light:text-slate-700 border-2 border-slate-600/50 dark:border-slate-600/50 light:border-gray-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{fmt.name}</span>
                    {format === fmt.id && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-xs ${format === fmt.id ? 'text-white/90' : 'text-slate-500 dark:text-slate-500 light:text-slate-600'}`}>
                    {fmt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {(format === 'jpeg' || format === 'webp') && (
            <div>
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 mb-3">
                Quality: <span className="text-indigo-400">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 dark:bg-slate-700 light:bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mt-2">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-700 dark:bg-slate-700 light:bg-gray-100 text-slate-300 dark:text-slate-300 light:text-slate-700 rounded-xl font-semibold hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(format, quality)}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConvertModal
