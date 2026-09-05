const fs = require('fs');
const path = require('path');

const src = path.join('C:', 'Users', 'Yash Sharma', '.gemini', 'antigravity-ide', 'brain', '11f025c0-3d08-4240-bbbe-3b19ee77f131', '.user_uploaded', 'media_1788562249220.png');

if (!fs.existsSync(src)) {
  console.error('Source image not found at', src);
  process.exit(1);
}

const pngBuffer = fs.readFileSync(src);
const base64Data = pngBuffer.toString('base64');

// Copy binary PNG to all standard favicon paths
const pngTargets = [
  path.join(__dirname, '..', 'public', 'favicon.ico'),
  path.join(__dirname, '..', 'public', 'favicon.png'),
  path.join(__dirname, '..', 'public', 'apple-touch-icon.png'),
  path.join(__dirname, '..', 'public', 'icon.png'),
  path.join(__dirname, '..', 'public', '1fi-icon.png'),
  path.join(__dirname, '..', 'src', 'app', 'icon.png'),
  path.join(__dirname, '..', 'src', 'app', 'apple-icon.png'),
  path.join(__dirname, '..', 'src', 'app', 'favicon.ico'),
];

pngTargets.forEach((target) => {
  const dir = path.dirname(target);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(target, pngBuffer);
  console.log('Updated PNG:', target);
});

// Create crisp SVG encapsulating the exact uploaded image
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${base64Data}" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>`;

const svgTargets = [
  path.join(__dirname, '..', 'public', 'icon.svg'),
  path.join(__dirname, '..', 'public', '1fi-icon.svg'),
  path.join(__dirname, '..', 'src', 'app', 'icon.svg'),
];

svgTargets.forEach((target) => {
  fs.writeFileSync(target, svgContent);
  console.log('Updated SVG:', target);
});

console.log('All favicons successfully updated from user upload!');
