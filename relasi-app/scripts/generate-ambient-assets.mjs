/**
 * Generates hero-mist.png — moody blue-grey/forest gradient for the landing reveal.
 * Gapura art is real PNGs (gapura-left.png / gapura-right.png); do not regenerate those.
 *
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
    row[0] = 0; // filter none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelAt(x, y, width, height);
      const i = 1 + x * 4;
      row[i] = r;
      row[i + 1] = g;
      row[i + 2] = b;
      row[i + 3] = a;
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

const MIST_TOP = [143, 166, 179];
const MIST_MID = [44, 74, 94];
const MIST_BOTTOM = [30, 53, 47];

function heroPixel(x, y, width, height) {
  const t = y / height;
  let rgb;
  if (t < 0.45) {
    rgb = lerpColor(MIST_TOP, MIST_MID, t / 0.45);
  } else {
    rgb = lerpColor(MIST_MID, MIST_BOTTOM, (t - 0.45) / 0.55);
  }
  const band = Math.sin((y / height) * Math.PI * 6 + x / 900) * 6;
  return [
    Math.min(255, Math.max(0, rgb[0] + band)),
    Math.min(255, Math.max(0, rgb[1] + band)),
    Math.min(255, Math.max(0, rgb[2] + band)),
    255,
  ];
}

const target = path.join(root, "public", "images", "hero-mist.png");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(
  target,
  makePngRgba(1920, 1080, (x, y) => heroPixel(x, y, 1920, 1080)),
);
console.log("created images/hero-mist.png");
