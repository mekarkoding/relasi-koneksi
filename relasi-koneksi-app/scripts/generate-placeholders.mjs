/**
 * Generates solid-color placeholder PNGs for the hardcoded data mockups
 * (homestays, attractions, booklet, downloads) so next/image static imports
 * work out of the box. Replace these with real photos before launch.
 *
 * Run: node scripts/generate-placeholders.mjs
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

/** Solid-color 8-bit RGB PNG with a subtle vertical gradient. */
function makePng(width, height, [r, g, b]) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor

  const rows = [];
  for (let y = 0; y < height; y++) {
    const shade = 1 - (y / height) * 0.25;
    const row = Buffer.alloc(1 + width * 3);
    for (let x = 0; x < width; x++) {
      row[1 + x * 3] = Math.round(r * shade);
      row[2 + x * 3] = Math.round(g * shade);
      row[3 + x * 3] = Math.round(b * shade);
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

// Earthy palette variations for visual distinction between placeholders
const images = [
  ["images/hero.png", 1600, 900, [200, 75, 49]],
  ["images/homestays/homestay-1-1.png", 1200, 800, [224, 122, 95]],
  ["images/homestays/homestay-1-2.png", 1200, 800, [200, 75, 49]],
  ["images/homestays/homestay-2-1.png", 1200, 800, [165, 60, 38]],
  ["images/homestays/homestay-2-2.png", 1200, 800, [224, 122, 95]],
  ["images/attractions/attraction-1-1.png", 1200, 800, [45, 66, 99]],
  ["images/attractions/attraction-1-2.png", 1200, 800, [62, 85, 128]],
  ["images/attractions/attraction-2-1.png", 1200, 800, [45, 90, 70]],
  ["images/attractions/attraction-2-2.png", 1200, 800, [60, 110, 85]],
  ["images/attractions/attraction-3-1.png", 1200, 800, [130, 100, 60]],
  ["images/attractions/attraction-3-2.png", 1200, 800, [150, 120, 75]],
  ["images/booklet/booklet-1.png", 800, 1000, [45, 90, 70]],
  ["images/booklet/booklet-2.png", 800, 1000, [200, 75, 49]],
  ["images/booklet/booklet-3.png", 800, 1000, [45, 66, 99]],
  ["images/booklet/booklet-4.png", 800, 1000, [130, 100, 60]],
  ["images/guidebook-cover.png", 800, 1130, [45, 66, 99]],
];

for (const [rel, w, h, color] of images) {
  const target = path.join(root, "public", rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, makePng(w, h, color));
  console.log("created", rel);
}
console.log("Done. Replace these placeholders with real photos before launch.");
