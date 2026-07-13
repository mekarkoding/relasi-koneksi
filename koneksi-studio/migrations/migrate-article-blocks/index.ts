import {at, defineMigration, setIfMissing, unset} from 'sanity/migrate'

/**
 * Moves legacy article `body_id` / `body_en` into `blocks[0]`, then removes the old fields.
 *
 * Dry run:  npx sanity@latest migration run migrate-article-blocks
 * Execute:  npx sanity@latest migration run migrate-article-blocks --no-dry-run
 */
export default defineMigration({
  title: 'Migrate article body_id/body_en into blocks array',
  documentTypes: ['article'],

  migrate: {
    document(doc) {
      if (Array.isArray(doc.blocks) && doc.blocks.length > 0) {
        // Already migrated — still clear leftover legacy fields if present
        const patches = []
        if ('body_id' in doc) patches.push(at('body_id', unset()))
        if ('body_en' in doc) patches.push(at('body_en', unset()))
        return patches
      }

      const key = `block${Math.random().toString(36).slice(2, 10)}`
      const firstBlock: Record<string, unknown> = {
        _type: 'articleBlock',
        _key: key,
      }

      if (doc.body_id) firstBlock.body_id = doc.body_id
      if (doc.body_en) firstBlock.body_en = doc.body_en

      return [
        at('blocks', setIfMissing([firstBlock])),
        at('body_id', unset()),
        at('body_en', unset()),
      ]
    },
  },
})
