import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

/**
 * KONEKSI — the content studio for the RELASI village tourism website.
 * Villagers use this to publish articles ONLY.
 *
 * STRICT RULE (PRD Section 4.3 / 6): exactly two document types exist
 * (article, category). Do not add more without human approval.
 */
export default defineConfig({
  name: 'koneksi',
  title: 'KONEKSI — Mekar Banjar',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Konten')
          .items([
            S.listItem()
              .title('Artikel')
              .child(S.documentTypeList('article').title('Artikel')),
            S.listItem()
              .title('Kategori')
              .child(S.documentTypeList('category').title('Kategori')),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
