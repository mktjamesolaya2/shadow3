import sharp from "sharp";
import path from "node:path";

const INPUT = path.resolve("assets/logo_fundopreto.png");
const OUTPUT = path.resolve("assets/logo-academy.png");

console.log("[logo] processando:", INPUT);

const meta = await sharp(INPUT).metadata();
console.log(`[logo] original: ${meta.width}x${meta.height} px`);

await sharp(INPUT)
  .trim({ background: { r: 0, g: 0, b: 0 }, threshold: 10 })
  .toFile(OUTPUT);

const out = await sharp(OUTPUT).metadata();
console.log(`[logo] cortado:  ${out.width}x${out.height} px`);
console.log(`[logo] salvo em: ${OUTPUT}`);
