import { useEffect, useRef } from 'react'
import type { FormatConfig } from '../config/formats'
import type { EditorSettings } from '../types/editor'
import { renderCanvas } from '../lib/canvasRenderer'

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  text: string
  format: FormatConfig
  settings: EditorSettings
  fontsReady: boolean
  onOverflow: (overflow: boolean) => void
}

export function CanvasPreview({ canvasRef, text, format, settings, fontsReady, onOverflow }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!fontsReady || !canvasRef.current) return
    const result = renderCanvas(canvasRef.current, text, format, settings)
    onOverflow(result.overflow)
  }, [canvasRef, text, format, settings, fontsReady, onOverflow])

  return (
    <div className="preview-shell">
      <div className="preview-heading">
        <span>Preview</span>
        <span>{format.width} × {format.height}</span>
      </div>
      <div ref={wrapperRef} className="canvas-wrap" style={{ aspectRatio: `${format.width} / ${format.height}` }}>
        <canvas ref={canvasRef} width={format.width} height={format.height} aria-label="Vista previa de la placa" />
        {!fontsReady && <div className="canvas-loading">Cargando tipografías…</div>}
      </div>
    </div>
  )
}
