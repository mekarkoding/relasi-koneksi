import artikelBerita from './artikelBerita'
import artikelSejarah from './artikelSejarah'
import artikelPartnership from './artikelPartnership'
import artikelLiputan from './artikelLiputan'
import wisata from './wisata'
import desa from './desa'
import category from './category'
import portableText from './portableText'
import youtube from './objects/youtube'
import articleBlock from './objects/articleBlock'

/**
 * STRICT RULE (PRD v2.0 Section 6): six villager document types exist -
 * artikel_berita, artikel_sejarah, artikel_partnership, artikel_liputan, wisata, desa -
 * plus the supporting `category` (kategori, used only by artikel_berita).
 * portableText, youtube, and articleBlock are object/array types, not documents.
 * Do not add more document types without human approval.
 */
export const schemaTypes = [
  artikelBerita,
  artikelSejarah,
  artikelPartnership,
  artikelLiputan,
  wisata,
  desa,
  category,
  portableText,
  youtube,
  articleBlock,
]
