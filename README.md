## nxt font

A simple iosevka build with my customisations, so that i could use my custom font everywhere, without specifying all the font-features, and ligature stuffs

<img width="1945" height="1169" alt="screenshot-18549" src="https://github.com/user-attachments/assets/4e9c9f4a-9b9e-4836-9439-0f3a0829f201" />

### Web Usage

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@nxtcoder17/nxtfont@latest/nxtfont.css">
```

Or in CSS:
```css
@import url('https://cdn.jsdelivr.net/npm/@nxtcoder17/nxtfont@latest/nxtfont.css');
```

Then use:
```css
body { font-family: 'NxtFont', monospace; }
```

**Available weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold) - each with italic variants.

### Web build

The npm package ships `unicode-range` subsets (latin, latin-ext, symbols) instead of full fonts, so a browser only downloads the slice of the charset a page actually uses. Web subsets are also compiled with a restricted OpenType feature set - `calt`, `ccmp`, `clig`, `dnom`, `frac`, `kern`, `liga`, `locl`, `numr`, `zero` - rather than every feature in the font. OpenType features carry the glyphs they substitute, so retaining Iosevka's `cv01`-`cv69` and `ss01`-`ss20` alternates dragged the entire 3,245-glyph charset, CJK included, into every subset: a "latin" file weighed 77 KB with ~80% of it unreachable. Restricting the feature set brings a latin face down to ~19 KB, four times smaller, while keeping code ligatures and the custom glyph choices - those are baked in as defaults by `private-build-plans.toml`, not selected through features, so they survive the cut. The terminal/desktop builds keep every feature, since that is where stylistic sets are actually switched on.

### Desktop

Download TTF/OTF from [Releases](https://github.com/nxtcoder17/nxtfont/releases).
