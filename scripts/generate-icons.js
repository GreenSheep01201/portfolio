const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/favicon.svg');
const publicPath = path.join(__dirname, '../public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate logo192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicPath, 'logo192.png'));
  console.log('Created logo192.png');

  // Generate logo512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicPath, 'logo512.png'));
  console.log('Created logo512.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicPath, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Generate favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicPath, 'favicon-32.png'));
  console.log('Created favicon-32.png');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
