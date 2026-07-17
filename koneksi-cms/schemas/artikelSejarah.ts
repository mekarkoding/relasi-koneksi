import {createArticleType} from './shared/createArticleType'

/** History article. No category; the frontend shows a fixed "Sejarah" label. */
export default createArticleType({
  name: 'artikel_sejarah',
  title: 'Sejarah',
})
