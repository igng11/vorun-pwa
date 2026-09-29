import type { FontFamily, TextAlign } from '../types/editor'

export type PresetId = 'statement' | 'editorial' | 'minimal'

export interface Preset {
  id: PresetId
  number: string
  name: string
  description: string
  font: FontFamily
  fontSize: number
  align: TextAlign
  verticalPosition: number
  lineHeight: number
}

export const PRESETS: Preset[] = [
  {
    id: 'statement', number: '01', name: 'Statement', description: 'Directo',
    font: 'DM Sans', fontSize: 112, align: 'left', verticalPosition: 50, lineHeight: 1.02,
  },
  {
    id: 'editorial', number: '02', name: 'Editorial', description: 'Más aire',
    font: 'Italiana', fontSize: 126, align: 'center', verticalPosition: 45, lineHeight: 1.14,
  },
  {
    id: 'minimal', number: '03', name: 'Minimal', description: 'Espacio negativo',
    font: 'DM Sans', fontSize: 66, align: 'left', verticalPosition: 62, lineHeight: 1.18,
  },
]
