import {DocumentTextIcon} from '@sanity/icons'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {defineField, defineType} from 'sanity'
import {AutoSlugInput} from '../components/AutoSlugInput'

/**
 * External coverage. A Liputan card links straight to an external article
 * (externalUrl) - there is NO internal detail page and NO body/rich text.
 * Drag-and-drop order in Studio (`orderRank`) drives the website listing order.
 */
export default defineType({
  name: 'artikel_liputan',
  title: 'Liputan',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    orderRankField({type: 'artikel_liputan'}),
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
      description: 'Hanya dipakai sebagai kunci daftar. Tidak ada halaman detail.',
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
    defineField({
      name: 'excerpt_id',
      title: 'Ringkasan (Bahasa Indonesia)',
      description: 'Maksimal 200 karakter. Tampil di daftar liputan.',
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
      name: 'externalUrl',
      title: 'Tautan Artikel Eksternal',
      description: 'Alamat artikel di situs luar. Dibuka di tab baru.',
      type: 'url',
      validation: (rule) =>
        rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'sourceName',
      title: 'Nama Sumber',
      description: 'Nama media/publikasi eksternal, contoh: Kompas, Bali Post.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    orderRankOrdering,
    {
      title: 'Terbaru',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title_id', subtitle: 'sourceName', media: 'coverImage'},
  },
})
