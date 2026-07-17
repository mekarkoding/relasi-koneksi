import {defineArrayMember, defineField, defineType} from 'sanity'
import {AutoSlugInput} from '../../components/AutoSlugInput'
import {ArticleDocumentInput} from '../../components/ArticleDocumentInput'
import {LanguageModeToggle} from '../../components/LanguageModeToggle'

function newBlockKey() {
  return Math.random().toString(36).slice(2, 14)
}

export interface ArticleTypeOptions {
  name: string
  title: string
  description?: string
  /** Berita references a `category`; the other body types render a fixed label on the frontend. */
  includeCategory?: boolean
}

/**
 * Shared field set for the three body-bearing article types
 * (artikel_berita, artikel_sejarah, artikel_partnership).
 *
 * They differ only in the presence of the `category` reference (Berita only);
 * everything else is identical, so we build them from one factory to avoid drift.
 */
export function createArticleType({
  name,
  title,
  description,
  includeCategory = false,
}: ArticleTypeOptions) {
  return defineType({
    name,
    title,
    type: 'document',
    ...(description ? {description} : {}),
    components: {
      input: ArticleDocumentInput,
    },
    fields: [
      defineField({
        name: 'title_id',
        title: 'Judul (Bahasa Indonesia)',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'title_en',
        title: 'Title (English)',
        description: 'Boleh dikosongkan. Jika kosong, situs Inggris menampilkan versi Indonesia.',
        type: 'string',
      }),
      defineField({
        name: 'slug',
        title: 'Slug',
        description:
          'Alamat halaman artikel. Otomatis dibuat dari judul Indonesia (2 detik setelah berhenti mengetik).',
        type: 'slug',
        options: {source: 'title_id', maxLength: 96},
        components: {input: AutoSlugInput},
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'coverImage',
        title: 'Gambar Sampul',
        type: 'image',
        options: {hotspot: true},
        fields: [
          defineField({
            name: 'alt',
            title: 'Teks Alternatif (deskripsi gambar)',
            type: 'string',
            validation: (rule) => rule.required(),
          }),
        ],
        validation: (rule) => rule.required(),
      }),
      ...(includeCategory
        ? [
            defineField({
              name: 'category',
              title: 'Kategori',
              type: 'reference',
              to: [{type: 'category'}],
              validation: (rule) => rule.required(),
            }),
          ]
        : []),
      defineField({
        name: 'excerpt_id',
        title: 'Ringkasan (Bahasa Indonesia)',
        description: 'Maksimal 200 karakter. Tampil di daftar artikel.',
        type: 'text',
        rows: 3,
        validation: (rule) => rule.required().max(200),
      }),
      defineField({
        name: 'excerpt_en',
        title: 'Excerpt (English)',
        type: 'text',
        rows: 3,
        validation: (rule) => rule.max(200),
      }),
      defineField({
        name: 'indonesianOnly',
        title: 'Mode Bahasa',
        type: 'boolean',
        initialValue: true,
        components: {input: LanguageModeToggle},
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'blocks',
        title: 'Isi Artikel',
        description:
          'Setiap block berisi isi artikel. Klik block untuk membuka editor layar penuh. Minimal 1 block.',
        type: 'array',
        of: [defineArrayMember({type: 'articleBlock'})],
        options: {
          // Largest Sanity dialog — paired with studio.css for near-fullscreen
          modal: {type: 'dialog', width: 5},
        },
        initialValue: () => [{_type: 'articleBlock', _key: newBlockKey()}],
        validation: (rule) => rule.required().min(1),
      }),
      defineField({
        name: 'publishedAt',
        title: 'Tanggal Publikasi',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'authorName',
        title: 'Nama Penulis',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
    ],
    orderings: [
      {
        title: 'Terbaru',
        name: 'publishedAtDesc',
        by: [{field: 'publishedAt', direction: 'desc'}],
      },
    ],
    preview: {
      select: {title: 'title_id', subtitle: 'authorName', media: 'coverImage'},
    },
  })
}
