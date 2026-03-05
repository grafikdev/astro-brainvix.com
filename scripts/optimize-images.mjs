// scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const dir = 'public/assets/images';
const files = readdirSync(dir);

for (const file of files) {
  const filePath = join(dir, file);
  const stat = statSync(filePath);
  const sizeMB = stat.size / (1024 * 1024);

  // Optimise seulement les fichiers > 200KB
  if (sizeMB < 0.2) continue;

  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    await sharp(filePath)
      .jpeg({ quality: 85, progressive: true })
      .toFile(filePath + '.tmp');
    const fs = await import('fs');
    fs.renameSync(filePath + '.tmp', filePath);
    const newStat = statSync(filePath);
    console.log(`${file}: ${(sizeMB * 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB`);
  } else if (file.endsWith('.png')) {
    await sharp(filePath)
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(filePath + '.tmp');
    const fs = await import('fs');
    fs.renameSync(filePath + '.tmp', filePath);
    const newStat = statSync(filePath);
    console.log(`${file}: ${(sizeMB * 1024).toFixed(0)}KB → ${(newStat.size / 1024).toFixed(0)}KB`);
  }
}
console.log('Done!');
