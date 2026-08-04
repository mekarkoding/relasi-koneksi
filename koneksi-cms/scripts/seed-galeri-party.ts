import {getCliClient} from 'sanity/cli'

/**
 * Set `party: "adat"` on existing `galeri` photos that lack a party value.
 * Matches prior frontend behavior (all CMS photos under Adat Dalem).
 *
 * Usage (from koneksi-cms/):
 *   npm run migrate:seed-galeri-party
 */
const client = getCliClient({apiVersion: '2025-01-01'})

type GaleriDoc = {_id: string}

async function run() {
  console.log('Seeding party="adat" on galeri photos missing party...')

  const docs: GaleriDoc[] = await client.fetch(
    `*[_type == "galeri" && !defined(party)]{_id}`,
  )

  if (docs.length === 0) {
    console.log('No galeri documents missing party — done')
    return
  }

  let patched = 0
  for (const doc of docs) {
    await client.patch(doc._id).set({party: 'adat'}).commit({visibility: 'async'})
    patched += 1
  }

  console.log(`Patched ${patched} galeri document(s) with party="adat"`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
