import {defineArrayMember, defineField, defineType} from 'sanity'
import {AutoSlugInput} from '../components/AutoSlugInput'
import {LanguageModeToggle} from '../components/LanguageModeToggle'

function newBlockKey() {
  return Math.random().toString(36).slice(2, 14)
}

export default defineType({
  name: 'article',
  title: 'Artikel',
  type: 'document',
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
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (rule) => rule.required(),
    }),
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
        'Setiap block berisi isi artikel. Minimal 1 block. Jika mode bilingual, isi Indonesia dan English wajib lengkap.',
      type: 'array',
      of: [defineArrayMember({type: 'articleBlock'})],
      initialValue: () => [
        {
          _type: 'articleBlock',
          _key: newBlockKey(),
        },
      ],
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
    select: {
      title: 'title_id',
      subtitle: 'authorName',
      media: 'coverImage',
    },
  },
})
