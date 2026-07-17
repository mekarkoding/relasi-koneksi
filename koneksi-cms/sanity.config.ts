import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import './styles/studio.css'

/**
 * KONEKSI — the content studio for the RELASI village tourism website.
 * Villagers publish articles (4 types) and manage wisata + desa entries.
 *
 * STRICT RULE (PRD v2.0 Section 4.3 / 6): six villager document types exist
 * (artikel_berita, artikel_sejarah, artikel_partnership, artikel_liputan, wisata, desa)
 * plus the supporting `category`. Do not add more without human approval.
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
              .child(
                S.list()
                  .title('Artikel')
                  .items([
                    S.listItem()
                      .title('Berita')
                      .child(
                        S.list()
                          .title('Berita')
                          .items([
                            S.listItem()
                              .title('Semua Berita')
                              .child(
                                S.documentTypeList('artikel_berita').title('Semua Berita'),
                              ),
                            S.listItem()
                              .title('Kategori')
                              .child(
                                S.documentTypeList('category').title(
                                  'Kategori (untuk Berita)',
                                ),
                              ),
                          ]),
                      ),
                    S.listItem()
                      .title('Sejarah')
                      .child(S.documentTypeList('artikel_sejarah').title('Sejarah')),
                    S.listItem()
                      .title('Partnership')
                      .child(
                        S.documentTypeList('artikel_partnership').title('Partnership'),
                      ),
                    S.listItem()
                      .title('Liputan')
                      .child(S.documentTypeList('artikel_liputan').title('Liputan')),
                  ]),
              ),
            S.divider(),
            S.listItem()
              .title('Wisata')
              .child(S.documentTypeList('wisata').title('Wisata')),
            S.listItem()
              .title('Desa')
              .child(S.documentTypeList('desa').title('Desa')),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
