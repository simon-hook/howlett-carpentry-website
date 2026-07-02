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

The gallery section uses colored placeholder tiles instead of real photos — swap `.gallery-item` divs in `index.html` for real `<img>` project photos when available.

## Structure

- `index.html` — page markup/content
- `css/style.css` — all styling
- `js/main.js` — mobile nav, scroll animations, contact form handling

## Deploying

This is a static site, so it can be hosted for free on services like Netlify, Vercel, GitHub Pages, or Cloudflare Pages — just point them at this repo.
