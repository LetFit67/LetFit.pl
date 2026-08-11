/**
 * Generuje assety marki z nowego znaku piktogramowego (sierpień 2026).
 *
 *   node scripts/build-brand-pictogram.mjs
 *
 * Źródła leżą w „Logo concept/Piktogram 2026". Są to rastry na białym tle,
 * więc skrypt wycina biel do przezroczystości, przycina do zawartości
 * i składa docelowe pliki.
 *
 * UWAGA: `letfit-horizontal.png`, `icon.png` i `apple-icon.png` nadpisuje
 * również stary `build-brand.mjs` (poprzednie logo z kręgosłupem w okręgu).
 * Uruchomienie tamtego skryptu cofnie zmianę — dopóki oba znaki są w obiegu,
 * trzeba pamiętać, który skrypt był ostatni.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** Ścieżka względem tego pliku, żeby skrypt działał po sklonowaniu repozytorium. */
const SRC_DIR = path.resolve(import.meta.dirname, "../../brand/pictogram-2026");

const SRC = {
  mark: path.join(SRC_DIR, "sygnet.png"),
  horizontal: path.join(SRC_DIR, "lockup-kursywa-4-tylko-F-niebieskie-mocniejszy-pochyl.png"),
};

const PUBLIC_BRAND = path.resolve("public/brand");
const APP_DIR = path.resolve("src/app");

/**
 * Pliki spod `public/brand` idą do przeglądarki wprost, z pominięciem
 * `/_next/image` (patrz `unoptimized` w komponencie `Logo`), więc kompresję
 * muszą mieć własną. Znak ma kilka płaskich kolorów, więc paleta ścina rozmiar
 * kilkukrotnie i nie widać na tym różnicy.
 */
const WEB_PNG = { palette: true, quality: 90, effort: 9 };

/**
 * Biel na przezroczystość. Tło generacji ma L ≈ 254–255, najciemniejszy piksel
 * znaku L ≈ 15, więc próg z zakresu 200–250 rozdziela je z zapasem i zostawia
 * płynny antyaliasing na krawędziach.
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

/** Wycina biel i przycina pusty margines do samej zawartości znaku. */
async function cutAndTrim(file) {
  const cut = await cutBackground(file);
  return sharp(cut)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .png()
    .toBuffer();
}

/**
 * Sygnet wpisany w przezroczysty kwadrat.
 *
 * `ratio` to udział znaku w boku kwadratu. Do użycia na stronie zostawiamy
 * margines oddechowy (0.9), ale favikona dostaje kadr ciasny (0.98) — przy
 * 32 px każdy pusty piksel na obwodzie realnie zmniejsza czytelność znaku.
 */
async function squareMark(size, ratio = 0.9) {
  const inner = Math.round(size * ratio);
  const pad = Math.round((size - inner) / 2);
  const trimmed = await cutAndTrim(SRC.mark);
  return sharp(trimmed)
    .resize(inner, inner, { fit: "contain", background: "#00000000" })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: "#00000000" })
    .png()
    .toBuffer();
}

/** Kolory napisu — zdjęte z samej generacji, żeby napis grał z sygnetem. */
const WORD_BLUE = [0x52, 0x9d, 0xd4];
const WORD_NAVY = [0x1f, 0x30, 0x4e];

/** Etykietuje spójne obszary (8-sąsiedztwo) po pikselach z alfą ≥ `minAlpha`. */
function components(data, width, height, minAlpha = 60) {
  const labels = new Int32Array(width * height).fill(-1);
  const found = [];
  const stack = [];

  for (let p = 0; p < width * height; p++) {
    if (labels[p] !== -1 || data[p * 4 + 3] < minAlpha) continue;
    const comp = { pixels: [], x0: width, x1: 0, y0: height, y1: 0 };
    found.push(comp);
    labels[p] = found.length - 1;
    stack.push(p);

    while (stack.length) {
      const q = stack.pop();
      const x = q % width;
      const y = (q / width) | 0;
      comp.pixels.push(q);
      if (x < comp.x0) comp.x0 = x;
      if (x > comp.x1) comp.x1 = x;
      if (y < comp.y0) comp.y0 = y;
      if (y > comp.y1) comp.y1 = y;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const np = ny * width + nx;
          if (labels[np] === -1 && data[np * 4 + 3] >= minAlpha) {
            labels[np] = found.length - 1;
            stack.push(np);
          }
        }
      }
    }
  }

  return found.filter((c) => c.pixels.length > 200);
}

/**
 * Przekolorowuje napis w lockupie: „Let" na błękit, „Fit" na granat,
 * a kropka nad „i" zostaje błękitna (decyzja Mikołaja z 11.08.2026).
 *
 * Generacja jest rastrem, więc litery trzeba najpierw wyłuskać jako spójne
 * obszary. Kreska rozdzielająca sygnet od napisu ciągnie się przez całą wysokość
 * i jest wąska — po tym się ją poznaje, a wszystko na prawo od niej to napis.
 * Kropka nad „i" jest osobnym obszarem wiszącym wysoko nad linią pisma, więc
 * odpada z szeregu liter zanim ten pójdzie do podziału 3 + 3.
 */
