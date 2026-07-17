/**
 * Generates the placeholder assets for the "Ambient Mountain" home page:
 * - gapura.png: a candi-bentar (split gate) silhouette with a fully
 *   transparent center column, used for the zoom-through entrance.
 * - hero-mist.png: a moody blue-grey/forest gradient backdrop.
 *
 * Replace with real photography/artwork before launch.
 * Run: node scripts/generate-ambient-assets.mjs
 */
import zlib from "node:zlib";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

/** RGBA PNG from a per-pixel callback returning [r, g, b, a]. */
function makePngRgba(width, height, pixelAt) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: truecolor + alpha

  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelAt(x, y);
      const o = 1 + x * 4;
      row[o] = r;
      row[o + 1] = g;
      row[o + 2] = b;
      row[o + 3] = a;
    }
    rows.push(row);
  }
  const idat = zlib.deflateSync(Buffer.concat(rows), { level: 9 });

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

// ---- gapura.png: split gate, transparent middle ----
const SIZE = 1600;
const CX = SIZE / 2;
const GAP_HALF = 250; // transparent column half-width
// Stepped tiers of the candi bentar: [outerDx, topY, shade]
const TIERS = [
  [350, 120, 1.0],
  [450, 260, 0.94],
  [550, 400, 0.88],
  [650, 540, 0.82],
  [800, 680, 0.76],
];
const FOREST = [22, 40, 31]; // deep forest silhouette

function gapuraPixel(x, y) {
  const dx = Math.abs(x - CX);
  if (dx < GAP_HALF) return [0, 0, 0, 0]; // transparent center
  for (const [outer, top, shade] of TIERS) {
    if (dx < outer) {
      if (y >= top) {
        return [
          Math.round(FOREST[0] * shade),
          Math.round(FOREST[1] * shade),
          Math.round(FOREST[2] * shade),
          255,
        ];
      }
      return [0, 0, 0, 0];
    }
  }
  // outside outermost tier: opaque base wall below the lowest tier top
  return y >= TIERS[TIERS.length - 1][1] ? [...FOREST, 255] : [0, 0, 0, 0];
}

// ---- hero-mist.png: fog -> lake blue-grey -> deep forest ----
const MIST_TOP = [143, 166, 179]; // fog
const MIST_MID = [44, 74, 94]; // Danau Tamblingan blue-grey
const MIST_BOTTOM = [30, 53, 47]; // deep forest green

function heroPixel(x, y, width, height) {
  const t = y / height;
  let rgb;
  if (t < 0.45) {
    rgb = lerpColor(MIST_TOP, MIST_MID, t / 0.45);
  } else {
    rgb = lerpColor(MIST_MID, MIST_BOTTOM, (t - 0.45) / 0.55);
  }
  // subtle horizontal mist bands
  const band = Math.sin((y / height) * Math.PI * 6 + x / 900) * 6;
  return [
    Math.min(255, Math.max(0, rgb[0] + band)),
    Math.min(255, Math.max(0, rgb[1] + band)),
    Math.min(255, Math.max(0, rgb[2] + band)),
    255,
  ];
}

const outputs = [
  ["images/gapura.png", () => makePngRgba(SIZE, SIZE, gapuraPixel)],
  [
    "images/hero-mist.png",
    () => makePngRgba(1920, 1080, (x, y) => heroPixel(x, y, 1920, 1080)),
  ],
];

for (const [rel, make] of outputs) {
  const target = path.join(root, "public", rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, make());
  console.log("created", rel);
}
console.log("Done. Replace with real gapura artwork / photography before launch.");
