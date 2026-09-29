import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import type { FormatConfig } from '../config/formats'
import type { EditorSettings } from '../types/editor'
import { renderCanvas, SAFE_MARGIN, type RenderResult } from '../lib/canvasRenderer'

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  text: string
  format: FormatConfig
  settings: EditorSettings
  fontsReady: boolean
  onOverflow: (overflow: boolean) => void
  onPositionChange: (horizontalPosition: number, verticalPosition: number) => void
}

interface DragState {
  pointerId: number
  clientX: number
  clientY: number
  horizontalPosition: number
  verticalPosition: number
  blockWidth: number
  blockHeight: number
}

const HIT_PADDING = 24

export function CanvasPreview({ canvasRef, text, format, settings, fontsReady, onOverflow, onPositionChange }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<RenderResult | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const [renderResult, setRenderResult] = useState<RenderResult | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!fontsReady || !canvasRef.current) return
    const result = renderCanvas(canvasRef.current, text, format, settings)
    resultRef.current = result
    setRenderResult(result)
    onOverflow(result.overflow)
    if (
      Math.abs(result.position.x - settings.horizontalPosition) > 0.01
      || Math.abs(result.position.y - settings.verticalPosition) > 0.01
    ) {
      onPositionChange(result.position.x, result.position.y)
    }
  }, [canvasRef, text, format, settings, fontsReady, onOverflow, onPositionChange])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const result = resultRef.current
    if (!result || !wrapperRef.current) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      horizontalPosition: result.position.x,
      verticalPosition: result.position.y,
      blockWidth: result.bounds.width,
      blockHeight: result.bounds.height,
    }
    setDragging(true)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const wrapper = wrapperRef.current
    if (!drag || !wrapper || drag.pointerId !== event.pointerId) return
    event.preventDefault()

    const rect = wrapper.getBoundingClientRect()
    const deltaX = ((event.clientX - drag.clientX) / rect.width) * 100
    const deltaY = ((event.clientY - drag.clientY) / rect.height) * 100
    const minX = ((SAFE_MARGIN + drag.blockWidth / 2) / format.width) * 100
    const maxX = 100 - minX
    const minY = ((SAFE_MARGIN + drag.blockHeight / 2) / format.height) * 100
    const maxY = 100 - minY
    const nextX = Math.min(Math.max(drag.horizontalPosition + deltaX, minX), maxX)
    const nextY = Math.min(Math.max(drag.verticalPosition + deltaY, minY), maxY)
    onPositionChange(nextX, nextY)
  }

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const dragTargetStyle = renderResult && text.length
    ? {
        left: `${((renderResult.bounds.x - HIT_PADDING) / format.width) * 100}%`,
        top: `${((renderResult.bounds.y - HIT_PADDING) / format.height) * 100}%`,
        width: `${((renderResult.bounds.width + HIT_PADDING * 2) / format.width) * 100}%`,
        height: `${((renderResult.bounds.height + HIT_PADDING * 2) / format.height) * 100}%`,
      } as CSSProperties
    : undefined

  return (
    <div className="preview-shell">
      <div className="preview-heading">
        <span>Preview</span>
        <span>{format.width} × {format.height}</span>
      </div>
      <div ref={wrapperRef} className="canvas-wrap" style={{ aspectRatio: `${format.width} / ${format.height}` }}>
        <canvas ref={canvasRef} width={format.width} height={format.height} aria-label="Vista previa de la placa" />
        {dragTargetStyle && (
          <div
            className={`text-drag-target${dragging ? ' dragging' : ''}`}
            style={dragTargetStyle}
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            onLostPointerCapture={() => {
              dragRef.current = null
              setDragging(false)
            }}
          />
        )}
        {!fontsReady && <div className="canvas-loading">Cargando tipografías…</div>}
      </div>
    </div>
  )
}
