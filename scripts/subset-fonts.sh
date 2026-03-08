#!/usr/bin/env bash
# subset-fonts.sh — Generate unicode-range subsets for NxtFont woff2 files
# Requires: pyftsubset from fonttools (pip install fonttools[woff])
#
# Usage: ./scripts/subset-fonts.sh <WOFF2_DIR>
#   WOFF2_DIR: directory containing NxtFont-*.woff2 files
#   Output:    WOFF2_DIR/subsets/NxtFont-<Weight>.<subset>.woff2

set -euo pipefail

WOFF2_DIR="${1:?Usage: $0 <WOFF2_DIR>}"

# --- Subset definitions (unicode ranges) ---
# Each entry: NAME="U+range,U+range,..."
# These mirror Google Fonts' typical splits.

LATIN="U+0000-00FF"

LATIN_EXT="U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"

SYMBOLS="U+2000-206F,U+2190-21FF,U+2200-22FF,U+2300-23FF,U+2500-257F,U+25A0-25FF,U+2600-26FF,U+FE00-FE0F,U+FE20-FE2F"

declare -A SUBSETS=(
  ["latin"]="$LATIN"
  ["latin-ext"]="$LATIN_EXT"
  ["symbols"]="$SYMBOLS"
)

# --- Main ---

SUBSET_DIR="${WOFF2_DIR}/subsets"
mkdir -p "$SUBSET_DIR"

shopt -s nullglob
WOFF2_FILES=("${WOFF2_DIR}"/NxtFont-*.woff2)

if [ ${#WOFF2_FILES[@]} -eq 0 ]; then
  echo "ERROR: No NxtFont-*.woff2 files found in ${WOFF2_DIR}" >&2
  exit 1
fi

echo "Found ${#WOFF2_FILES[@]} font files to subset"

for font_file in "${WOFF2_FILES[@]}"; do
  basename=$(basename "$font_file" .woff2)

  for subset_name in "${!SUBSETS[@]}"; do
    unicodes="${SUBSETS[$subset_name]}"
    out_file="${SUBSET_DIR}/${basename}.${subset_name}.woff2"

    echo "  ${basename} → ${subset_name}"
    pyftsubset "$font_file" \
      --output-file="$out_file" \
      --flavor=woff2 \
      --unicodes="$unicodes" \
      --layout-features='*' \
      --no-hinting \
      --desubroutinize
  done
done

echo "Done. Subsets written to ${SUBSET_DIR}/"