async function recolorWordmark(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const comps = components(data, width, height);

  const divider = comps.find(
    (c) => c.y1 - c.y0 > height * 0.9 && c.x1 - c.x0 < width * 0.05
  );
  if (!divider) throw new Error("Nie znaleziono kreski rozdzielającej w lockupie.");

  const word = comps.filter((c) => c.x0 > divider.x1).sort((a, b) => a.x0 - b.x0);
  const baseline = Math.max(...word.map((c) => c.y1));
  const top = Math.min(...word.map((c) => c.y0));

  // Kropka: obszar kończący się wysoko nad linią pisma.
  const dots = word.filter((c) => c.y1 < baseline - (baseline - top) * 0.4);
  const letters = word.filter((c) => !dots.includes(c));
  if (letters.length !== 6) {
    throw new Error(`Oczekiwano 6 liter w napisie, znaleziono ${letters.length}.`);
  }

  const out = Buffer.from(data);
  const paint = (comp, [r, g, b]) => {
    for (const p of comp.pixels) {
      out[p * 4] = r;
      out[p * 4 + 1] = g;
      out[p * 4 + 2] = b;
    }
  };

  letters.slice(0, 3).forEach((c) => paint(c, WORD_BLUE)); // L e t
  letters.slice(3).forEach((c) => paint(c, WORD_NAVY)); //    F i t
  dots.forEach((c) => paint(c, WORD_BLUE)); //                kropka nad „i"

  return sharp(out, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/**
 * Wersja znaku na ciemną płytę: granatowa sylwetka zamienia się w biel,
 * błękitny łuk zostaje. Podział po jasności — granat ma L ≈ 33, błękit L ≈ 137,
 * więc próg 85 rozdziela je bez pudła.
 */
async function invertFigureToWhite(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue;
    const l = 0.299 * out[i] + 0.587 * out[i + 1] + 0.114 * out[i + 2];
    if (l < 85) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
    }
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

/**
 * Favikona na pełnej granatowej płycie.
 *
 * Sam znak na przezroczystym tle znikał w ciemnym pasku zakładek — granat na
 * granacie. Płyta daje stały kontrast niezależnie od tego, czy przeglądarka
 * ma jasny czy ciemny motyw, a odwrócony znak czyta się przy 16 px.
 */
async function faviconPlate(size, { round = true } = {}) {
  const inner = Math.round(size * 0.78);
  const pad = Math.round((size - inner) / 2);
  const r = round ? Math.round(size * 0.22) : 0;

  const plate = await sharp(
    Buffer.from(
      `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
         <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#14243F"/>
       </svg>`
    )
  )
    .png()
    .toBuffer();

  const figure = await sharp(await invertFigureToWhite(await cutAndTrim(SRC.mark)))
    .resize(inner, inner, { fit: "contain", background: "#00000000" })
    .png()
    .toBuffer();

  return sharp(plate)
    .composite([{ input: figure, left: pad, top: pad }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(PUBLIC_BRAND, { recursive: true });

  // 1. Sam sygnet — bez podpisu, na przezroczystym kwadracie.
  //    Ten sam plik służy za znak wodny w hero, więc trzyma pełne 1024 px.
  const mark = await squareMark(1024);
  await sharp(mark).png(WEB_PNG).toFile(path.join(PUBLIC_BRAND, "letfit-mark.png"));

  // 2. Poziomy lockup na nagłówek i stopkę — sygnet + kursywa „LetFit"
  //    („Let" błękitne, „Fit" granatowe, kropka nad „i" błękitna).
  const horizontal = await recolorWordmark(await cutAndTrim(SRC.horizontal));
  const info = await sharp(horizontal)
    .resize(null, 400, { fit: "inside" })
    .png(WEB_PNG)
    .toFile(path.join(PUBLIC_BRAND, "letfit-horizontal.png"));

  // 3. Favikona — biały znak na granatowej płycie z zaokrąglonymi rogami.
  await sharp(await faviconPlate(512)).png().toFile(path.join(APP_DIR, "icon.png"));

  // 4. Ikona iOS — ta sama płyta, ale bez zaokrąglenia: iOS przycina róg sam,
  //    a własny promień dawałby podwójną ramkę.
  await sharp(await faviconPlate(180, { round: false }))
    .png()
    .toFile(path.join(APP_DIR, "apple-icon.png"));

  // 5. Sygnet z wyciętym tłem obok źródeł — do dalszej pracy nad księgą znaku.
  await sharp(mark).png().toFile(path.join(SRC_DIR, "sygnet-przezroczysty.png"));

  console.log(
    `Gotowe: letfit-mark.png, letfit-horizontal.png (${info.width}×${info.height}), icon.png, apple-icon.png`
  );
}

await main();
