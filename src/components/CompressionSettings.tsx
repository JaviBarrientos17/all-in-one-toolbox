import { useState } from 'react'

interface CompressionSettingsProps {
  onApply: (settings: CompressionOptions) => void
  onCancel: () => void
}

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  quality: number
}

function CompressionSettings({ onApply, onCancel }: CompressionSettingsProps) {
  const [maxSizeMB, setMaxSizeMB] = useState(1)
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920)
  const [quality, setQuality] = useState(0.8)

  const presets = [
    { name: 'Alta calidad', maxSizeMB: 2, maxWidthOrHeight: 2560, quality: 0.9 },
    { name: 'Equilibrada', maxSizeMB: 1, maxWidthOrHeight: 1920, quality: 0.8 },
    { name: 'Web optimizada', maxSizeMB: 0.5, maxWidthOrHeight: 1280, quality: 0.7 },
    { name: 'Máxima compresión', maxSizeMB: 0.2, maxWidthOrHeight: 800, quality: 0.6 },
  ]

  const handlePreset = (preset: typeof presets[0]) => {
    setMaxSizeMB(preset.maxSizeMB)
    setMaxWidthOrHeight(preset.maxWidthOrHeight)
    setQuality(preset.quality)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-100 mb-4">Compression Settings</h3>

        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3">Quick Presets:</p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset)}
                className="p-3 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Max Size: <span className="text-indigo-400">{maxSizeMB} MB</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={maxSizeMB}
              onChange={(e) => setMaxSizeMB(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Max Dimension: <span className="text-indigo-400">{maxWidthOrHeight}px</span>
            </label>
            <input
              type="range"
              min="480"
              max="3840"
              step="80"
              value={maxWidthOrHeight}
              onChange={(e) => setMaxWidthOrHeight(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Quality: <span className="text-indigo-400">{Math.round(quality * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-700 text-slate-300 rounded-xl font-semibold hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply({ maxSizeMB, maxWidthOrHeight, quality })}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompressionSettings
