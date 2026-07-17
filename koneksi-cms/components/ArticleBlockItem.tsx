import {type ObjectItemProps} from 'sanity'

type BlockValue = {
  label?: string
}

/**
 * Isi Artikel list title: custom label when set, otherwise "Block N".
 * Subtitle nudges villagers to open the fullscreen text editor.
 */
export function ArticleBlockItem(props: ObjectItemProps) {
  const n = props.index + 1
  const customLabel = (props.value as BlockValue | undefined)?.label?.trim()
  const title = customLabel || `Block ${n}`

  return props.renderDefault({
    ...props,
    schemaType: {
      ...props.schemaType,
      title,
      // Shown as list subtitle in Studio item previews when supported
      description: 'Klik untuk membuka editor teks layar penuh',
    },
  })
}
