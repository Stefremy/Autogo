const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// allow passing a source image path as first arg, default to public/images/favicon.png
const srcArg = process.argv[2] || path.join('public', 'images', 'favicon.png');
const src = path.isAbsolute(srcArg) ? srcArg : path.join(process.cwd(), srcArg);
const out = path.join(process.cwd(), 'public');

if (!fs.existsSync(src)) {
  console.error('Source not found:', src);
  process.exit(1);
}

async function run() {
  try {
    // 32x32
    await sharp(src).resize(32, 32).png().toFile(path.join(out, 'favicon-32x32.png'));
    // 48x48
    await sharp(src).resize(48, 48).png().toFile(path.join(out, 'favicon-48x48.png'));
    // 180x180 for apple
    await sharp(src).resize(180, 180).png().toFile(path.join(out, 'apple-touch-icon.png'));
    // ICO (contain both 32 and 48) - sharp can output .ico via raw then use jimp, but to keep deps small we'll create a single 48x48 png and save as .ico
    await sharp(src).resize(48, 48).png().toFile(path.join(out, 'favicon.ico'));

    console.log('Favicons generated in', out);
  } catch (err) {
    console.error('Error generating favicons:', err);
    process.exit(1);
  }
}

run();
