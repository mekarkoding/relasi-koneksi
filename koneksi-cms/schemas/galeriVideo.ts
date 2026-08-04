import {PlayIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {galeriPartyField} from './shared/galeriParty'

const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/

/**
 * Galeri video (Media → Galeri). One document per YouTube video.
 * Grouped by `party`: Adat Dalem Tamblingan or KKN Mekar Banjar.
 * Self-hosted / non-YouTube video is not allowed (PRD).
 */
export default defineType({
  name: 'galeri_video',
  title: 'Video Galeri',
  type: 'document',
  icon: PlayIcon,
  fields: [
    galeriPartyField(),
    defineField({
      name: 'title_id',
      title: 'Judul (Bahasa Indonesia)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      description: 'Opsional. Jika kosong, situs Inggris memakai judul Indonesia.',
      type: 'string',
    }),
    defineField({
      name: 'description_id',
      title: 'Deskripsi (Bahasa Indonesia)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description_en',
      title: 'Description (English)',
      description: 'Opsional. Jika kosong, situs Inggris memakai deskripsi Indonesia.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'Tautan Video YouTube',
      description:
        'HANYA tautan YouTube yang diterima (youtube.com/watch?v=… atau youtu.be/…). Video unggahan sendiri / platform lain tidak didukung.',
      type: 'url',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          return (
            YOUTUBE_URL_PATTERN.test(value) ||
            'Harus berupa tautan YouTube yang valid (youtube.com atau youtu.be)'
          )
        }),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      description: 'Menentukan urutan video di halaman Galeri (terbaru di atas).',
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
      title: 'title_id',
      subtitle: 'youtubeUrl',
      party: 'party',
    },
    prepare({title, subtitle, party}) {
      const partyLabel =
        party === 'kkn' ? 'KKN' : party === 'adat' ? 'Adat' : 'Tanpa kelompok'
      return {
        title: title || 'Video tanpa judul',
        subtitle: [partyLabel, subtitle].filter(Boolean).join(' · '),
      }
    },
  },
})
