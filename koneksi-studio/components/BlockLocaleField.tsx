import {useFormValue, type FieldProps} from 'sanity'

type Locale = 'id' | 'en'

/**
 * Sets the field title to "Block N (Indonesia|English)" based on
 * this item's position in the parent `blocks` array.
 */
export function createBlockLocaleField(locale: Locale) {
  const label = locale === 'id' ? 'Indonesia' : 'English'

  return function BlockLocaleField(props: FieldProps) {
    const blocks = useFormValue(['blocks']) as {_key: string}[] | undefined
    const keySegment = props.path.find(
      (segment): segment is {_key: string} =>
        typeof segment === 'object' && segment !== null && '_key' in segment,
    )
    const index =
      keySegment && blocks
        ? blocks.findIndex((block) => block._key === keySegment._key)
        : -1
    const n = index >= 0 ? index + 1 : 1

    return props.renderDefault({
      ...props,
      title: `Block ${n} (${label})`,
    })
  }
}
