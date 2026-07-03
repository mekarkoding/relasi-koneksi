import article from './article'
import category from './category'
import portableText from './portableText'
import youtube from './objects/youtube'

/**
 * STRICT RULE: exactly TWO document types (article, category).
 * portableText and youtube are supporting object/array types, not documents.
 */
export const schemaTypes = [article, category, portableText, youtube]
