import {type ObjectItemProps} from 'sanity'

type BlockValue = {
  label?: string
}

/**
 * Isi Artikel list title: custom label when set, otherwise "Block N".
 * Editor field titles (Block N Indonesia/English) stay number-based.
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
    },
  })
}
