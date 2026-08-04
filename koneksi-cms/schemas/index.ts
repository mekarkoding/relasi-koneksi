import artikelBerita from './artikelBerita'
import artikelSejarah from './artikelSejarah'
import artikelPartnership from './artikelPartnership'
import artikelLiputan from './artikelLiputan'
import wisata from './wisata'
import desa from './desa'
import galeri from './galeri'
import galeriVideo from './galeriVideo'
import category from './category'
import portableText from './portableText'
import youtube from './objects/youtube'
import articleBlock from './objects/articleBlock'

/**
 * Villager document types: artikel_*, wisata, desa, galeri, galeri_video
 * plus supporting `category` (Berita only).
 * portableText, youtube, and articleBlock are object/array types, not documents.
 * `galeri` / `galeri_video` added with human approval.
 */
export const schemaTypes = [
  artikelBerita,
  artikelSejarah,
  artikelPartnership,
  artikelLiputan,
  wisata,
  desa,
  galeri,
  galeriVideo,
  category,
  portableText,
  youtube,
  articleBlock,
]
