/**
 * Generuje pliki logo i favikony z oryginału „Logo faworyt 2.png".
 *
 *   node scripts/build-brand.mjs
 *
 * Źródło jest rastrem na białym tle, więc skrypt:
 *   1. wycina tło (biel → przezroczystość, z zachowaniem antyaliasingu),
 *   2. rozdziela emblemat od napisów — favikona nie może zawierać dolnego
 *      podpisu, bo w rozmiarze 32 px zlewa się w plamę,
 *   3. składa poziomy lockup na nagłówek strony.
 *
 * Kadry pochodzą z analizy pikseli oryginału (1728×2304): emblemat zajmuje
 * y 522–1445, wordmark „LetFit Physio" y 1510–1686, podpis „FIZJOTERAPIA"
 * y 1711–1778. Gdyby oryginał się zmienił, trzeba je przeliczyć na nowo.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** Ścieżka względem tego pliku, żeby skrypt działał po sklonowaniu repozytorium. */
const SRC = path.resolve(
  import.meta.dirname,
  "../../brand/archive/Logo faworyt 2.png"
);

const PUBLIC_BRAND = path.resolve("public/brand");
const APP_DIR = path.resolve("src/app");

/** Ramki wyznaczone z analizy oryginału. */
const BOX = {
  // Kilka pikseli luzu na prawej krawędzi, żeby nie ucinać kreski przy „FIZJOTERAPIA".
  emblem: { left: 349, top: 522, width: 1039, height: 924 },
  wordmark: { left: 265, top: 1502, width: 1201, height: 285 },
  full: { left: 265, top: 514, width: 1201, height: 1273 },
};

/**
 * Biel na przezroczystość. Próg dobrany pod tło oryginału (L ≈ 253):
 * powyżej 250 piksel znika, poniżej 200 zostaje w pełni kryjący,
 * pomiędzy — płynne przejście, dzięki czemu krawędzie nie są poszarpane.
 */
async function cutBackground(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    const alpha = Math.max(0, Math.min(255, Math.round(((250 - l) / 50) * 255)));
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = Math.min(data[i + 3], alpha);
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

/**
 * Emblemat na przezroczystym kwadracie.
 *
 * Marginesu NIE dokładamy poszerzając kadr w oryginale — między emblematem
 * (koniec y 1445) a napisem „LetFit Physio" (start y 1510) jest tylko 65 px,
 * więc kwadratowy kadr wciągnąłby górę liter. Zamiast tego wycinamy emblemat
 * dokładnie po jego ramce i dopiero potem wstawiamy go na pusty kwadrat.
 */
async function squareEmblem(size) {
  const inner = Math.round(size * 0.92);
  const pad = Math.round((size - inner) / 2);
  const cropped = await cutBackground(
    await sharp(SRC).extract(BOX.emblem).toBuffer()
  );
  return sharp(cropped)
    .resize(inner, inner, { fit: "contain", background: "#00000000" })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: "#00000000",
    })
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(PUBLIC_BRAND, { recursive: true });

  const emblem = await squareEmblem(1024);
  const wordmark = await cutBackground(
    await sharp(SRC).extract(BOX.wordmark).toBuffer()
  );
  const full = await cutBackground(await sharp(SRC).extract(BOX.full).toBuffer());

  // 1. Emblemat — sam sygnet, bez napisów.
  await sharp(emblem).png().toFile(path.join(PUBLIC_BRAND, "letfit-emblem.png"));

  // 2. Pion — emblemat z pełnym podpisem.
  await sharp(full)
    .resize(1024, null, { fit: "inside" })
    .png()
    .toFile(path.join(PUBLIC_BRAND, "letfit-full.png"));

  // 3. Poziomy lockup na nagłówek: emblemat + wordmark obok siebie.
  const H = 400;
  const gap = Math.round(H * 0.16);
  const wordH = Math.round(H * 0.62);
  const wordW = Math.round((BOX.wordmark.width / BOX.wordmark.height) * wordH);

  const emblemLayer = await sharp(emblem).resize(H, H, { fit: "contain" }).toBuffer();
  const wordLayer = await sharp(wordmark).resize(wordW, wordH).toBuffer();

  await sharp({
    create: {
      width: H + gap + wordW,
      height: H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: emblemLayer, left: 0, top: 0 },
      { input: wordLayer, left: H + gap, top: Math.round((H - wordH) / 2) },
    ])
    .png()
    .toFile(path.join(PUBLIC_BRAND, "letfit-horizontal.png"));

  // 4. Favikona — sam emblemat, przezroczyste tło.
  await sharp(emblem).resize(512, 512).png().toFile(path.join(APP_DIR, "icon.png"));

  // 5. Ikona iOS — emblemat na jasnej płycie, bo przezroczystość wygląda tam źle.
  const appleInner = await sharp(emblem).resize(150, 150, { fit: "contain" }).toBuffer();
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: "#ffffff" },
  })
    .composite([{ input: appleInner, left: 15, top: 15 }])
    .png()
    .toFile(path.join(APP_DIR, "apple-icon.png"));

  console.log("Gotowe: emblemat, pion, poziom, icon.png, apple-icon.png");
}

await main();
