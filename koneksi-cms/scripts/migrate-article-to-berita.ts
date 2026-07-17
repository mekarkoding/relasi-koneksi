import {getCliClient} from 'sanity/cli'

/**
 * One-time migration: convert legacy `article` documents into `artikel_berita`.
 *
 * Sanity does not allow changing a document's `_type` with a patch, so this
 * recreates each `article` as an `artikel_berita` (same `_id`, all fields
 * preserved) via createOrReplace. Drafts are handled too.
 *
 * If any legacy article still stores top-level `body_id` / `body_en` instead of
 * `blocks[]`, run `npm run migrate:article-blocks` FIRST, then this script.
 *
 * Usage (from koneksi-cms/):
 *   npx sanity exec scripts/migrate-article-to-berita.ts --with-user-token
 */
const client = getCliClient()

type LegacyArticle = {
  _id: string
  _rev?: string
  _type: string
  [key: string]: unknown
}

async function run() {
  const articles: LegacyArticle[] = await client.fetch('*[_type == "article"]')

  if (articles.length === 0) {
    console.log('No `article` documents found. Nothing to migrate.')
    return
  }

  console.log(`Found ${articles.length} article document(s). Converting to artikel_berita...`)

  const tx = client.transaction()
  for (const doc of articles) {
    const {_rev, _type, _createdAt, _updatedAt, ...rest} = doc
    tx.createOrReplace({...rest, _type: 'artikel_berita'})
  }

  await tx.commit()
  console.log('Migration complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
