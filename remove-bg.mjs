import { removeBackground } from "@imgly/background-removal-node";
import fs from "node:fs";
import path from "node:path";

const [, , inputArg, outputArg] = process.argv;
const INPUT = path.resolve(inputArg ?? "assets/JAMES-1.jpeg");
const OUTPUT = path.resolve(outputArg ?? "assets/james.png");

console.log("[bg-removal] entrada:", INPUT);
console.log("[bg-removal] saída:", OUTPUT);
console.log("[bg-removal] processando (1ª execução baixa o modelo ~100MB)...");

const startedAt = Date.now();

const inputBuffer = fs.readFileSync(INPUT);
const ext = path.extname(INPUT).toLowerCase();
const mime = ext === ".png" ? "image/png" : "image/jpeg";
const inputBlob = new Blob([inputBuffer], { type: mime });

const blob = await removeBackground(inputBlob, {
  output: { format: "image/png", quality: 1 },
  progress: (key, current, total) => {
    if (total) {
      const pct = ((current / total) * 100).toFixed(0);
      process.stdout.write(`\r[bg-removal] ${key}: ${pct}%`);
    }
  },
});

process.stdout.write("\n");

const buffer = Buffer.from(await blob.arrayBuffer());
fs.writeFileSync(OUTPUT, buffer);

const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
console.log(`[bg-removal] pronto em ${elapsed}s — ${(buffer.length / 1024).toFixed(0)} KB`);
