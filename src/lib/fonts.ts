import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-400-italic.css'
import '@fontsource/dm-sans/latin-500.css'
import '@fontsource/italiana/latin-400.css'

const REQUIRED_FONTS = [
  '400 16px "DM Sans"',
  'italic 400 16px "DM Sans"',
  '500 16px "DM Sans"',
  '400 16px "Italiana"',
]

export async function ensureFontsLoaded(): Promise<void> {
  if (!document.fonts) throw new Error('Este navegador no permite verificar la carga de fuentes.')

  await document.fonts.ready
  await Promise.all(REQUIRED_FONTS.map((font) => document.fonts.load(font, 'Vorun')))

  const missing = REQUIRED_FONTS.filter((font) => !document.fonts.check(font, 'Vorun'))
  if (missing.length) throw new Error('Las tipografías de Vorun todavía no están listas. Intentá de nuevo.')
}
