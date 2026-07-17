import {createArticleType} from './shared/createArticleType'

/** Partnership article. No category; the frontend shows a fixed "Partnership" label. */
export default createArticleType({
  name: 'artikel_partnership',
  title: 'Partnership',
})
