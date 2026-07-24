/**
 * Import extracted Catur Desa articles into Sanity as artikel_sejarah / artikel_berita.
 *
 * Prerequisites:
 *   node scripts/extract-catur-desa-articles.js
 *   (assets in scripts/catur-desa-assets/)
 *
 * Usage (from koneksi-cms/):
 *   npx sanity exec scripts/import-catur-desa-articles.ts --with-user-token
 */
import {createHash} from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-01'})

const EXTRACT_DIR = path.join(__dirname, 'catur-desa-extract')
const ASSET_DIR = path.join(__dirname, 'catur-desa-assets')
const FALLBACK_COVER = 'danau.png'

type Node =
  | {kind: 'h2' | 'h3' | 'p' | 'blockquote'; text: string}
  | {kind: 'ol' | 'ul'; items: string[]}
  | {kind: 'image'; asset: string; alt?: string}

type Extracted = {
  type: 'artikel_sejarah' | 'artikel_berita'
  slug: string
  categorySlug?: string
  title_id: string
  authorName: string
  publishedAt: string
  coverAsset: string | null
  excerpt_id: string
  nodes: Node[]
}

const TITLE_EN: Record<string, string> = {
  'legenda-dalem-tamblingan-dan-pembentukan-catur-desa':
    'The Legend of Dalem Tamblingan and the Formation of Catur Desa',
  'menjala-ingatan-atas-alas-mertajati-tamblingan':
    'Casting Memory over Alas Mertajati, Tamblingan',
  'nyegara-gunung-konsepsi-masyarakat-adat-dalem-tamblingan':
    'Nyegara Gunung — Adat Dalem Tamblingan’s Concept of Caring for Nature',
  'adat-dan-ritual-dalem-tamblingan': 'Adat and Ritual of Dalem Tamblingan',
  'ritual-karya-alilitan-adat-dalem-tamblingan':
    'Karya Alilitan Ritual of Adat Dalem Tamblingan',
  'permainan-tradisional': 'Traditional Games',
  'permainan-gangsing-sebagai-warisan-budaya-catur-desa':
    'Gangsing: A Cultural Heritage Game of Catur Desa',
  'kesenian-sakral-dan-seni-hiburan': 'Sacred Arts and Entertainment',
  'alas-mertajati': 'Alas Mertajati',
  'tempat-suci-masyarakat-adat': 'Sacred Places of the Adat Community',
  'wilayah-adat-dalem-tamblingan-saat-ini':
    'The Adat Dalem Tamblingan Territory Today',
  'pegangan-hukum-adat-dalem-tamblingan':
    'Customary Law of Adat Dalem Tamblingan',
  'sistem-pemerintahan-adat-dalem-tamblingan':
    'Customary Governance of Adat Dalem Tamblingan',
  'simbol-penyatuan-catur-desa': 'Symbol of Catur Desa Unity',
  'telusur-tanaman-obat-alas-mertajati':
    'Exploring Medicinal Plants of Alas Mertajati',
  'sumber-daya-alam': 'Natural Resources',
  'mata-air-dan-pemeliharaan-air': 'Springs and Water Stewardship',
  'fasilitas-umum-dan-fasilitas-sosial': 'Public and Social Facilities',
  'posyandu-lansia-desa-munduk':
    'Elderly Posyandu in Munduk: Sustained Health Care for Older Residents',
  'menyusuri-jejak-pujawali-purnama-di-munduk-antara-sakralitas-dan-kebersamaan':
    'Tracing Pujawali Purnama in Munduk: Between Sacredness and Togetherness',
}

function key(): string {
  return Math.random().toString(36).slice(2, 10)
}

function docIdForSlug(slug: string): string {
  const hash = createHash('sha1').update(`catur-desa:${slug}`).digest('hex').slice(0, 16)
  return `catur-${hash}`
}

