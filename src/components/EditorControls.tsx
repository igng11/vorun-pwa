import { FORMATS, type FormatId } from '../config/formats'
import { PRESETS, type Preset, type PresetId } from '../config/presets'
import type { Background, EditorSettings, FontFamily, TextAlign } from '../types/editor'
import { SegmentedControl } from './SegmentedControl'

interface Props {
  text: string
  settings: EditorSettings
  overflow: boolean
  onTextChange: (text: string) => void
  onSettingsChange: (settings: EditorSettings) => void
}

export function EditorControls({ text, settings, overflow, onTextChange, onSettingsChange }: Props) {
  const update = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const applyPreset = (preset: Preset) => {
    onSettingsChange({
      ...settings,
      preset: preset.id,
      font: preset.font,
      fontSize: preset.fontSize,
      align: preset.align,
      verticalPosition: preset.verticalPosition,
      lineHeight: preset.lineHeight,
    })
  }

  return (
    <section className="controls" aria-label="Editor">
      <fieldset className="control-group preset-group">
        <legend>Preset</legend>
        <div className="preset-list">
          {PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.id}
              className={settings.preset === preset.id ? 'active' : ''}
              onClick={() => applyPreset(preset)}
              aria-pressed={settings.preset === preset.id}
            >
              <span className="preset-number">{preset.number}</span>
              <span><strong>{preset.name}</strong><small>{preset.description}</small></span>
            </button>
          ))}
        </div>
      </fieldset>

      <SegmentedControl<FormatId>
        label="Formato"
        value={settings.format}
        options={Object.values(FORMATS).map((item) => ({ value: item.id, label: item.label, meta: item.ratio }))}
        onChange={(value) => update('format', value)}
      />

      <SegmentedControl<Background>
        label="Fondo"
        value={settings.background}
        options={[{ value: 'black', label: 'Negro' }, { value: 'white', label: 'Blanco' }]}
        onChange={(value) => update('background', value)}
      />

      <label className="control-group text-control">
        <span>Texto</span>
        <textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          rows={5}
          placeholder="Escribí una idea.\nDejala respirar."
          spellCheck
        />
        <span className={`text-status ${overflow ? 'warning' : ''}`}>
          {overflow ? 'El texto excede el área segura. Reducí el tamaño o el contenido.' : `${text.length} caracteres`}
        </span>
      </label>

      <SegmentedControl<FontFamily>
        label="Tipografía"
        value={settings.font}
        options={[{ value: 'DM Sans', label: 'DM Sans' }, { value: 'Italiana', label: 'Italiana' }]}
        onChange={(value) => update('font', value)}
      />

      <label className="control-group range-control">
        <span><span>Tamaño</span><output>{settings.fontSize}px</output></span>
        <input type="range" min="40" max="180" step="2" value={settings.fontSize} onChange={(e) => update('fontSize', Number(e.target.value))} />
      </label>

      <SegmentedControl<TextAlign>
        label="Alineación"
        value={settings.align}
        options={[{ value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' }]}
        onChange={(value) => update('align', value)}
      />

      <label className="control-group range-control">
        <span><span>Posición vertical</span><output>{settings.verticalPosition}%</output></span>
        <input type="range" min="10" max="90" step="1" value={settings.verticalPosition} onChange={(e) => update('verticalPosition', Number(e.target.value))} />
      </label>
    </section>
  )
}
