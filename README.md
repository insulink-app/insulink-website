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
assets/js/main.js   theme, language, nav, scroll reveal
assets/img/         logo + icon (from the app, downscaled), social.jpg (link preview)
assets/fonts/       Phosphor icon subset (only the glyphs the site uses)
assets/gallery/     app screenshots (WebP) for the gallery
robots.txt, sitemap.xml
```

No build step. Pure HTML/CSS/JS; text fonts via Google Fonts.

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
