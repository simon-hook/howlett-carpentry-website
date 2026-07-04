# Howlett Carpentry & Joinery Website

A one-page site for Howlett Carpentry & Joinery, built with plain HTML, CSS and JavaScript (no build step, no dependencies).

## Running locally

Just open `index.html` in a browser, or serve it locally:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Placeholder content

All business details (phone, email, address, hours, testimonials, about text, services) are **dummy placeholders** marked with `[Placeholder]`. Search the codebase for `[Placeholder]` and replace with real content before going live.

The gallery's first three tiles are real before/after projects with a drag-to-compare slider — **don't remove those** (each is a `<div class="gallery-item ba-slider" data-ba-slider>` wired to `js/main.js`). To add another project, copy one of those blocks and swap the two image paths, the alt text, the `data-project` name, and the expand button's `aria-label` (it names the project too). The remaining `.gallery-item g4`–`g6` divs are colored placeholders to replace the same way.

## Structure

- `index.html` — page markup/content
- `css/style.css` — all styling
- `js/main.js` — preloader, count-up stats, scrollspy nav, mobile nav, scroll animations, before/after sliders, lightbox, contact form handling

The "Areas We Cover" section (`#areas`) uses a hand-built SVG coverage map (Carterton centred, ~15-mile radius) plus a chip list of towns — no third-party map service, no API key. To change the coverage, edit the town `<circle>`/`<text>` pairs in the SVG and the `.area-chip` list in `index.html`.

**Cache busting:** the CSS/JS links in `index.html` carry a `?v=N` query string. Bump `N` on both links any time you edit `css/style.css` or `js/main.js`, or returning visitors may keep using the old cached version.

## Deploying

Pushes to `main` (or the current feature branch) deploy automatically to GitHub Pages via `.github/workflows/pages.yml`.
