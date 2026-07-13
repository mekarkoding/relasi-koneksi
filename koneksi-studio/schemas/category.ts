import {defineField, defineType} from 'sanity'
import {AutoSlugInput} from '../components/AutoSlugInput'

export default defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  fields: [
    defineField({
      name: 'title_id',
      title: 'Nama Kategori (Bahasa Indonesia)',
      description: 'Contoh: Berita, Acara, Cerita Desa',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Category Name (English)',
      description: 'Example: News, Events, Village Stories',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'Digunakan untuk filter di halaman artikel. Otomatis dibuat dari nama Indonesia (2 detik setelah berhenti mengetik).',
      type: 'slug',
      options: {source: 'title_id', maxLength: 96},
      components: {input: AutoSlugInput},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title_id', subtitle: 'title_en' },
  },
})
