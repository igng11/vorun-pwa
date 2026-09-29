import type { FontFamily, TextAlign } from '../types/editor'

export type PresetId = 'statement' | 'editorial' | 'minimal'

export interface Preset {
  id: PresetId
  number: string
  name: string
  description: string
  font: FontFamily
  fontSize: number
  italic: boolean
  align: TextAlign
  horizontalPosition: number
  verticalPosition: number
  lineHeight: number
}

export const PRESETS: Preset[] = [
  {
    id: 'statement', number: '01', name: 'Statement', description: 'Directo',
    font: 'DM Sans', fontSize: 112, italic: false, align: 'left', horizontalPosition: 34, verticalPosition: 50, lineHeight: 1.02,
  },
  {
    id: 'editorial', number: '02', name: 'Editorial', description: 'Más aire',
    font: 'Italiana', fontSize: 126, italic: true, align: 'center', horizontalPosition: 50, verticalPosition: 45, lineHeight: 1.14,
  },
  {
    id: 'minimal', number: '03', name: 'Minimal', description: 'Espacio negativo',
    font: 'DM Sans', fontSize: 66, italic: false, align: 'left', horizontalPosition: 30, verticalPosition: 62, lineHeight: 1.18,
  },
]
