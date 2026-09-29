export type FormatId = 'post' | 'story' | 'square'

export interface FormatConfig {
  id: FormatId
  label: string
  ratio: string
  width: number
  height: number
}

export const FORMATS: Record<FormatId, FormatConfig> = {
  post: { id: 'post', label: 'Post', ratio: '4:5', width: 1080, height: 1350 },
  story: { id: 'story', label: 'Story', ratio: '9:16', width: 1080, height: 1920 },
  square: { id: 'square', label: 'Square', ratio: '1:1', width: 1080, height: 1080 },
}
