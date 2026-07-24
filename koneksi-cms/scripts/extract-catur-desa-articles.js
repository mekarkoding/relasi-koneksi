/**
 * Extract structured article content from Website-Catur-Desa JSX pages.
 * Outputs JSON under scripts/catur-desa-extract/ for Sanity import.
 *
 * Usage: node scripts/extract-catur-desa-articles.js
 */
const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(process.env.TEMP, "catur-desa-pages");
const OUT_DIR = path.join(__dirname, "catur-desa-extract");

/** @type {Record<string, { type: string, categorySlug?: string, slug: string, coverAsset?: string }>} */
const MANIFEST = {
  History: {
    type: "artikel_sejarah",
    slug: "legenda-dalem-tamblingan-dan-pembentukan-catur-desa",
  },
  Menjala: {
    type: "artikel_sejarah",
    slug: "menjala-ingatan-atas-alas-mertajati-tamblingan",
  },
  NyegaraGunung: {
    type: "artikel_sejarah",
    slug: "nyegara-gunung-konsepsi-masyarakat-adat-dalem-tamblingan",
  },
  Adatritual: {
    type: "artikel_sejarah",
    slug: "adat-dan-ritual-dalem-tamblingan",
  },
  Alilitan: {
    type: "artikel_sejarah",
    slug: "ritual-karya-alilitan-adat-dalem-tamblingan",
  },
  Permainan: {
    type: "artikel_sejarah",
    slug: "permainan-tradisional",
  },
  Gangsing: {
    type: "artikel_sejarah",
    slug: "permainan-gangsing-sebagai-warisan-budaya-catur-desa",
  },
  Kesenian: {
    type: "artikel_sejarah",
    slug: "kesenian-sakral-dan-seni-hiburan",
  },
  Mertajati: {
    type: "artikel_sejarah",
    slug: "alas-mertajati",
  },
  TempatSuci: {
    type: "artikel_sejarah",
    slug: "tempat-suci-masyarakat-adat",
  },
  WilayahAdat: {
    type: "artikel_sejarah",
    slug: "wilayah-adat-dalem-tamblingan-saat-ini",
  },
  AturanAdat: {
    type: "artikel_sejarah",
    slug: "pegangan-hukum-adat-dalem-tamblingan",
  },
  Pemerintahan: {
    type: "artikel_sejarah",
    slug: "sistem-pemerintahan-adat-dalem-tamblingan",
  },
  Penyatuan: {
    type: "artikel_sejarah",
    slug: "simbol-penyatuan-catur-desa",
  },
  Tanamanobat: {
    type: "artikel_berita",
    categorySlug: "lingkungan",
    slug: "telusur-tanaman-obat-alas-mertajati",
  },
  SDA: {
    type: "artikel_berita",
    categorySlug: "lingkungan",
    slug: "sumber-daya-alam",
  },
  Mataair: {
    type: "artikel_berita",
    categorySlug: "lingkungan",
    slug: "mata-air-dan-pemeliharaan-air",
  },
  Fasilitas: {
    type: "artikel_berita",
    categorySlug: "fasilitas",
    slug: "fasilitas-umum-dan-fasilitas-sosial",
  },
  PosyanduMunduk: {
    type: "artikel_berita",
    categorySlug: "kesehatan",
    slug: "posyandu-lansia-desa-munduk",
  },
  Pujawali: {
    type: "artikel_berita",
    categorySlug: "acara",
    slug: "menyusuri-jejak-pujawali-purnama-di-munduk-antara-sakralitas-dan-kebersamaan",
  },
};

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'");
}

function stripJsxExpressions(s) {
  return s.replace(/\{[^}]*\}/g, "");
}

function extractImports(source) {
  /** @type {Record<string, string>} */
  const map = {};
  const re = /import\s+(\w+)\s+from\s+["']\.\.\/assets\/([^"']+)["']/g;
  let m;
  while ((m = re.exec(source))) {
    map[m[1]] = m[2];
  }
  return map;
}

