import type { FormatId } from '../config/formats'

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No se pudo crear el PNG.')), 'image/png')
  })
}

export function createFileName(format: FormatId): string {
  return `vorun-${format}-${Date.now()}.png`
}

export async function createPngFile(canvas: HTMLCanvasElement, format: FormatId): Promise<File> {
  const blob = await canvasToBlob(canvas)
  return new File([blob], createFileName(format), { type: 'image/png' })
}

export async function downloadPng(canvas: HTMLCanvasElement, format: FormatId): Promise<void> {
  const file = await createPngFile(canvas, format)
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function sharePng(canvas: HTMLCanvasElement, format: FormatId): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) return false
  const file = await createPngFile(canvas, format)
  if (!navigator.canShare({ files: [file] })) return false
  await navigator.share({ files: [file], title: 'Vorun' })
  return true
}
