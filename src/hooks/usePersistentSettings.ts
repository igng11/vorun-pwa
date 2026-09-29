import { useEffect, useState } from 'react'
import type { EditorSettings } from '../types/editor'

const STORAGE_KEY = 'vorun-editor-preferences-v1'

export const DEFAULT_SETTINGS: EditorSettings = {
  format: 'post',
  background: 'black',
  font: 'DM Sans',
  fontSize: 112,
  align: 'left',
  verticalPosition: 50,
  lineHeight: 1.02,
  preset: 'statement',
}

export function usePersistentSettings() {
  const [settings, setSettings] = useState<EditorSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  return [settings, setSettings] as const
}
