const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, pixelFn) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(Buffer.concat([Buffer.from(type, 'ascii'), data]));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c >>> 0;
}

function draw1FiIcon(x, y, w, h) {
  // Rounded corner distance
  const r = 6;
  const inCorner = 
    (x < r && y < r && Math.hypot(x - r, y - r) > r) ||
    (x >= w - r && y < r && Math.hypot(x - (w - r - 1), y - r) > r) ||
    (x < r && y >= h - r && Math.hypot(x - r, y - (h - r - 1)) > r) ||
    (x >= w - r && y >= h - r && Math.hypot(x - (w - r - 1), y - (h - r - 1)) > r);

  if (inCorner) return [0, 0, 0, 0];

  // 1Fi Brand Purple Background: #6C28D9 (108, 40, 217)
  let pr = 108, pg = 40, pb = 217, pa = 255;

  // Upward Arrow / Compounding Green Accent: #34D399 (52, 211, 153)
  // Draw upward trending zigzag line from bottom-left to top-right
  const isGreenArrow = 
    (x >= 18 && x <= 26 && y >= 6 && y <= 9) || // Top arrow head horiz
    (x >= 23 && x <= 26 && y >= 6 && y <= 14) || // Top arrow head vert
    (Math.abs((y - 7) - (-1.2 * (x - 24))) < 2 && x >= 14 && x <= 24); // diagonal

  if (isGreenArrow) {
    return [52, 211, 153, 255];
  }

  // White "1" digit on left
  const isWhiteOne = 
    (x >= 8 && x <= 11 && y >= 11 && y <= 24) || // stem
    (x >= 5 && x <= 8 && y >= 14 && y <= 17 && (x + y >= 20)) || // serif
    (x >= 5 && x <= 14 && y >= 22 && y <= 24); // base

  if (isWhiteOne) {
    return [255, 255, 255, 255];
  }

  // Emerald "Fi" on right
  const isEmeraldF = 
    (x >= 15 && x <= 17 && y >= 13 && y <= 24) || // F stem
    (x >= 15 && x <= 22 && y >= 13 && y <= 15) || // F top bar
    (x >= 15 && x <= 20 && y >= 18 && y <= 20);   // F mid bar

  const isEmeraldI = 
    (x >= 24 && x <= 26 && y >= 16 && y <= 24) || // i stem
    (x >= 24 && x <= 26 && y >= 13 && y <= 14);   // i dot

  if (isEmeraldF || isEmeraldI) {
    return [52, 211, 153, 255];
  }

  return [pr, pg, pb, pa];
}

function createIco(pngBuffer) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: Icon
  header.writeUInt16LE(1, 4); // Count: 1 image

  // Entry 1
  header.writeUInt8(32, 6); // Width: 32
  header.writeUInt8(32, 7); // Height: 32
  header.writeUInt8(0, 8);  // Colors
  header.writeUInt8(0, 9);  // Reserved
  header.writeUInt16LE(1, 10); // Color planes
  header.writeUInt16LE(32, 12); // Bits per pixel
  header.writeUInt32LE(pngBuffer.length, 14); // Image size
  header.writeUInt32LE(22, 18); // Offset

  return Buffer.concat([header, pngBuffer]);
}

const png32 = createPng(32, 32, draw1FiIcon);
const png64 = createPng(64, 64, (x, y) => draw1FiIcon(Math.floor(x / 2), Math.floor(y / 2), 32, 32));
const ico = createIco(png32);

const targets = [
  'public/favicon.ico',
  'public/icon.png',
  'public/logo.png',
  'public/images/logo.png',
  'src/app/favicon.ico',
  'src/app/icon.png'
];

targets.forEach(t => {
  const dir = path.dirname(path.resolve(__dirname, '..', t));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (t.endsWith('.ico')) {
    fs.writeFileSync(path.resolve(__dirname, '..', t), ico);
  } else {
    fs.writeFileSync(path.resolve(__dirname, '..', t), png64);
  }
  console.log('Wrote 1Fi brand icon to:', t);
});