function extractMeta(source) {
  const titleMatch = source.match(/<h1[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
  const title = titleMatch
    ? decodeEntities(stripJsxExpressions(titleMatch[1]).replace(/<[^>]+>/g, "").trim())
    : "";

  const byMatch = source.match(/>\s*By\s+([^<]+)\s*</);
  const author = byMatch ? byMatch[1].replace(/\s+/g, " ").trim() : "KKN Mekar Banjar";

  const updatedMatch = source.match(/Updated\s+([^<]+)</);
  const updated = updatedMatch ? updatedMatch[1].trim() : null;

  const quoteMatch = source.match(/<blockquote[^>]*>\s*([\s\S]*?)\s*<\/blockquote>/i);
  const quote = quoteMatch
    ? decodeEntities(stripJsxExpressions(quoteMatch[1]).replace(/<[^>]+>/g, "").trim())
    : null;

  return { title, author, updated, quote };
}

/**
 * Find hero/cover image: first <img src={var} after h1, or first asset import used in img.
 */
function extractCover(source, imports) {
  const imgMatches = [...source.matchAll(/<img\s+[^>]*src=\{(\w+)\}[^>]*>/gi)];
  if (imgMatches.length) {
    const name = imgMatches[0][1];
    if (imports[name]) return imports[name];
  }
  // fallback: first non-logo asset import
  const values = Object.values(imports).filter(
    (f) => !/logo|navbar|react|vite/i.test(f),
  );
  return values[0] || null;
}

/**
 * Convert a slice of JSX body into ordered content nodes.
 * @returns {Array<{kind: string, text?: string, items?: string[], asset?: string, alt?: string}>}
 */
function extractBodyNodes(source, imports) {
  // Cut from first content h2 or first indent paragraph block after hero
  let body = source;
  const markers = [
    body.search(/{\/\*\s*Subjudul/i),
    body.search(/{\/\*\s*Konten Artikel/i),
    body.search(/<h2[\s>]/i),
    body.search(/className="[^"]*indent-8[^"]*"/i),
  ].filter((i) => i >= 0);
  if (markers.length) {
    body = body.slice(Math.min(...markers));
  }

  // Normalize void / self-closing noise
  body = body
    .replace(/\{\/\*[\s\S]*?\*\//g, "")
    .replace(/\n+/g, "\n");

  /** @type {Array<{kind: string, text?: string, items?: string[], asset?: string, alt?: string}>} */
  const nodes = [];

  // Walk with regex for major tags in order
  const tokenRe =
    /<(h2|h3|p|blockquote|ol|ul|li|img|i|em|strong|b|span)(\s[^>]*)?>([\s\S]*?)<\/\1>|<(img)(\s[^>]*)\/>|<(img)(\s[^>]*)>/gi;

  // Simpler sequential scrape: split by opening tags of interest
  const parts = body.split(/(?=<(?:h2|h3|p|blockquote|ol|ul|img)\b)/i);

  for (const part of parts) {
    const h2 = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (h2) {
      const text = cleanInline(h2[1]);
      if (text) nodes.push({ kind: "h2", text });
      continue;
    }
    const h3 = part.match(/^<h3[^>]*>([\s\S]*?)<\/h3>/i);
    if (h3) {
      const text = cleanInline(h3[1]);
      if (text) nodes.push({ kind: "h3", text });
      continue;
    }
    const bq = part.match(/^<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
    if (bq) {
      const text = cleanInline(bq[1]);
      if (text) nodes.push({ kind: "blockquote", text });
      continue;
    }
    const ol = part.match(/^<ol\b[^>]*>([\s\S]*?)<\/ol>/i);
    if (ol) {
      const items = extractListItems(ol[1]);
      if (items.length) nodes.push({ kind: "ol", items });
      // also capture trailing <p> siblings that often follow <li> in these files
      continue;
    }
    const ul = part.match(/^<ul\b[^>]*>([\s\S]*?)<\/ul>/i);
    if (ul) {
      const items = extractListItems(ul[1]);
      if (items.length) nodes.push({ kind: "ul", items });
      continue;
    }
    const img = part.match(/^<img\b([^>]*)>/i);
    if (img) {
      const attrs = img[1];
      const srcVar = attrs.match(/src=\{(\w+)\}/);
      const alt = (attrs.match(/alt=["']([^"']*)["']/) || [])[1] || "";
      if (srcVar && imports[srcVar[1]]) {
        nodes.push({ kind: "image", asset: imports[srcVar[1]], alt });
      }
      continue;
    }
    const p = part.match(/^<p\b[^>]*>([\s\S]*?)<\/p>/i);
    if (p) {
      const text = cleanInline(p[1]);
      if (text) nodes.push({ kind: "p", text });
      continue;
    }
  }

  // Fallback: if almost nothing found, harvest plain text paragraphs from indent-8 blocks
  if (nodes.filter((n) => n.kind === "p" || n.kind === "h2").length < 2) {
    const loose = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const m of loose) {
      const text = cleanInline(m[1]);
      if (text && text.length > 20) nodes.push({ kind: "p", text });
    }
    const heads = [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
    // re-extract properly if fallback was used alone — rebuild ordered from full scan
    if (heads.length && nodes.every((n) => n.kind === "p")) {
      return extractBodyNodesOrdered(body, imports);
    }
  }

  return dedupeAdjacent(nodes);
}

function extractBodyNodesOrdered(body, imports) {
  /** @type {Array<{kind: string, text?: string, items?: string[], asset?: string, alt?: string}>} */
  const nodes = [];
  const re =
    /<(h2|h3|p|blockquote|ol|ul)\b[^>]*>([\s\S]*?)<\/\1>|<(img)\b([^>]*)\/?>/gi;
  let m;
  while ((m = re.exec(body))) {
    const tag = (m[1] || m[3] || "").toLowerCase();
    if (tag === "img") {
      const attrs = m[4] || "";
      const srcVar = attrs.match(/src=\{(\w+)\}/);
      const alt = (attrs.match(/alt=["']([^"']*)["']/) || [])[1] || "";
      if (srcVar && imports[srcVar[1]]) {
        nodes.push({ kind: "image", asset: imports[srcVar[1]], alt });
      }
      continue;
    }
    if (tag === "ol" || tag === "ul") {
      const items = extractListItems(m[2]);
      if (items.length) nodes.push({ kind: tag, items });
      continue;
    }
    const text = cleanInline(m[2]);
    if (text) nodes.push({ kind: tag, text });
  }
  return dedupeAdjacent(nodes);
}

function extractListItems(inner) {
  const items = [];
  const re = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(inner))) {
    // title from li + following description often outside li as <p>
    const text = cleanInline(m[1]);
    if (text) items.push(text);
  }
  // Also capture pattern: <li>title</li><p>desc</p>
  if (items.length) {
    const enriched = [];
    const liBlocks = inner.split(/<\/li>/i);
    for (const block of liBlocks) {
      const titleM = block.match(/<li\b[^>]*>([\s\S]*)$/i) || block.match(/<li\b[^>]*>([\s\S]*)/i);
      if (!titleM && !block.includes("<li")) {
        continue;
      }
      const title = titleM ? cleanInline(titleM[1]) : "";
      const descM = block.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
      const desc = descM ? cleanInline(descM[1]) : "";
      if (title && desc) enriched.push(`${title} — ${desc}`);
      else if (title) enriched.push(title);
    }
    if (enriched.length >= items.length) return enriched;
  }
  return items;
}

function cleanInline(html) {
  let s = stripJsxExpressions(html);
  // Keep emphasis as markdown-ish markers for later PT conversion
  s = s.replace(/<\/?(?:i|em)\b[^>]*>/gi, "*");
  s = s.replace(/<\/?(?:strong|b)\b[^>]*>/gi, "**");
  s = s.replace(/<br\s*\/?>/gi, " ");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  s = s.replace(/\*\*\s*\*\*/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function dedupeAdjacent(nodes) {
  const out = [];
  for (const n of nodes) {
    const prev = out[out.length - 1];
    if (
      prev &&
      prev.kind === n.kind &&
      prev.text &&
      n.text &&
      prev.text === n.text
    ) {
      continue;
    }
    out.push(n);
  }
  return out;
}

function parsePublishedAt(updated) {
  // Examples: "Updated 14:28 AM EDT, Sun July 20, 2025" or "21:00 WITA, Wed July 30, 2025"
  if (!updated) return new Date().toISOString();
  const cleaned = updated.replace(/^Updated\s+/i, "");
  const d = new Date(cleaned.replace(/WITA|EDT|WIB/g, "").replace(/,/g, ""));
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  // try July 30, 2025 pattern
  const m = cleaned.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})/i);
  if (m) {
    const d2 = new Date(`${m[1]} ${m[2]}, ${m[3]} UTC`);
    if (!Number.isNaN(d2.getTime())) return d2.toISOString();
  }
  return new Date().toISOString();
}

function excerptFromNodes(nodes, quote) {
  if (quote) {
    const q = quote.replace(/[“”]/g, '"').trim();
    return q.length > 200 ? q.slice(0, 197) + "…" : q;
  }
  const first = nodes.find((n) => n.kind === "p" && n.text);
  if (!first?.text) return "Artikel kawasan Adat Dalem Tamblingan.";
  return first.text.length > 200 ? first.text.slice(0, 197) + "…" : first.text;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const index = [];

  for (const [fileBase, meta] of Object.entries(MANIFEST)) {
    const filePath = path.join(SOURCE_DIR, `${fileBase}.jsx`);
    if (!fs.existsSync(filePath)) {
      console.warn("MISSING", filePath);
      continue;
    }
    const source = fs.readFileSync(filePath, "utf8");
    const imports = extractImports(source);
    const { title, author, updated, quote } = extractMeta(source);
    const coverAsset = extractCover(source, imports);
    let nodes = extractBodyNodes(source, imports);
    // Prefer ordered full-body scan for better fidelity
    const ordered = extractBodyNodesOrdered(
      source.slice(source.search(/<h2[\s>]|<p\b[^>]*indent|{\/\*\s*Subjudul|{\/\*\s*Konten/i)),
      imports,
    );
    if (ordered.length > nodes.length) nodes = ordered;

    // Prepend quote as blockquote if not already first content
    if (quote && !nodes.some((n) => n.kind === "blockquote" && n.text === quote)) {
      nodes = [{ kind: "blockquote", text: quote }, ...nodes];
    }

    const article = {
      sourceFile: fileBase,
      ...meta,
      title_id: title,
      authorName: author,
      publishedAt: parsePublishedAt(updated),
      updatedRaw: updated,
      coverAsset,
      excerpt_id: excerptFromNodes(nodes, quote),
      assets: [...new Set(nodes.filter((n) => n.kind === "image").map((n) => n.asset).concat(coverAsset ? [coverAsset] : []))],
      nodes,
    };

    const outFile = path.join(OUT_DIR, `${meta.slug}.json`);
    fs.writeFileSync(outFile, JSON.stringify(article, null, 2), "utf8");
    index.push({
      slug: meta.slug,
      type: meta.type,
      title: title,
      nodes: nodes.length,
      assets: article.assets.length,
      coverAsset,
    });
    console.log(
      `✓ ${meta.slug} — ${nodes.length} nodes, ${article.assets.length} assets`,
    );
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "_index.json"),
    JSON.stringify(index, null, 2),
    "utf8",
  );
  console.log(`\nWrote ${index.length} articles to ${OUT_DIR}`);
}

main();
