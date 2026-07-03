import { defineField, defineType } from 'sanity'

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
      description: 'Alamat halaman artikel. Klik "Generate" setelah menulis judul.',
      type: 'slug',
      options: { source: 'title_id', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Gambar Sampul',
      type: 'image',
      options: { hotspot: true },
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
      to: [{ type: 'category' }],
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
      name: 'body_id',
      title: 'Isi Artikel (Bahasa Indonesia)',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body_en',
      title: 'Article Body (English)',
      type: 'portableText',
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
      by: [{ field: 'publishedAt', direction: 'desc' }],
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
