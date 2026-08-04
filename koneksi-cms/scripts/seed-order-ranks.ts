import {LexoRank} from 'lexorank'
import {getCliClient} from 'sanity/cli'

/**
 * Seed `orderRank` on wisata + article documents so Studio drag-order and the
 * website listing stay in sync.
 *
 * Existing docs are ranked by `_createdAt` ascending (creation order: oldest
 * first / top). Re-run anytime to reset ranks to creation order; or use
 * "Reset Order" / drag-and-drop in Studio for a custom sequence.
 *
 * Usage (from koneksi-cms/):
 *   npm run migrate:seed-order-ranks
 */
const client = getCliClient({apiVersion: '2025-01-01'})

const DOCUMENT_TYPES = [
  'wisata',
  'artikel_berita',
  'artikel_sejarah',
  'artikel_partnership',
  'artikel_liputan',
] as const

type RankableDoc = {_id: string}

async function patchOrderRank(id: string, orderRank: string) {
  await client.patch(id).set({orderRank}).commit({visibility: 'async'})
}

async function seedType(type: (typeof DOCUMENT_TYPES)[number]) {
  const published: RankableDoc[] = await client.fetch(
    `*[_type == $type && !(_id in path("drafts.**"))] | order(_createdAt asc){_id}`,
    {type},
  )
  const draftOnly: RankableDoc[] = await client.fetch(
    `*[_type == $type && _id in path("drafts.**") && count(*[_id == string::split(^._id, "drafts.")[1]]) == 0]
      | order(_createdAt asc){_id}`,
    {type},
  )

  const ordered = [...published, ...draftOnly]
  if (ordered.length === 0) {
    console.log(`[${type}] no documents — skip`)
    return
  }

  let rank = LexoRank.middle()
  let patched = 0

  for (const doc of ordered) {
    const orderRank = rank.toString()
    const isDraft = doc._id.startsWith('drafts.')
    const publishedId = isDraft ? doc._id.slice('drafts.'.length) : doc._id
    const draftId = `drafts.${publishedId}`

    if (!isDraft) {
      await patchOrderRank(publishedId, orderRank)
      patched += 1
      const hasDraft = await client.fetch<boolean>(
        `count(*[_id == $id]) > 0`,
        {id: draftId},
      )
      if (hasDraft) {
        await patchOrderRank(draftId, orderRank)
        patched += 1
      }
    } else {
      await patchOrderRank(draftId, orderRank)
      patched += 1
    }

    rank = rank.genNext()
  }

  console.log(`[${type}] seeded ${ordered.length} document(s) (${patched} patches)`)
}

async function run() {
  console.log('Seeding orderRank by creation order (_createdAt asc)...')
  for (const type of DOCUMENT_TYPES) {
    await seedType(type)
  }
  console.log('Done. Drag items in KONEKSI to change website order.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
