import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {galeriPartyField} from './shared/galeriParty'

/**
 * Galeri foto (Media → Galeri). One document per photo.
 * Grouped by `party`: Adat Dalem Tamblingan or KKN Mekar Banjar.
 */
export default defineType({
  name: 'galeri',
  title: 'Foto Galeri',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    galeriPartyField(),
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) =>
        rule.required().custom((image) => {
          if (!image || typeof image !== 'object') return 'Unggah foto terlebih dahulu'
          if (!('asset' in image) || !image.asset) {
            return 'Unggah foto — teks alternatif saja tidak cukup'
          }
          return true
        }),
    }),
    defineField({
      name: 'alt_id',
      title: 'Deskripsi gambar (Bahasa Indonesia)',
      description: 'Wajib. Dibaca oleh pembaca layar / aksesibilitas.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt_en',
      title: 'Image description (English)',
      description: 'Opsional. Jika kosong, situs bahasa Inggris memakai deskripsi Indonesia.',
      type: 'string',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      description: 'Menentukan urutan foto di halaman Galeri (terbaru di atas).',
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
    select: {
      title: 'alt_id',
      media: 'image',
      publishedAt: 'publishedAt',
      party: 'party',
    },
    prepare({title, media, publishedAt, party}) {
      const date =
        typeof publishedAt === 'string'
          ? new Date(publishedAt).toLocaleDateString('id-ID')
          : ''
      const partyLabel =
        party === 'kkn' ? 'KKN' : party === 'adat' ? 'Adat' : 'Tanpa kelompok'
      return {
        title: title || 'Foto tanpa deskripsi',
        subtitle: [partyLabel, date].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
