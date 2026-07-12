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
assets/img/         logo + icon (from the app)
```

No build step. Pure HTML/CSS/JS; fonts via Google Fonts.

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
