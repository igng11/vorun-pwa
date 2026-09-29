interface Option<T extends string> {
  value: T
  label: string
  meta?: string
}

interface Props<T extends string> {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: Props<T>) {
  return (
    <fieldset className="control-group">
      <legend>{label}</legend>
      <div className="segmented">
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            className={value === option.value ? 'active' : ''}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            <span>{option.label}</span>
            {option.meta && <small>{option.meta}</small>}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
