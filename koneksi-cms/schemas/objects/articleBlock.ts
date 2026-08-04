import {defineField, defineType} from 'sanity'
import {ArticleBlockItem} from '../../components/ArticleBlockItem'
import {createBlockLocaleField} from '../../components/BlockLocaleField'

function hasPortableTextContent(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0
}

/**
 * One content section: Indonesian + English portable text pair.
 * Custom `label` appears in the Isi Artikel list; editor field titles stay "Block N (…)".
 * Opens in a near-fullscreen dialog (modal width 5 on the parent array).
 */
export default defineType({
  name: 'articleBlock',
  title: 'Block',
  type: 'object',
  components: {
    item: ArticleBlockItem,
  },
  fields: [
    defineField({
      name: 'label',
      title: 'Nama Block',
      description:
        'Nama di daftar Isi Artikel. Judul di atas editor (Block N Indonesia/English) tetap otomatis.',
      type: 'string',
    }),
    defineField({
      name: 'body_id',
      title: 'Block (Indonesia)',
      type: 'portableText',
      components: {field: createBlockLocaleField('id')},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body_en',
      title: 'Block (English)',
      type: 'portableText',
      components: {field: createBlockLocaleField('en')},
      hidden: ({document}) => document?.indonesianOnly !== false,
      validation: (rule) =>
        rule.custom((value, context) => {
          const indonesianOnly = context.document?.indonesianOnly !== false
          if (indonesianOnly) return true
          if (!hasPortableTextContent(value)) {
            return 'Wajib diisi. Artikel bilingual tidak boleh mengosongkan bagian English.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      bodyId: 'body_id',
    },
    prepare({label, bodyId}) {
      const hasContent = Array.isArray(bodyId) && bodyId.length > 0
      const custom = typeof label === 'string' ? label.trim() : ''
      return {
        title: custom || 'Block',
        subtitle: hasContent ? undefined : 'Belum ada isi',
      }
    },
  },
})
