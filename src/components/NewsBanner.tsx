import { useEffect, useState } from "react"

type NewsItem = {
  id: string
  title?: string
  body?: string
  date?: string
  url?: string
}

interface Props {
  srcUrl?: string
  pollIntervalMs?: number
}

export default function NewsBanner({ srcUrl = '/news.json', pollIntervalMs = 30000 }: Props) {
  const [items, setItems] = useState<NewsItem[]>([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    async function fetchNews() {
      try {
        const res = await fetch(srcUrl, { signal: controller.signal })
        if (!res.ok) return
        const data = await res.json()
        if (mounted && Array.isArray(data)) setItems(data)
      } catch (e) {
        // ignore fetch errors silently
      }
    }

    fetchNews()
    const id = setInterval(fetchNews, pollIntervalMs)
    return () => {
      mounted = false
      controller.abort()
      clearInterval(id)
    }
  }, [srcUrl, pollIntervalMs])

  if (!visible || items.length === 0) return null

  return (
    <section role="region" aria-live="polite" className="mb-4">
      <div className="border border-indigo-300/60 dark:border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-900/10 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M2 5a2 2 0 012-2h10l4 4v9a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
            </svg>
            Novedades
          </h2>

          <div className="mt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="truncate">
                {item.url ? (
                  <a
                    href={item.url}
                    className="font-medium underline text-indigo-600 dark:text-indigo-300 hover:text-indigo-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span className="font-medium">{item.title}</span>
                )}
                {item.body && <div className="text-[12px] text-slate-600 dark:text-slate-400 truncate">{item.body}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setVisible(false)} className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">Cerrar</button>
        </div>
      </div>
    </section>
  )
}
