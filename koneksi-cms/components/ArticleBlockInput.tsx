import {useCallback} from 'react'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {type ObjectInputProps} from 'sanity'

/**
 * Full-screen-friendly article block editor chrome.
 * Shown when a villager opens an Isi Artikel block (rich-text pair).
 * Sticky controls stay visible: minimize dialog + return to article list.
 */
export function ArticleBlockInput(props: ObjectInputProps) {
  const minimize = useCallback(() => {
    // Blur nested focus so Sanity closes the array-item dialog
    props.onPathFocus([])
    // Fallback if focus alone does not dismiss the dialog
    window.setTimeout(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      )
    }, 0)
  }, [props])

  const backToList = useCallback(() => {
    minimize()
    window.setTimeout(() => {
      // Close the document pane → reveal the article list again
      try {
        // Dynamic import path kept local so this stays usable if structure context is absent
        const event = new CustomEvent('koneksi:close-document-pane')
        window.dispatchEvent(event)
      } catch {
        /* ignore */
      }
    }, 50)
  }, [minimize])

  return (
    <Stack space={4}>
      <Card
        padding={3}
        radius={2}
        shadow={2}
        tone="primary"
        border
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--card-bg-color)',
        }}
      >
        <Stack space={3}>
          <Text size={2} weight="bold">
            Editor teks artikel
          </Text>
          <Text size={1} muted>
            Editor terbuka layar penuh. Gunakan tombol di bawah untuk kecilkan atau kembali ke
            daftar file.
          </Text>
          <Flex gap={2} wrap="wrap">
            <Button
              text="Kecilkan editor"
              mode="default"
              tone="default"
              padding={3}
              fontSize={1}
              onClick={minimize}
            />
            <Button
              text="← Kembali ke daftar artikel"
              mode="ghost"
              tone="primary"
              padding={3}
              fontSize={1}
              onClick={backToList}
            />
          </Flex>
        </Stack>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  )
}
