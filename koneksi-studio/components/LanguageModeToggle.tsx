import {Card, Flex, Switch, Text} from '@sanity/ui'
import {type BooleanInputProps, set} from 'sanity'

/**
 * Toggle: on = Indonesian-only article; off = bilingual (ID + EN required).
 */
export function LanguageModeToggle(props: BooleanInputProps) {
  const {value, onChange, readOnly, elementProps} = props
  // Missing/undefined = Indonesian-only (matches initialValue and legacy articles)
  const indonesianOnly = value !== false

  return (
    <Card
      padding={3}
      radius={2}
      shadow={1}
      tone={indonesianOnly ? 'caution' : 'positive'}
      border
    >
      <Flex align="center" gap={3}>
        <Switch
          id={elementProps.id}
          checked={indonesianOnly}
          disabled={readOnly}
          onChange={(event) => {
            onChange(set(event.currentTarget.checked))
          }}
        />
        <Text size={1} weight="medium">
          {indonesianOnly
            ? 'Artikel hanya tersedia dalam Bahasa Indonesia'
            : 'Artikel tersedia dalam Bahasa Indonesia dan Inggris'}
        </Text>
      </Flex>
    </Card>
  )
}
