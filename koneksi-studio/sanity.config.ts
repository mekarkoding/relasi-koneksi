import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'

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

  // Single-account CMS — hide collaboration features that don't apply
  releases: {
    enabled: false,
  },
  tasks: {
    enabled: false,
  },
  document: {
    comments: {
      enabled: false,
    },
  },

  // Only Structure is installed; hide the tool switcher but keep the navbar
  studio: {
    components: {
      toolMenu: () => null,
    },
  },

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
