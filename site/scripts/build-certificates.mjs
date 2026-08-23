/**
 * Wyciąga certyfikaty ze skanów PDF do plików JPG na stronę.
 *
 *   node scripts/build-certificates.mjs
 *
 * Źródła leżą w „media/Certyfikaty" i są skanami: każdy PDF nie ma warstwy
 * tekstowej, tylko jeden wklejony obraz A4 w 2409×3437 px.
 *
 * DLACZEGO NIE RASTERYZUJEMY PDF-A. Rasteryzacja wymagałaby poppler-utils
 * albo Ghostscriptu, a żadnego z nich nie ma ani w systemie, ani w projekcie.
 * Nie trzeba: obraz w środku jest zapisany filtrem `DCTDecode`, czyli jest
 * gotowym strumieniem JPEG. Wystarczy znaleźć jego początek (FFD8FF) i koniec
 * (FFD9) i przepisać bajty. Rozpakowywanie PDF-a w ogóle nie wchodzi w grę.
 *
 * Skanów nie wrzucamy na stronę w oryginale: pojedynczy plik ma ok. 400–760 kB,
 * a dziesięć takich to kilka megabajtów na jedną sekcję. Skalujemy do 1400 px
 * wysokości, co przy A4 daje ok. 980 px szerokości — wystarczająco, żeby
 * certyfikat dało się przeczytać po otwarciu w nowej karcie.
 *
 * Dopisując nowy certyfikat: wrzuć PDF do „media/Certyfikaty", dopisz go do
 * mapy SLUGI poniżej i uruchom skrypt. Slug musi zgadzać się z `id`
 * w `certificates` w `src/content/site.ts`.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** Ścieżki względem tego pliku, żeby skrypt działał po sklonowaniu repozytorium. */
const ZRODLO = path.resolve(import.meta.dirname, "../../media/Certyfikaty");
const CEL = path.resolve(import.meta.dirname, "../public/certyfikaty");

/** Dłuższy bok pliku wynikowego. Resztę załatwia optymalizator Next.js. */
const SZEROKOSC = 1400;

/**
 * OBRÓT JEST RÓŻNY DLA RÓŻNYCH SKANÓW i trzeba go sprawdzić okiem.
 *
 * Większość PDF-ów ma tekst biegnący od dołu do góry, więc prostuje je obrót
 * w prawo o 90 stopni. Skan masażu tkanek głębokich przyszedł już prosty
 * i obrót by go przewrócił, dlatego ma zero.
 *
 * Po wyprostowaniu wszystkie certyfikaty są POZIOME, mimo że kadr skanu
 * jest pionowy (A4). To ma znaczenie dla proporcji kafla na stronie.
 */
const OBROTY = {
  "masaz-tkanek-glebokich": 0,
};
const OBROT_DOMYSLNY = 90;

/**
 * Nazwa pliku PDF → slug używany na stronie.
 *
 * Mapa jest jawna, a nie liczona z nazwy pliku: nazwy skanów są robocze
 * („Igły moduł 2.pdf"), bywają ze spacją na końcu i nie nadają się na adresy.
 */
const SLUGI = {
  "Diagnostyka.pdf": "diagnostyka",
  "Igły moduł 2.pdf": "igloterapia-modul-2",
  "Igły poziom 1.pdf": "igloterapia-poziom-1",
  "Indiba initial.pdf": "indiba-initial",
  "Indiba lvl 1.pdf": "indiba-poziom-1",
  "Indiba sport.pdf": "indiba-sport",
  "Instruktor trójboju.pdf": "instruktor-trojboju",
  "Masaż tkanek głębokich .pdf": "masaz-tkanek-glebokich",
  "Suplementacja.pdf": "suplementacja",
  "Trener personalny.pdf": "trener-personalny",
};

/** Zwraca surowy strumień JPEG wklejony w PDF albo `null`, gdy go tam nie ma. */
function jpegZPdf(buf) {
  const start = buf.indexOf(Buffer.from([0xff, 0xd8, 0xff]));
  if (start === -1) return null;
  const end = buf.lastIndexOf(Buffer.from([0xff, 0xd9]));
  if (end === -1 || end <= start) return null;
  return buf.subarray(start, end + 2);
}

fs.mkdirSync(CEL, { recursive: true });

const wyniki = [];
let bledy = 0;

for (const plik of fs.readdirSync(ZRODLO).filter((f) => f.toLowerCase().endsWith(".pdf"))) {
  const slug = SLUGI[plik];
  if (!slug) {
    console.warn("POMINIĘTO, brak wpisu w SLUGI:", plik);
    bledy++;
    continue;
  }

  const jpeg = jpegZPdf(fs.readFileSync(path.join(ZRODLO, plik)));
  if (!jpeg) {
    console.error("BŁĄD, nie znaleziono strumienia JPEG:", plik);
    bledy++;
    continue;
  }

  const docelowy = path.join(CEL, `${slug}.jpg`);
  const info = await sharp(jpeg)
    .rotate(OBROTY[slug] ?? OBROT_DOMYSLNY)
    .resize({ width: SZEROKOSC, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(docelowy);

  wyniki.push({
    slug,
    px: `${info.width}×${info.height}`,
    kB: Math.round(fs.statSync(docelowy).size / 1024),
  });
}

console.table(wyniki);
console.log(
  `Razem ${wyniki.reduce((s, w) => s + w.kB, 0)} kB w ${wyniki.length} plikach.`
);
if (bledy) {
  console.error(`\nNie udało się przetworzyć ${bledy} plików.`);
  process.exit(1);
}
