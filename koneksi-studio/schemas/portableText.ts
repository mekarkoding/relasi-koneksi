import { defineArrayMember, defineType } from 'sanity'

/**
 * Portable Text configuration per PRD Section 6.1:
 * blocks (normal, h2, h3, blockquote), marks (strong, em, link),
 * lists (bullet, number), inline image (asset + alt + caption),
 * and a YouTube embed object.
 */
export default defineType({
  name: 'portableText',
  title: 'Isi',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraf', value: 'normal' },
        { title: 'Judul Besar (H2)', value: 'h2' },
        { title: 'Sub-judul (H3)', value: 'h3' },
        { title: 'Kutipan', value: 'blockquote' },
      ],
      lists: [
        { title: 'Daftar Poin', value: 'bullet' },
        { title: 'Daftar Angka', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Tebal', value: 'strong' },
          { title: 'Miring', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Tautan',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule: { required: () => unknown }) => rule.required(),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Gambar',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Teks Alternatif (deskripsi gambar)',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Keterangan Gambar',
        },
      ],
    }),
    defineArrayMember({ type: 'youtube' }),
  ],
})
