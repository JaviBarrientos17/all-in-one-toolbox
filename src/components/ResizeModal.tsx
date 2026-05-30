import { useState } from 'react'

interface ResizeModalProps {
  onApply: (width: number, height: number, maintainAspectRatio: boolean) => void
  onCancel: () => void
}

function ResizeModal({ onApply, onCancel }: ResizeModalProps) {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [aspectRatio, setAspectRatio] = useState(800 / 600)

  const presets = [
    { name: 'HD (1920x1080)', width: 1920, height: 1080 },
    { name: 'Full HD (1280x720)', width: 1280, height: 720 },
    { name: 'Social Media (1080x1080)', width: 1080, height: 1080 },
    { name: 'Thumbnail (640x480)', width: 640, height: 480 },
  ]

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const handlePreset = (preset: typeof presets[0]) => {
    setWidth(preset.width)
    setHeight(preset.height)
    setAspectRatio(preset.width / preset.height)
  }

  const handleToggleAspectRatio = () => {
    if (!maintainAspectRatio) {
      setAspectRatio(width / height)
    }
    setMaintainAspectRatio(!maintainAspectRatio)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-700 dark:border-slate-700 light:border-gray-200 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-6">Resize Images</h3>

        {/* Quick Presets */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-3">Quick Presets:</p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset)}
                className="p-3 text-sm bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-200 text-slate-300 dark:text-slate-300 light:text-slate-700 rounded-xl transition-all duration-200 border border-slate-600/50 dark:border-slate-600/50 light:border-gray-300 hover:border-slate-500"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom dimensions */}
        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 mb-2">
              Width (px)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
              min="1"
              max="10000"
              className="w-full px-4 py-3 bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-50 border border-slate-600 dark:border-slate-600 light:border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder-slate-500"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleToggleAspectRatio}
              className={`p-2 rounded-lg transition-all ${
                maintainAspectRatio
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-100 text-slate-400 dark:text-slate-400 light:text-slate-500'
              }`}
              title={maintainAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
            >
              {maintainAspectRatio ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700 mb-2">
              Height (px)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
              min="1"
              max="10000"
              className="w-full px-4 py-3 bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-50 border border-slate-600 dark:border-slate-600 light:border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-200 dark:text-slate-200 light:text-slate-900 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-700/30 dark:bg-slate-700/30 light:bg-gray-50 p-4 rounded-xl text-center border border-slate-600/50 dark:border-slate-600/50 light:border-gray-200 mb-6">
          <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-2">Output Size:</p>
          <p className="text-lg font-bold text-slate-200 dark:text-slate-200 light:text-slate-900">
            {width} × {height} px
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 light:text-slate-600 mt-1">
            Aspect Ratio: {(width / height).toFixed(2)}:1
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-700 dark:bg-slate-700 light:bg-gray-100 text-slate-300 dark:text-slate-300 light:text-slate-700 rounded-xl font-semibold hover:bg-slate-600 dark:hover:bg-slate-600 light:hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onApply(width, height, maintainAspectRatio)}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResizeModal
