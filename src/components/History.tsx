import { useHistory } from '../hooks/useHistory'

interface HistoryProps {
  isOpen: boolean
  onClose: () => void
}

function History({ isOpen, onClose }: HistoryProps) {
  const { history, clearHistory, removeItem } = useHistory()

  if (!isOpen) return null

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Ahora mismo'
    if (minutes < 60) return `Hace ${minutes} min`
    if (hours < 24) return `Hace ${hours} h`
    return `Hace ${days} días`
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image': return '🖼️'
      case 'pdf': return '📄'
      case 'video': return '🎬'
      case 'document': return '📝'
      default: return '📁'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
      <div className="bg-slate-800 rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl md:max-h-[80vh] flex flex-col border border-slate-700 shadow-2xl">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">Operation History</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-400">No recent operations</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 group border border-slate-700/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center text-xl">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-200">{item.operation}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{item.details}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(item.timestamp)}
                        </span>
                        <span>•</span>
                        <span>{item.fileCount} file{item.fileCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6 border-t border-slate-700">
            <button
              onClick={() => {
                if (confirm('Clear all history?')) {
                  clearHistory()
                }
              }}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-xl font-semibold transition-all duration-200"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default History
