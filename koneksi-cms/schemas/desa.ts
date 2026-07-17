import {defineArrayMember, defineField, defineType} from 'sanity'

const VILLAGES = [
  {title: 'Gobleg', value: 'gobleg'},
  {title: 'Munduk', value: 'munduk'},
  {title: 'Gesing', value: 'gesing'},
  {title: 'Umejero', value: 'umejero'},
] as const

/**
 * Desa (village). Four fixed villages, seeded by the KKN team.
 * `villageName` is the routing key and must not change once set.
 * Villagers edit content but should not create/delete desa documents.
 */
export default defineType({
  name: 'desa',
  title: 'Desa',
  type: 'document',
  fields: [
    defineField({
      name: 'villageName',
      title: 'Nama Desa',
      description: 'Menentukan alamat halaman (/desa/[nama]). Jangan diubah setelah dipilih.',
      type: 'string',
      options: {list: [...VILLAGES], layout: 'dropdown'},
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
      name: 'dataFields',
      title: 'Data Desa',
      description:
        'Baris data (contoh: Jumlah Penduduk = 1.234). Bisa ditambah, dihapus, dan diurutkan.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'dataField',
          title: 'Data',
          fields: [
            defineField({
              name: 'label_id',
              title: 'Label (Bahasa Indonesia)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label_en',
              title: 'Label (English)',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Nilai',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label_id', subtitle: 'value'},
          },
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri Foto',
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
    }),
  ],
  preview: {
    select: {villageName: 'villageName', media: 'mainImage'},
    prepare({villageName, media}) {
      const name =
        typeof villageName === 'string' && villageName.length > 0
          ? villageName.charAt(0).toUpperCase() + villageName.slice(1)
          : 'Desa'
      return {title: name, media}
    },
  },
})
