# Insulink Website

Static project homepage for **Insulink** — a fully open-source glucose ecosystem
(app, panel, API, predictor). Supports Dexcom G7 and FreeStyle Libre 3 sensors,
the Omnipod DASH pump and Google Fitbit Air. Bilingual (DE/EN) with dark/light mode.

> ⚠️ Insulink is an open-source interoperability project, **not a medical device**,
> used at your own risk, and is not affiliated with or endorsed by the device manufacturers.

## Structure

```
index.html          Landing page (all sections, bilingual)
imprint.html        Imprint (legal text — English)
privacy.html        Privacy policy (legal text — English)
CNAME               insulink.de
assets/css/style.css
assets/js/i18n.js   DE/EN dictionary
assets/js/main.js   theme, language, screens strip, data flow, scroll reveal
assets/img/         logo + icon (from the app, downscaled), social.jpg (link preview)
assets/fonts/       Phosphor icon subset (sun and moon on the legal pages)
design/website/     the redesign: WEBSITE.md, target images, reference HTML
robots.txt, sitemap.xml
```

No build step. Pure HTML/CSS/JS; Atkinson Hyperlegible Next via Google Fonts.
Every colour is a token at the top of `style.css` (dark and light, taken from the
app's `insulink_colors.dart`); components only use `var(--…)`.

### Screens

The "Screens" strip shows the app's own screenshots, which the app's CI takes
from its demo on every push to `main` and publishes next to the web demo
(`insulink-app/docs/SCREENSHOTS.md`):
`https://insulink-app.github.io/insulink-app/screenshots/<lang>-<theme>/<name>.png`.
`main.js` (`syncScreens`) picks the folder for the page's language and theme. To
show another screen, add a `<figure>` with its `data-shot` name to `index.html`
and its `screens.<name>.title` / `.text` to `i18n.js`; the name must be one the
app's screenshot test takes.

### Icons

The icons are a 2 KB subset of Phosphor Regular 2.1.1, not the full font from a
CDN. To use a new one, add its `.ph-name::before` codepoint to `style.css` (look
it up in Phosphor's `src/regular/style.css`) and regenerate the subset with every
codepoint listed there:

```bash
curl -sO https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/Phosphor.ttf
uvx --from 'fonttools[woff]' pyftsubset Phosphor.ttf --flavor=woff2 \
  --layout-features='' --no-hinting --output-file=assets/fonts/phosphor-subset.woff2 \
  --unicodes="U+E0F2,U+E138,U+E13A,U+E156,U+E1BC,U+E1DE,U+E2DC,U+E2F0,U+E330,U+E000,U+E412,U+E428,U+E464,U+E472,U+E4F6"
```

The live app demo in the hero is not part of this repo: the app's CI builds it on
every push to its `main` and publishes it to https://insulink-app.github.io/insulink-app/,
which the hero loads in an iframe (see `insulink-app/docs/WEB_DEMO.md`).

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deployment

Served by **GitHub Pages** from `main` (native `pages-build-deployment`, no
workflow file). `.nojekyll` disables Jekyll; `CNAME` binds `insulink.de`.

- Header **Login** → `https://panel.insulink.de`
- Language: remembered in `localStorage` (`insulink-lang`), defaults to the browser locale.
- Theme: remembered in `localStorage` (`insulink-theme`), defaults to the OS preference.
