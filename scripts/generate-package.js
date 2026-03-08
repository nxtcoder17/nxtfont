#!/usr/bin/env node
// generate-package.js — Generates package.json and nxtfont.css
//
// Environment variables:
//   PACKAGE_NAME    — npm package name (e.g. @nxtcoder17/nxtfont)
//   PACKAGE_VERSION — semver version (e.g. 1.0.1)
//   REPO_URL        — github repo URL (e.g. https://github.com/nxtcoder17/nxtfont)

const fs = require("fs");

const PACKAGE_NAME = process.env.PACKAGE_NAME;
const PACKAGE_VERSION = process.env.PACKAGE_VERSION;
const REPO_URL = process.env.REPO_URL || "https://github.com/nxtcoder17/nxtfont";

if (!PACKAGE_NAME || !PACKAGE_VERSION) {
  console.error("ERROR: PACKAGE_NAME and PACKAGE_VERSION env vars are required");
  process.exit(1);
}

// --- Font config ---

const weights = [
  { name: "Regular", weight: 400 },
  { name: "Medium", weight: 500 },
  { name: "SemiBold", weight: 600 },
  { name: "Bold", weight: 700 },
  { name: "ExtraBold", weight: 800 },
];

const subsets = [
  {
    name: "latin",
    range: "U+0000-00FF",
  },
  {
    name: "latin-ext",
    range: "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
  },
  {
    name: "symbols",
    range: "U+2000-206F, U+2190-21FF, U+2200-22FF, U+2300-23FF, U+2500-257F, U+25A0-25FF, U+2600-26FF, U+FE00-FE0F, U+FE20-FE2F",
  },
];

// --- Helpers ---

function italicSuffix(weightName) {
  return weightName === "Regular" ? "Italic" : weightName + "Italic";
}

function fontFace({ src, weight, style, unicodeRange }) {
  let block = `@font-face {\n`;
  block += `  font-family: "NxtFont";\n`;
  block += `  src: url("${src}") format("woff2");\n`;
  block += `  font-weight: ${weight};\n`;
  block += `  font-style: ${style};\n`;
  block += `  font-display: swap;\n`;
  if (unicodeRange) {
    block += `  unicode-range: ${unicodeRange};\n`;
  }
  block += `}\n`;
  return block;
}

// --- Generate package.json ---

const pkg = {
  name: PACKAGE_NAME,
  version: PACKAGE_VERSION,
  description: "NxtFont - A custom Iosevka build",
  keywords: ["font", "iosevka", "monospace", "webfont"],
  author: "nxtcoder17",
  license: "OFL-1.1",
  repository: {
    type: "git",
    url: REPO_URL,
  },
  files: ["WOFF2/**/*", "nxtfont.css"],
};

fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
console.log("wrote package.json");

// --- Generate nxtfont.css (unicode-range subsets) ---

const header = `/* NxtFont - Custom Iosevka Build */\n/* ${REPO_URL} */\n\n`;

let css = header;
for (const w of weights) {
  for (const style of ["normal", "italic"]) {
    const suffix = style === "normal" ? w.name : italicSuffix(w.name);

    for (const sub of subsets) {
      css += `/* ${w.name} ${style} — ${sub.name} */\n`;
      css += fontFace({
        src: `./WOFF2/NxtFont-${suffix}.${sub.name}.woff2`,
        weight: w.weight,
        style,
        unicodeRange: sub.range,
      });
      css += "\n";
    }
  }
}

fs.writeFileSync("nxtfont.css", css);
console.log("wrote nxtfont.css");
