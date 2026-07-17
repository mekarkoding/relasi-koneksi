import {createArticleType} from './shared/createArticleType'

/** News article. The only article type that uses `kategori`. */
export default createArticleType({
  name: 'artikel_berita',
  title: 'Berita',
  includeCategory: true,
})
