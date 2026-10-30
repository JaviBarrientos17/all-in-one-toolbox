import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface RotateModalProps {
  onApply: (degrees: number) => void
  onCancel: () => void
}

function RotateModal({ onApply, onCancel }: RotateModalProps) {
  const [degrees, setDegrees] = useState(90)
  const { t } = useLanguage()

  const options = [
    { degrees: 90, label: t('modal.rotate.cw90'), icon: '↻' },
    { degrees: 180, label: t('modal.rotate.180'), icon: '↺' },
    { degrees: 270, label: t('modal.rotate.ccw90'), icon: '↺' },
  ]

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="toolbox-modal-card bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-gray-200 dark:border-slate-700 shadow-2xl">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">{t('modal.rotate.title')}</h3>

        <div className="space-y-3 mb-6">
          {options.map((option) => (
            <button
              key={option.degrees}
              onClick={() => setDegrees(option.degrees)}
              className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-4 ${
                degrees === option.degrees
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border-2 border-transparent'
                  : 'bg-gray-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-2 border-gray-300 dark:border-slate-600/50 hover:border-gray-400 dark:hover:border-slate-500'
              }`}
            >
              <span className="text-3xl">{option.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-bold">{option.label}</div>
              </div>
              {degrees === option.degrees && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl text-center border border-gray-200 dark:border-slate-600/50 mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{t('modal.rotate.selected')}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-200">
            {degrees}°
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            {t('modal.cancel')}
          </button>
          <button
            onClick={() => onApply(degrees)}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/25"
          >
            {t('modal.rotate.button')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RotateModal
