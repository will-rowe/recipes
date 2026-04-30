import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = path.resolve("static/img/posts");
const outputDir = path.resolve("static/img/posts/_resized");
const widths = [360, 560, 640, 760, 960, 1400];
const quality = 75;
const validExt = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => validExt.has(path.extname(name).toLowerCase()));
}

async function generateOne(fileName) {
  const src = path.join(inputDir, fileName);
  const base = path.parse(fileName).name;

  await Promise.all(
    widths.map(async (width) => {
      const dst = path.join(outputDir, `${base}-w${width}.webp`);
      await sharp(src)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(dst);
    })
  );
}

async function main() {
  await ensureDir(outputDir);
  const files = await listImages(inputDir);
  await Promise.all(files.map((file) => generateOne(file)));
  console.log(`Generated responsive images for ${files.length} source files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
