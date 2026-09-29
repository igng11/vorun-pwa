import { useCallback, useEffect, useRef, useState } from 'react'
import { CanvasPreview } from './components/CanvasPreview'
import { EditorControls } from './components/EditorControls'
import { FORMATS } from './config/formats'
import { usePersistentSettings } from './hooks/usePersistentSettings'
import { downloadPng, sharePng } from './lib/exportImage'
import { ensureFontsLoaded } from './lib/fonts'
import './styles.css'

const INITIAL_TEXT = 'CREAR ES\nTOMAR POSICIÓN.'

function App() {
  const [text, setText] = useState(INITIAL_TEXT)
  const [settings, setSettings] = usePersistentSettings()
  const [fontsReady, setFontsReady] = useState(false)
  const [fontError, setFontError] = useState('')
  const [overflow, setOverflow] = useState(false)
  const [busy, setBusy] = useState<'export' | 'share' | null>(null)
  const [message, setMessage] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    ensureFontsLoaded().then(() => setFontsReady(true)).catch((error: Error) => setFontError(error.message))
  }, [])

  const format = FORMATS[settings.format]
  const handleOverflow = useCallback((value: boolean) => setOverflow(value), [])

  const handleExport = async () => {
    if (!canvasRef.current || !fontsReady) return
    setBusy('export')
    setMessage('')
    try {
      await ensureFontsLoaded()
      await downloadPng(canvasRef.current, settings.format)
      setMessage('PNG listo para guardar.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo exportar.')
    } finally {
      setBusy(null)
    }
  }

  const handleShare = async () => {
    if (!canvasRef.current || !fontsReady) return
    setBusy('share')
    setMessage('')
    try {
      await ensureFontsLoaded()
      const shared = await sharePng(canvasRef.current, settings.format)
      if (!shared) setMessage('Compartir archivos no está disponible en este navegador. Usá Exportar PNG.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setMessage(error instanceof Error ? error.message : 'No se pudo compartir.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Vorun, inicio">VORUN<span>®</span></a>
        <span className="tool-name">Social image maker</span>
      </header>

      <main id="top">
        <div className="intro">
          <p>Herramienta 01</p>
          <h1>Placas tipográficas<br />para Instagram.</h1>
        </div>

        {fontError && <div className="global-error" role="alert">{fontError}</div>}

        <div className="workspace">
          <div className="preview-column">
            <CanvasPreview
              canvasRef={canvasRef}
              text={text}
              format={format}
              settings={settings}
              fontsReady={fontsReady}
              onOverflow={handleOverflow}
            />
          </div>

          <div className="editor-column">
            <EditorControls
              text={text}
              settings={settings}
              overflow={overflow}
              onTextChange={setText}
              onSettingsChange={setSettings}
            />

            <div className="actions">
              <button className="export-button" type="button" disabled={!fontsReady || !!busy} onClick={handleExport}>
                <span>{busy === 'export' ? 'Exportando…' : 'Exportar PNG'}</span>
                <span aria-hidden="true">↓</span>
              </button>
              <button className="share-button" type="button" disabled={!fontsReady || !!busy} onClick={handleShare}>
                {busy === 'share' ? 'Compartiendo…' : 'Compartir'}
              </button>
              {message && <p className="action-message" role="status">{message}</p>}
            </div>
          </div>
        </div>
      </main>

      <footer><span>Vorun Studio</span><span>Buenos Aires — {new Date().getFullYear()}</span></footer>
    </div>
  )
}

export default App
