#!/usr/bin/env node
/**
 * Fetch real product photography for the Culverin shop.
 *
 *   node scripts/fetch-images.mjs --dry-run     preview matches, download nothing
 *   node scripts/fetch-images.mjs               download and rewrite the catalog
 *   node scripts/fetch-images.mjs --only=phones limit to one category
 *   node scripts/fetch-images.mjs --revert      restore the generated SVG artwork
 *
 * Wikimedia Commons needs no key. Unsplash needs a free access key:
 *   https://unsplash.com/developers  ->  create an app  ->  copy "Access Key"
 *
 *   PowerShell:  $env:UNSPLASH_ACCESS_KEY="your_key"; node scripts/fetch-images.mjs
 *   bash:        UNSPLASH_ACCESS_KEY=your_key node scripts/fetch-images.mjs
 *
 * Without a key the Unsplash-backed products keep their existing artwork; the
 * Wikimedia half still runs.
 */

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCES, CATEGORY_SOURCES } from "./image-sources.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "images", "products");
const CATALOG = path.join(ROOT, "lib", "catalog.ts");
const CREDITS = path.join(ROOT, "lib", "image-credits.ts");
const BACKUP = path.join(ROOT, "lib", ".image-backup.json");

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const REVERT = args.includes("--revert");
const ONLY = (args.find((a) => a.startsWith("--only=")) || "").split("=")[1];
const KEY = process.env.UNSPLASH_ACCESS_KEY || "";

const UA = "CulverinQuantumShop/1.0 (https://culverinquantum.com; contact@culverinquantum.com)";
const WIDTH = 1000;

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/* ------------------------------------------------------------------ *
 * Providers
 * ------------------------------------------------------------------ */

const BAD_FILE = /(logo|icon|svg|diagram|chart|map|screenshot|box only|packaging)/i;

async function searchWikimedia(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `${query} filetype:bitmap`,
      gsrnamespace: "6",
      gsrlimit: "12",
      prop: "imageinfo",
      iiprop: "url|extmetadata|size|mime",
      iiurlwidth: String(WIDTH),
      format: "json",
      origin: "*",
    });

  const data = await getJSON(url);
  const pages = Object.values(data?.query?.pages || {});
  if (!pages.length) return null;

  const scored = pages
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info || !info.thumburl) return null;
      if (!/^image\/(jpeg|png|webp)$/.test(info.mime || "")) return null;
      if (BAD_FILE.test(p.title)) return null;

      const meta = info.extmetadata || {};
      const w = info.width || 0;
      const h = info.height || 0;
      if (w < 500 || h < 400) return null;

      // Prefer near-square/portrait product shots over wide banners.
      const ratio = w / h;
      let score = 0;
      if (ratio > 0.6 && ratio < 1.6) score += 3;
      if (w >= 1000) score += 1;
      const title = p.title.toLowerCase();
      for (const word of query.toLowerCase().split(/\s+/)) {
        if (title.includes(word)) score += 1;
      }

      return {
        score,
        url: info.thumburl,
        source: info.descriptionurl,
        title: p.title.replace(/^File:/, ""),
        artist: stripTags(meta.Artist?.value) || "Unknown",
        licence: stripTags(meta.LicenseShortName?.value) || "See source",
        provider: "Wikimedia Commons",
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return scored[0] || null;
}

async function searchUnsplash(query) {
  if (!KEY) return null;
  const url =
    "https://api.unsplash.com/search/photos?" +
    new URLSearchParams({
      query,
      per_page: "5",
      orientation: "squarish",
      content_filter: "high",
    });

  const data = await getJSON(url, { Authorization: `Client-ID ${KEY}` });
  const hit = data?.results?.[0];
  if (!hit) return null;

  return {
    url: `${hit.urls.raw}&q=80&w=${WIDTH}&fit=crop&crop=entropy`,
    source: hit.links.html,
    title: hit.description || hit.alt_description || query,
    artist: hit.user?.name || "Unknown",
    artistUrl: hit.user?.links?.html,
    licence: "Unsplash License",
    provider: "Unsplash",
    downloadLocation: hit.links.download_location,
  };
}

function stripTags(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/** Unsplash asks API clients to ping this when an image is actually used. */
async function triggerUnsplashDownload(loc) {
  if (!KEY || !loc) return;
  try {
    await fetch(loc, { headers: { Authorization: `Client-ID ${KEY}`, "User-Agent": UA } });
  } catch {
    /* non-fatal */
  }
}

/* ------------------------------------------------------------------ *
 * Download
 * ------------------------------------------------------------------ */

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const type = res.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`not an image (${type})`);
  await pipeline(res.body, createWriteStream(dest));
  return type.includes("png") ? ".png" : type.includes("webp") ? ".webp" : ".jpg";
}

function extFor(url) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return ".png";
  if (clean.endsWith(".webp")) return ".webp";
  return ".jpg";
}

/* ------------------------------------------------------------------ *
 * Catalog rewriting
 * ------------------------------------------------------------------ */

async function readCatalog() {
  return readFile(CATALOG, "utf8");
}

