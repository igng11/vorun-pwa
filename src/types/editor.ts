import type { FormatId } from '../config/formats'
import type { PresetId } from '../config/presets'

export type Background = 'black' | 'white'
export type FontFamily = 'DM Sans' | 'Italiana'
export type TextAlign = 'left' | 'center' | 'right'

export interface EditorSettings {
  format: FormatId
  background: Background
  font: FontFamily
  fontSize: number
  italic: boolean
  align: TextAlign
  horizontalPosition: number
  verticalPosition: number
  lineHeight: number
  preset: PresetId
}
