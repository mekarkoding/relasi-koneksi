import {defineField, defineType} from 'sanity'

function backgroundImageField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    description,
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Teks Alternatif (opsional)',
        type: 'string',
      }),
    ],
  })
}

/**
 * Singleton — Beranda section backgrounds.
 * One document only (id `beranda`). Article pages are NOT included.
 * Approved with human approval alongside the Galeri CMS move.
 */
export default defineType({
  name: 'beranda',
  title: 'Latar Beranda',
  type: 'document',
  fields: [
    backgroundImageField(
      'heroBackground',
      'Latar Hero (utama)',
      'Gambar di belakang teks “Selamat datang…”. Disarankan landscape lebar (mis. 1920×1080).',
    ),
    backgroundImageField(
      'instagramBackground',
      'Latar bagian Instagram',
      'Latar di belakang feed Instagram. Kosongkan untuk memakai warna default.',
    ),
    backgroundImageField(
      'wisataBackground',
      'Latar bagian Destinasi Wisata',
      'Latar di belakang 3 wisata unggulan. Kosongkan untuk warna default.',
    ),
    backgroundImageField(
      'desaBackground',
      'Latar bagian Empat Desa',
      'Latar di belakang kartu empat desa. Kosongkan untuk warna default.',
    ),
    backgroundImageField(
      'afterMovieBackground',
      'Latar bagian After-Movie',
      'Latar di belakang video after-movie. Kosongkan untuk warna default (hijau Tamblingan).',
    ),
  ],
  preview: {
    prepare() {
      return {
        title: 'Latar Beranda',
        subtitle: 'Hero · Instagram · Wisata · Desa · After-movie',
      }
    },
  },
})