/** Convert *em* / **strong** markers into Portable Text spans. */
function spansFromText(text: string) {
  const children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks: string[]
  }> = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) {
      children.push({
        _type: 'span',
        _key: key(),
        text: text.slice(last, m.index),
        marks: [],
      })
    }
    const token = m[0]
    if (token.startsWith('**')) {
      children.push({
        _type: 'span',
        _key: key(),
        text: token.slice(2, -2),
        marks: ['strong'],
      })
    } else {
      children.push({
        _type: 'span',
        _key: key(),
        text: token.slice(1, -1),
        marks: ['em'],
      })
    }
    last = m.index + token.length
  }
  if (last < text.length) {
    children.push({_type: 'span', _key: key(), text: text.slice(last), marks: []})
  }
  if (children.length === 0) {
    children.push({_type: 'span', _key: key(), text, marks: []})
  }
  return children
}

function textBlock(
  style: 'normal' | 'h2' | 'h3' | 'blockquote',
  text: string,
  listItem?: 'bullet' | 'number',
  level = 1,
) {
  const block: Record<string, unknown> = {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: spansFromText(text),
  }
  if (listItem) {
    block.listItem = listItem
    block.level = level
  }
  return block
}

async function uploadAsset(
  filename: string,
  cache: Map<string, {_type: 'reference'; _ref: string}>,
) {
  if (cache.has(filename)) return cache.get(filename)!
  const filePath = path.join(ASSET_DIR, filename)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing asset file: ${filePath}`)
  }
  const buffer = fs.readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: filename.endsWith('.png')
      ? 'image/png'
      : filename.endsWith('.jpg') || filename.endsWith('.jpeg')
        ? 'image/jpeg'
        : undefined,
  })
  const ref = {_type: 'reference' as const, _ref: asset._id}
  cache.set(filename, ref)
  console.log(`  uploaded ${filename} → ${asset._id}`)
  return ref
}

async function nodesToPortableText(
  nodes: Node[],
  cache: Map<string, {_type: 'reference'; _ref: string}>,
) {
  const blocks: unknown[] = []
  for (const node of nodes) {
    if (node.kind === 'h2') {
      blocks.push(textBlock('h2', node.text))
      continue
    }
    if (node.kind === 'h3') {
      blocks.push(textBlock('h3', node.text))
      continue
    }
    if (node.kind === 'blockquote') {
      // Skip calendar-looking multi-line junk quotes that are schedule tables
      const t = node.text.replace(/\s+/g, ' ').trim()
      if (t.length < 200 && /Sasih|Jejepan|Pangelong|Nuju Kandengan/i.test(t) && !/[.“"]/.test(t)) {
        // Treat ritual calendar captions as h3 labels when short
        blocks.push(textBlock('h3', t))
      } else {
        blocks.push(textBlock('blockquote', t))
      }
      continue
    }
    if (node.kind === 'p') {
      // Image captions often follow images as short italic-ish paragraphs — keep as normal
      blocks.push(textBlock('normal', node.text))
      continue
    }
    if (node.kind === 'ol' || node.kind === 'ul') {
      // Single-item ordered lists in source often mark ritual step titles → h3
      if (node.kind === 'ol' && node.items.length === 1) {
        blocks.push(textBlock('h3', node.items[0]))
        continue
      }
      const listItem = node.kind === 'ol' ? 'number' : 'bullet'
      for (const item of node.items) {
        blocks.push(textBlock('normal', item, listItem))
      }
      continue
    }
    if (node.kind === 'image') {
      try {
        const asset = await uploadAsset(node.asset, cache)
        blocks.push({
          _type: 'image',
          _key: key(),
          asset,
          alt: node.alt || node.asset,
        })
      } catch (err) {
        console.warn(`  skip image ${node.asset}:`, (err as Error).message)
      }
    }
  }
  return blocks
}

function cleanExcerpt(s: string): string {
  const t = s.replace(/\s+/g, ' ').replace(/[“…”]/g, '"').trim()
  if (t.length <= 200) return t
  return `${t.slice(0, 197)}…`
}

async function ensureCategories() {
  const cats = await client.fetch<
    Array<{_id: string; slug?: {current?: string}}>
  >(`*[_type == "category"]{_id, slug}`)

  const bySlug = new Map<string, string>()
  for (const c of cats) {
    const slug = c.slug?.current
    if (!slug) continue
    // Prefer published id over drafts.*
    const existing = bySlug.get(slug)
    if (!existing || existing.startsWith('drafts.')) {
      bySlug.set(slug, c._id.replace(/^drafts\./, ''))
    }
  }

  // Publish draft categories if needed
  for (const [slug, id] of [...bySlug.entries()]) {
    if (cats.some((c) => c._id === `drafts.${id}` || (c.slug?.current === slug && c._id.startsWith('drafts.')))) {
      const draft = cats.find((c) => c.slug?.current === slug && c._id.startsWith('drafts.'))
      if (draft) {
        const publishedId = draft._id.replace(/^drafts\./, '')
        const doc = await client.getDocument(draft._id)
        if (doc) {
          const {_id, _rev, ...rest} = doc
          await client.createOrReplace({...rest, _id: publishedId})
          bySlug.set(slug, publishedId)
          console.log(`published category ${slug}`)
        }
      }
    }
  }

  return bySlug
}

async function run() {
  const files = fs
    .readdirSync(EXTRACT_DIR)
    .filter((f) => f.endsWith('.json') && f !== '_index.json')

  console.log(`Importing ${files.length} articles...`)
  const categoryBySlug = await ensureCategories()
  const assetCache = new Map<string, {_type: 'reference'; _ref: string}>()

  // Warm fallback cover
  await uploadAsset(FALLBACK_COVER, assetCache)

  for (const file of files) {
    const data = JSON.parse(
      fs.readFileSync(path.join(EXTRACT_DIR, file), 'utf8'),
    ) as Extracted

    console.log(`\n→ ${data.slug}`)
    const coverName = data.coverAsset || FALLBACK_COVER
    let coverRef: {_type: 'reference'; _ref: string}
    try {
      coverRef = await uploadAsset(coverName, assetCache)
    } catch {
      coverRef = await uploadAsset(FALLBACK_COVER, assetCache)
    }

    const bodyId = await nodesToPortableText(data.nodes, assetCache)
    if (bodyId.length === 0) {
      bodyId.push(textBlock('normal', data.excerpt_id || data.title_id))
    }

    const id = docIdForSlug(data.slug)
    const doc: Record<string, unknown> = {
      _id: id,
      _type: data.type,
      title_id: data.title_id,
      title_en: TITLE_EN[data.slug] || data.title_id,
      slug: {_type: 'slug', current: data.slug},
      coverImage: {
        _type: 'image',
        asset: coverRef,
        alt: data.title_id,
      },
      excerpt_id: cleanExcerpt(data.excerpt_id || data.title_id),
      excerpt_en: TITLE_EN[data.slug]
        ? cleanExcerpt(TITLE_EN[data.slug])
        : undefined,
      indonesianOnly: true,
      blocks: [
        {
          _type: 'articleBlock',
          _key: key(),
          label: 'Isi',
          body_id: bodyId,
        },
      ],
      publishedAt: data.publishedAt || new Date().toISOString(),
      authorName: data.authorName || 'KKN Mekar Banjar',
    }

    if (data.type === 'artikel_berita') {
      const catSlug = data.categorySlug || 'berita'
      const catId = categoryBySlug.get(catSlug) || categoryBySlug.get('acara')
      if (!catId) {
        throw new Error(`Missing category for ${data.slug}: ${catSlug}`)
      }
      doc.category = {_type: 'reference', _ref: catId.replace(/^drafts\./, '')}
    }

    // Remove older same-slug docs (except our deterministic id) to avoid duplicates
    const existingIds = await client.fetch<string[]>(
      `*[_type in ["artikel_sejarah","artikel_berita"] && slug.current == $slug]._id`,
      {slug: data.slug},
    )
    const tx = client.transaction()
    for (const existingId of existingIds) {
      if (existingId !== id && existingId !== `drafts.${id}`) {
        tx.delete(existingId)
        console.log(`  delete duplicate ${existingId}`)
      }
    }
    tx.createOrReplace(doc as {_id: string; _type: string})
    await tx.commit({visibility: 'async'})
    console.log(`  saved ${id}`)
  }

  console.log('\nImport complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
