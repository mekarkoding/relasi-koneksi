import {defineArrayMember, defineField, defineType} from 'sanity'
import {AutoSlugInput} from '../components/AutoSlugInput'

/**
 * Wisata (attraction). CMS-managed in v2.0 (moved from hardcoded data).
 * Bilingual is REQUIRED on both name and description - no Indonesian-only fallback.
 * Visibility uses Sanity's native Draft / Publish — no custom status field.
 */
export default defineType({
  name: 'wisata',
  title: 'Wisata',
  type: 'document',
  fields: [
    defineField({
      name: 'name_id',
      title: 'Nama (Bahasa Indonesia)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name_en',
      title: 'Name (English)',
      description: 'Wajib diisi. Wisata harus lengkap dalam dua bahasa.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description:
        'Alamat halaman wisata. Otomatis dibuat dari nama Indonesia (2 detik setelah berhenti mengetik).',
      type: 'slug',
      options: {source: 'name_id', maxLength: 96},
      components: {input: AutoSlugInput},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Gambar Utama',
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
      name: 'description_id',
      title: 'Deskripsi (Bahasa Indonesia)',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description_en',
      title: 'Description (English)',
      description: 'Wajib diisi.',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri Foto',
      description: 'Maksimal 10 foto.',
      type: 'array',
      of: [
        defineArrayMember({
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
          validation: (rule) =>
            rule.required().custom((image) => {
              if (!image || typeof image !== 'object') return 'Unggah foto terlebih dahulu'
              if (!('asset' in image) || !image.asset) {
                return 'Unggah foto — teks alternatif saja tidak cukup'
              }
              return true
            }),
        }),
      ],
      validation: (rule) => rule.max(10),
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
    {
      title: 'Terbaru',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name_id', media: 'mainImage'},
    prepare({title, media}) {
      return {
        title,
        media,
      }
    },
  },
})