/** Replace the `image:` line belonging to a given slug. Idempotent. */
function setImage(src, slug, imagePath) {
  const re = new RegExp(
    `(slug: ${JSON.stringify(slug)},[\\s\\S]{0,600}?image: )"(?:[^"\\\\]|\\\\.)*"`,
    "m"
  );
  if (!re.test(src)) {
    console.warn(c.yellow(`   ! could not locate ${slug} in catalog.ts`));
    return src;
  }
  return src.replace(re, `$1${JSON.stringify(imagePath)}`);
}

function setCategoryImage(src, id, imagePath) {
  const re = new RegExp(
    `(id: ${JSON.stringify(id)},[\\s\\S]{0,600}?image: )"(?:[^"\\\\]|\\\\.)*"`,
    "m"
  );
  if (!re.test(src)) return src;
  return src.replace(re, `$1${JSON.stringify(imagePath)}`);
}

/** Current image path for every product slug and category id. */
function snapshotImages(src) {
  const products = {};
  const categories = {};
  const STR = String.raw`"((?:[^"\\]|\\.)*)"`;

  const pRe = new RegExp(
    `slug: ${STR},[\\s\\S]{0,600}?image: ${STR}`,
    "g"
  );
  let m;
  while ((m = pRe.exec(src))) products[m[1]] = m[2];

  const cRe = new RegExp(`id: ${STR},[\\s\\S]{0,600}?image: ${STR}`, "g");
  while ((m = cRe.exec(src))) categories[m[1]] = m[2];

  return { products, categories };
}

