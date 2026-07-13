import {useEffect, useRef, useState, type ChangeEvent, type FocusEvent} from 'react'
import {Box, Button, Dialog, Flex, Spinner, Stack, Text, TextInput} from '@sanity/ui'
import {type SlugInputProps, set, unset, useFormValue} from 'sanity'

const DEBOUNCE_MS = 2000

function slugify(input: string, maxLength: number): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, maxLength)
    .replace(/-$/g, '')
}

function isCustomSlug(
  title: string | undefined,
  slug: string | undefined,
  maxLength: number,
): boolean {
  const trimmed = title?.trim() ?? ''
  if (!trimmed || !slug) return false
  return slug !== slugify(trimmed, maxLength)
}

/**
 * Slug input that auto-generates from `title_id` after 2s of no typing.
 * Manual edit requires confirmation (disables auto); can be re-enabled.
 */
export function AutoSlugInput(props: SlugInputProps) {
  const {value, onChange, readOnly, elementProps, schemaType} = props
  const titleId = useFormValue(['title_id']) as string | undefined
  const maxLength = schemaType.options?.maxLength ?? 96

  const [autoGenerate, setAutoGenerate] = useState(
    () => !isCustomSlug(titleId, value?.current, maxLength),
  )
  const [isPending, setIsPending] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [manualDraft, setManualDraft] = useState(value?.current ?? '')

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastGeneratedForTitle = useRef<string | null>(null)
  const currentSlugRef = useRef(value?.current)
  currentSlugRef.current = value?.current
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Keep manual draft in sync when value changes from outside (e.g. re-enable auto)
  useEffect(() => {
    if (autoGenerate) {
      setManualDraft(value?.current ?? '')
    }
  }, [value?.current, autoGenerate])

  // Debounced auto-generate from Indonesian title
  useEffect(() => {
    if (!autoGenerate || readOnly) {
      setIsPending(false)
      return
    }

    const title = titleId?.trim() ?? ''

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!title) {
      setIsPending(false)
      lastGeneratedForTitle.current = null
      if (currentSlugRef.current) {
        onChangeRef.current(unset())
      }
      return
    }

    const expected = slugify(title, maxLength)
    const current = currentSlugRef.current

    // Already generated for this title — skip (covers initial load of existing docs)
    if (lastGeneratedForTitle.current === title && current === expected) {
      setIsPending(false)
      return
    }

    if (lastGeneratedForTitle.current === null && current === expected) {
      lastGeneratedForTitle.current = title
      setIsPending(false)
      return
    }

    setIsPending(true)

    timerRef.current = setTimeout(() => {
      const next = slugify(title, maxLength)
      lastGeneratedForTitle.current = title
      setIsPending(false)
      timerRef.current = null

      if (next) {
        onChangeRef.current(set({_type: 'slug', current: next}))
      } else {
        onChangeRef.current(unset())
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [titleId, autoGenerate, readOnly, maxLength])

  const requestManualEdit = () => {
    if (autoGenerate && !readOnly) {
      setShowConfirmDialog(true)
    }
  }

  const confirmManualEdit = () => {
    setAutoGenerate(false)
    setShowConfirmDialog(false)
    setIsPending(false)
    setManualDraft(value?.current ?? '')
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const cancelManualEdit = () => {
    setShowConfirmDialog(false)
  }

  const handleManualChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value
    setManualDraft(next)
    if (next) {
      onChange(set({_type: 'slug', current: next}))
    } else {
      onChange(unset())
    }
  }

  const enableAutoGenerate = () => {
    lastGeneratedForTitle.current = null
    setAutoGenerate(true)
  }

  const displayValue = autoGenerate ? (value?.current ?? '') : manualDraft

  return (
    <Stack space={3}>
      <TextInput
        {...elementProps}
        value={displayValue}
        readOnly={readOnly || autoGenerate}
        onChange={handleManualChange}
        onFocus={(event: FocusEvent<HTMLInputElement>) => {
          elementProps.onFocus?.(event)
          requestManualEdit()
        }}
        onClick={requestManualEdit}
      />

      {autoGenerate && isPending && (
        <Flex align="center" gap={2}>
          <Spinner muted />
          <Text size={1} muted>
            membuat slug
          </Text>
        </Flex>
      )}

      {!autoGenerate && !readOnly && (
        <Button
          mode="ghost"
          text="Aktifkan auto-generate slug"
          onClick={enableAutoGenerate}
        />
      )}

      {showConfirmDialog && (
        <Dialog
          id="confirm-manual-slug"
          header="Edit slug secara manual?"
          onClose={cancelManualEdit}
          zOffset={1000}
          footer={
            <Flex justify="flex-end" gap={2} padding={3}>
              <Button mode="ghost" text="Batal" onClick={cancelManualEdit} />
              <Button
                tone="caution"
                text="Ya, edit manual"
                onClick={confirmManualEdit}
              />
            </Flex>
          }
        >
          <Box padding={4}>
            <Text>
              Jika Anda mengedit slug secara manual, fitur auto-generate akan
              dimatikan. Anda bisa mengaktifkannya kembali kapan saja.
            </Text>
          </Box>
        </Dialog>
      )}
    </Stack>
  )
}
