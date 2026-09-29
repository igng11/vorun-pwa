import type { FormatConfig } from '../config/formats'
import type { EditorSettings } from '../types/editor'

export interface RenderResult {
  overflow: boolean
  lines: string[]
  bounds: TextBounds
  position: TextPosition
}

export interface TextBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface TextPosition {
  x: number
  y: number
}

export const SAFE_MARGIN = 88

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function breakLongLine(ctx: CanvasRenderingContext2D, line: string, maxWidth: number): string[] {
  if (!line) return ['']
  if (ctx.measureText(line).width <= maxWidth) return [line]

  const words = line.trim().split(/\s+/)
  const output: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate
    } else if (current) {
      output.push(current)
      current = word
    } else {
      output.push(word)
    }
  }

  if (current) output.push(current)
  return output
}

export function drawMultilineText(
  ctx: CanvasRenderingContext2D,
  text: string,
  format: FormatConfig,
  settings: EditorSettings,
): RenderResult {
  const maxWidth = format.width - SAFE_MARGIN * 2
  const lineHeightPx = settings.fontSize * settings.lineHeight
  ctx.font = `${settings.italic ? 'italic ' : ''}400 ${settings.fontSize}px "${settings.font}"`
  ctx.textAlign = settings.align
  ctx.textBaseline = 'middle'
  ctx.fillStyle = settings.background === 'black' ? '#ffffff' : '#000000'

  const lines = text.split('\n').flatMap((line) => breakLongLine(ctx, line, maxWidth))
  const blockHeight = Math.max(lineHeightPx, lines.length * lineHeightPx)
  const italicOverhang = settings.italic ? settings.fontSize * 0.18 : 0
  const blockWidth = Math.min(
    maxWidth,
    Math.max(settings.fontSize * 0.25, ...lines.map((line) => ctx.measureText(line).width)) + italicOverhang,
  )
  const desiredCenterX = (settings.horizontalPosition / 100) * format.width
  const desiredCenter = (settings.verticalPosition / 100) * format.height
  const minCenterX = SAFE_MARGIN + blockWidth / 2
  const maxCenterX = format.width - SAFE_MARGIN - blockWidth / 2
  const minCenter = SAFE_MARGIN + blockHeight / 2
  const maxCenter = format.height - SAFE_MARGIN - blockHeight / 2
  const centerX = minCenterX <= maxCenterX
    ? clamp(desiredCenterX, minCenterX, maxCenterX)
    : format.width / 2
  const centerY = minCenter <= maxCenter
    ? clamp(desiredCenter, minCenter, maxCenter)
    : format.height / 2

  const x = settings.align === 'left'
    ? centerX - blockWidth / 2
    : settings.align === 'right'
      ? centerX + blockWidth / 2
      : centerX

  const firstLineY = centerY - ((lines.length - 1) * lineHeightPx) / 2
  lines.forEach((line, index) => ctx.fillText(line, x, firstLineY + index * lineHeightPx, maxWidth))

  const hasWideWord = lines.some((line) => ctx.measureText(line).width > maxWidth + 1)
  return {
    overflow: blockHeight > format.height - SAFE_MARGIN * 2 || hasWideWord,
    lines,
    bounds: {
      x: centerX - blockWidth / 2,
      y: centerY - blockHeight / 2,
      width: blockWidth,
      height: blockHeight,
    },
    position: {
      x: (centerX / format.width) * 100,
      y: (centerY / format.height) * 100,
    },
  }
}

export function renderCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  format: FormatConfig,
  settings: EditorSettings,
): RenderResult {
  if (canvas.width !== format.width) canvas.width = format.width
  if (canvas.height !== format.height) canvas.height = format.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo iniciar el lienzo.')

  ctx.fillStyle = settings.background === 'black' ? '#000000' : '#ffffff'
  ctx.fillRect(0, 0, format.width, format.height)
  return drawMultilineText(ctx, text, format, settings)
}
