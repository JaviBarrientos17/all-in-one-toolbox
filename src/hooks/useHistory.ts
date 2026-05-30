import { useState, useEffect } from 'react'

export interface HistoryItem {
  id: string
  timestamp: Date
  operation: string
  category: string
  fileCount: number
  details: string
}

const HISTORY_KEY = 'toolbox-history'
const MAX_HISTORY_ITEMS = 50

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const withDates = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
        setHistory(withDates)
      } catch (e) {
        console.error('Error loading history:', e)
      }
    }
  }, [])

  const addToHistory = (
    operation: string,
    category: string,
    fileCount: number,
    details: string
  ) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      operation,
      category,
      fileCount,
      details
    }

    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS)
    setHistory(newHistory)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const removeItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  }

  return {
    history,
    addToHistory,
    clearHistory,
    removeItem
  }
}
