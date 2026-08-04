import {
  DocumentTextIcon,
  DocumentsIcon,
  EarthGlobeIcon,
  HomeIcon,
  ImagesIcon,
  PlayIcon,
  TagsIcon,
} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {schemaTypes} from './schemas'
import './styles/studio.css'

/**
 * KONEKSI — the content studio for the RELASI village tourism website.
 * Villagers publish articles and manage wisata, desa, and galeri.
 *
 * `galeri` / `galeri_video` added with human approval.
 * Wisata + article lists use drag-and-drop ordering (`orderRank`) so Studio
 * top→bottom matches the website listing order.
 */

type GaleriParty = 'adat' | 'kkn'

function galeriPartyList(
  S: StructureBuilder,
  party: GaleriParty,
  partyTitle: string,
) {
  return S.list()
    .title(partyTitle)
    .items([
      S.listItem()
        .title('Foto')
        .icon(ImagesIcon)
        .schemaType('galeri')
        .child(
          S.documentTypeList('galeri')
            .title(`Foto — ${partyTitle}`)
            .filter('_type == "galeri" && party == $party')
            .params({party})
            .initialValueTemplates([
              S.initialValueTemplateItem(`galeri-${party}`),
            ]),
        ),
      S.listItem()
        .title('Video')
        .icon(PlayIcon)
        .schemaType('galeri_video')
        .child(
          S.documentTypeList('galeri_video')
            .title(`Video — ${partyTitle}`)
            .filter('_type == "galeri_video" && party == $party')
            .params({party})
            .initialValueTemplates([
              S.initialValueTemplateItem(`galeri-video-${party}`),
            ]),
        ),
    ])
}

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
      structure: (S, context) =>
        S.list()
          .title('Konten')
          .items([
            S.listItem()
              .title('Artikel')
              .icon(DocumentsIcon)
              .child(
                S.list()
                  .title('Artikel')
                  .items([
                    S.listItem()
                      .title('Berita')
                      .icon(DocumentTextIcon)
                      .child(
                        S.list()
                          .title('Berita')
                          .items([
                            orderableDocumentListDeskItem({
                              type: 'artikel_berita',
                              title: 'Semua Berita',
                              icon: DocumentTextIcon,
                              S,
                              context,
                            }),
                            S.listItem()
                              .title('Kategori')
                              .icon(TagsIcon)
                              .child(
                                S.documentTypeList('category').title(
                                  'Kategori (untuk Berita)',
                                ),
                              ),
                          ]),
                      ),
                    orderableDocumentListDeskItem({
                      type: 'artikel_sejarah',
                      title: 'Sejarah',
                      icon: DocumentTextIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'artikel_partnership',
                      title: 'Partnership',
                      icon: DocumentTextIcon,
                      S,
                      context,
                    }),
                    orderableDocumentListDeskItem({
                      type: 'artikel_liputan',
                      title: 'Liputan',
                      icon: DocumentTextIcon,
                      S,
                      context,
                    }),
                  ]),
              ),
            S.divider(),
            orderableDocumentListDeskItem({
              type: 'wisata',
              title: 'Wisata',
              icon: EarthGlobeIcon,
              S,
              context,
            }),
            S.listItem()
              .title('Desa')
              .icon(HomeIcon)
              .child(S.documentTypeList('desa').title('Desa')),
            S.listItem()
              .title('Galeri')
              .icon(ImagesIcon)
              .child(
                S.list()
                  .title('Galeri')
                  .items([
                    S.listItem()
                      .title('Adat Dalem Tamblingan')
                      .icon(ImagesIcon)
                      .child(
                        galeriPartyList(S, 'adat', 'Adat Dalem Tamblingan'),
                      ),
                    S.listItem()
                      .title('KKN Mekar Banjar')
                      .icon(ImagesIcon)
                      .child(galeriPartyList(S, 'kkn', 'KKN Mekar Banjar')),
                  ]),
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'galeri-adat',
        title: 'Foto — Adat Dalem Tamblingan',
        schemaType: 'galeri',
        value: {party: 'adat'},
      },
      {
        id: 'galeri-kkn',
        title: 'Foto — KKN Mekar Banjar',
        schemaType: 'galeri',
        value: {party: 'kkn'},
      },
      {
        id: 'galeri-video-adat',
        title: 'Video — Adat Dalem Tamblingan',
        schemaType: 'galeri_video',
        value: {party: 'adat'},
      },
      {
        id: 'galeri-video-kkn',
        title: 'Video — KKN Mekar Banjar',
        schemaType: 'galeri_video',
        value: {party: 'kkn'},
      },
    ],
  },
})
