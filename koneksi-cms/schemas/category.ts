import {defineField, defineType} from 'sanity'
import {AutoSlugInput} from '../components/AutoSlugInput'

export default defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  description:
    'Hanya untuk Artikel Berita. Digunakan sebagai filter di halaman Berita. Bisa ditambah kapan saja.',
  fields: [
    defineField({
      name: 'title_id',
      title: 'Nama Kategori (Bahasa Indonesia)',
      description: 'Contoh: Acara, Cerita Desa, Pengumuman',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Category Name (English)',
      description: 'Example: Events, Village Stories, Announcements',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'Digunakan untuk filter di halaman Berita. Otomatis dibuat dari nama Indonesia (2 detik setelah berhenti mengetik).',
      type: 'slug',
      options: {source: 'title_id', maxLength: 96},
      components: {input: AutoSlugInput},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title_id', subtitle: 'title_en'},
  },
})