function parseCatalog(src) {
  const out = [];
  // Product names legitimately contain escaped quotes (`MacBook Air 13\" M4`),
  // so string bodies must allow backslash escapes — a plain [^"]* silently
  // skips those entries.
  const STR = String.raw`"((?:[^"\\]|\\.)*)"`;
  const re = new RegExp(
    `slug: ${STR},\\s*\\n\\s*name: ${STR},\\s*\\n\\s*brand: ${STR},\\s*\\n\\s*category: ${STR}`,
    "g"
  );
  let m;
  while ((m = re.exec(src))) {
    out.push({
      slug: m[1],
      name: m[2].replace(/\\(.)/g, "$1"),
      brand: m[3],
      category: m[4],
    });
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  let src = await readCatalog();
  const catalogProducts = parseCatalog(src);

  if (!catalogProducts.length) {
    console.error(c.red("Could not parse lib/catalog.ts — aborting."));
    process.exit(1);
  }

  if (REVERT) {
    if (!(await exists(BACKUP))) {
      console.error(
        c.red("No lib/.image-backup.json — nothing to revert to.\n") +
          c.dim("The backup is written the first time you run the fetch.")
      );
      process.exit(1);
    }
    const backup = JSON.parse(await readFile(BACKUP, "utf8"));
    let n = 0;
    for (const [slug, image] of Object.entries(backup.products || {})) {
      src = setImage(src, slug, image);
      n++;
    }
    for (const [id, image] of Object.entries(backup.categories || {})) {
      src = setCategoryImage(src, id, image);
      n++;
    }
    await writeFile(CATALOG, src);
    await writeFile(
      CREDITS,
      `// Generated by scripts/fetch-images.mjs — do not edit by hand.\n\nexport interface ImageCredit {\n  slug: string;\n  name: string;\n  provider: string;\n  title: string;\n  artist: string;\n  licence: string;\n  source: string;\n}\n\nexport const imageCredits: ImageCredit[] = [];\n`
    );
    console.log(c.green(`Reverted ${n} image paths to the original artwork.`));
    return;
  }

  // Snapshot the original paths once, so --revert is always exact.
  if (!(await exists(BACKUP))) {
    await writeFile(BACKUP, JSON.stringify(snapshotImages(src), null, 2));
    if (!DRY) console.log(c.dim("Saved original image paths to lib/.image-backup.json"));
  }

  await mkdir(OUT_DIR, { recursive: true });

  console.log(c.bold("\nCulverin — product image fetch\n"));
  console.log(`  Wikimedia Commons  ${c.green("ready")} (no key needed)`);
  console.log(
    `  Unsplash           ${KEY ? c.green("ready") : c.yellow("no UNSPLASH_ACCESS_KEY — those products keep current artwork")}`
  );
  if (DRY) console.log(c.yellow("\n  DRY RUN — nothing will be written\n"));

  const targets = catalogProducts.filter(
    (p) => (!ONLY || p.category === ONLY) && SOURCES[p.slug]
  );

  const results = new Map();
  const credits = [];
  let ok = 0;
  let viaFallback = 0;
  let kept = 0;

  for (const product of targets) {
    const rule = SOURCES[product.slug];

    // Try the preferred provider, then the other one. Wikimedia needs no key,
    // so an Unsplash-preferred product still gets a real photo without one.
    const attempts = [];
    if (rule.provider === "unsplash") {
      if (KEY) attempts.push(["unsplash", rule.queries]);
      if (rule.wikimediaQueries) attempts.push(["wikimedia", rule.wikimediaQueries]);
    } else {
      attempts.push(["wikimedia", rule.queries]);
      if (KEY && rule.unsplashQueries) attempts.push(["unsplash", rule.unsplashQueries]);
    }

    let hit = null;
    outer: for (const [provider, queries] of attempts) {
      const search = provider === "wikimedia" ? searchWikimedia : searchUnsplash;
      for (const q of queries) {
        try {
          hit = await search(q);
        } catch (err) {
          console.log(c.dim(`   ${product.slug}: "${q}" -> ${err.message}`));
        }
        if (hit) {
          hit.query = q;
          break outer;
        }
        // Be polite to both APIs.
        await sleep(provider === "wikimedia" ? 120 : 250);
      }
    }

    if (!hit && rule.fallback && results.has(rule.fallback)) {
      const borrowed = results.get(rule.fallback);
      results.set(product.slug, borrowed);
      if (!DRY) src = setImage(src, product.slug, borrowed.publicPath);
      viaFallback++;
      console.log(
        `${c.yellow("~")} ${product.name.padEnd(34)} ${c.dim(`borrowed from ${rule.fallback}`)}`
      );
      continue;
    }

    if (!hit) {
      kept++;
      console.log(`${c.dim("·")} ${product.name.padEnd(34)} ${c.dim("no match — keeping current artwork")}`);
      continue;
    }

    const ext = extFor(hit.url);
    const file = `${product.slug}${ext}`;
    const publicPath = `/images/products/${file}`;

    if (DRY) {
      console.log(
        `${c.green("✓")} ${product.name.padEnd(34)} ${c.dim(`${hit.provider}: ${hit.title.slice(0, 46)}`)}`
      );
      results.set(product.slug, { ...hit, publicPath });
      credits.push({ slug: product.slug, name: product.name, ...hit });
      ok++;
      continue;
    }

    try {
      await download(hit.url, path.join(OUT_DIR, file));
      await triggerUnsplashDownload(hit.downloadLocation);
      src = setImage(src, product.slug, publicPath);
      results.set(product.slug, { ...hit, publicPath });
      credits.push({ slug: product.slug, name: product.name, ...hit });
      ok++;
      console.log(
        `${c.green("✓")} ${product.name.padEnd(34)} ${c.dim(`${hit.provider} · ${hit.licence}`)}`
      );
    } catch (err) {
      kept++;
      console.log(`${c.red("✗")} ${product.name.padEnd(34)} ${c.dim(err.message)}`);
    }
  }

  // Category hero tiles
  if (!ONLY) {
    for (const [id, rule] of Object.entries(CATEGORY_SOURCES)) {
      let hit = null;
      const tries = [];
      if (KEY) tries.push(["unsplash", rule.queries]);
      if (rule.wikimediaQueries) tries.push(["wikimedia", rule.wikimediaQueries]);

      catTry: for (const [provider, queries] of tries) {
        const search = provider === "wikimedia" ? searchWikimedia : searchUnsplash;
        for (const q of queries) {
          try {
            hit = await search(q);
          } catch {
            /* ignore */
          }
          if (hit) break catTry;
          await sleep(provider === "wikimedia" ? 120 : 250);
        }
      }
      if (!hit) continue;

      const file = `category-${id}${extFor(hit.url)}`;
      if (DRY) {
        console.log(`${c.green("✓")} ${("category: " + id).padEnd(34)} ${c.dim(hit.provider)}`);
        continue;
      }
      try {
        await download(hit.url, path.join(OUT_DIR, file));
        await triggerUnsplashDownload(hit.downloadLocation);
        src = setCategoryImage(src, id, `/images/products/${file}`);
        credits.push({ slug: `category-${id}`, name: `${id} category`, ...hit });
      } catch {
        /* keep existing */
      }
    }
  }

  if (!DRY) {
    await writeFile(CATALOG, src);
    await writeFile(
      CREDITS,
      `// Generated by scripts/fetch-images.mjs — do not edit by hand.
// Attribution for product photography. Wikimedia images are CC-licensed and
// legally require credit; Unsplash does not require it but asks for it.

export interface ImageCredit {
  slug: string;
  name: string;
  provider: string;
  title: string;
  artist: string;
  licence: string;
  source: string;
}

export const imageCredits: ImageCredit[] = ${JSON.stringify(
        credits.map((x) => ({
          slug: x.slug,
          name: x.name,
          provider: x.provider,
          title: x.title,
          artist: x.artist,
          licence: x.licence,
          source: x.source,
        })),
        null,
        2
      )};
`
    );
  }

  console.log(
    `\n${c.bold("Done.")} ${c.green(`${ok} fetched`)}, ${c.yellow(`${viaFallback} borrowed`)}, ${c.dim(`${kept} unchanged`)}` +
      (DRY ? c.yellow("  (dry run — nothing written)") : "")
  );
  if (!DRY && ok) {
    console.log(c.dim("Credits written to lib/image-credits.ts — shown at /credits\n"));
  }
}

main().catch((err) => {
  console.error(c.red(`\nFailed: ${err.stack || err.message}`));
  process.exit(1);
});
