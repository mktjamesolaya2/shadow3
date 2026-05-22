import sharp from "sharp";

const { data, info } = await sharp("assets/LOGO ACADEMY-2026-03.png")
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
console.log(`Dimensões: ${width}x${height}`);

// Histograma de cores únicas
const colors = new Map();
const leftHalfColors = new Map();
const rightHalfColors = new Map();

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = `${r},${g},${b}`;
    colors.set(key, (colors.get(key) ?? 0) + 1);
    if (x < width / 2) {
      leftHalfColors.set(key, (leftHalfColors.get(key) ?? 0) + 1);
    } else {
      rightHalfColors.set(key, (rightHalfColors.get(key) ?? 0) + 1);
    }
  }
}

console.log(`\nTotal cores únicas: ${colors.size}`);

// Top 10 cores
const sorted = [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
console.log("\nTop 15 cores em toda imagem:");
for (const [color, count] of sorted) {
  const pct = ((count / (width * height)) * 100).toFixed(2);
  console.log(`  RGB(${color}): ${count} pixels (${pct}%)`);
}

// Lado esquerdo: alguma cor não-branca?
console.log("\nCores na METADE ESQUERDA que NÃO são puramente brancas (>=240,240,240):");
let leftNonWhite = 0;
const leftInteresting = [];
for (const [key, count] of leftHalfColors) {
  const [r, g, b] = key.split(",").map(Number);
  if (r < 240 || g < 240 || b < 240) {
    leftNonWhite += count;
    leftInteresting.push([key, count]);
  }
}
console.log(`  Total pixels não-brancos no lado esquerdo: ${leftNonWhite}`);
if (leftInteresting.length > 0) {
  leftInteresting.sort((a, b) => b[1] - a[1]);
  console.log("  Top 10 cores não-brancas no lado esquerdo:");
  for (const [color, count] of leftInteresting.slice(0, 10)) {
    console.log(`    RGB(${color}): ${count} pixels`);
  }
}
