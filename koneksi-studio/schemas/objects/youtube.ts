import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'youtube',
  title: 'Video YouTube',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'URL Video YouTube',
      description: 'Tempel alamat video, contoh: https://www.youtube.com/watch?v=xxxx',
      type: 'url',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true
          const isYouTube =
            /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(value)
          return isYouTube || 'Harus berupa tautan YouTube yang valid'
        }),
    }),
  ],
  preview: {
    select: { url: 'url' },
    prepare({ url }) {
      return { title: 'Video YouTube', subtitle: url }
    },
  },
})
