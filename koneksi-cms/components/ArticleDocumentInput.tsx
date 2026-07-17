import {useCallback, useEffect} from 'react'
import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {type ObjectInputProps} from 'sanity'
import {usePaneRouter} from 'sanity/structure'

/**
 * Sticky bar at the top of every article document form so villagers can
 * always return to the file list without hunting for pane chrome.
 */
export function ArticleDocumentInput(props: ObjectInputProps) {
  const paneRouter = usePaneRouter()

  const closeDocument = useCallback(() => {
    paneRouter.closeCurrent()
  }, [paneRouter])

  useEffect(() => {
    const onCloseRequest = () => {
      paneRouter.closeCurrent()
    }
    window.addEventListener('koneksi:close-document-pane', onCloseRequest)
    return () => {
      window.removeEventListener('koneksi:close-document-pane', onCloseRequest)
    }
  }, [paneRouter])

  return (
    <Stack space={4}>
      <Card
        padding={3}
        radius={2}
        border
        shadow={1}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'var(--card-bg-color)',
        }}
      >
        <Flex align="center" justify="space-between" gap={3} wrap="wrap">
          <Text size={1} weight="medium">
            Form artikel
          </Text>
          <Button
            text="← Kembali ke daftar artikel"
            mode="ghost"
            tone="primary"
            padding={3}
            fontSize={1}
            onClick={closeDocument}
          />
        </Flex>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  )
}
