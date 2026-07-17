# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page HTML landing page for a Vietnamese mobile game event (voting page). Replicating Figma designs in HTML + Bootstrap 5, with plain CSS only where Bootstrap cannot do it.

No build tools — open `index.html` directly in a browser to preview.

Figma designs represent different UI states of the same page (default view, modals, interactions). When given Figma data (via MCP tool or screenshots), the goal is pixel-faithful HTML replication — match dimensions, colors, fonts, and spacing from the design.

## Stack

- **Bootstrap 5.3.3** (CDN)
- **Bootstrap Icons 1.11.3** (CDN)
- **Montserrat** (Google Fonts)
- `css/style.css` — custom CSS only for what Bootstrap cannot do
- `js/main.js` — vanilla JS for interactions (Bootstrap modal triggers, tab switching, vote submission UX)

## CSS conventions

- Layout, spacing, flex, grid → Bootstrap classes in HTML
- Custom CSS only for: background images, clip-paths, pseudo-elements, themed colors, image-based UI chrome
- Comment Figma color values inline: `/* Figma: r:0.541 g:0 b:0.561 */`
- Comment pixel dimensions when they inform `%`-based sizing
- Image-based UI elements use `background-image` with `background-size: 100% 100%` and `aspect-ratio` from Figma
- Responsive breakpoints follow Bootstrap's (1199, 991, 767, 480 px)

## Asset paths

All images in `assets/img/`. CSS uses `../assets/img/`, HTML uses `assets/img/`.

## Page sections

`index.html` is one scroll page with four sections (in order):
1. **Hero** — background image + vote-now button
2. **`#danh-sach`** — candidate cards grid (3-col), filter bar, pagination
3. **`#tich-luy`** — milestone progress bar + 4 gift boxes with NHẬN buttons
4. **`#bxh`** — leaderboard with 3 sub-tabs (Mỹ Nhân / Mỹ Nam / Phú Giáp)

The **NẠP HOA** tab in the nav links to `#nap-hoa` but that section does not exist in the HTML yet.

## Modals

Five Bootstrap modals, triggered from the nav or card clicks:

| ID | Trigger | Notes |
|---|---|---|
| `#modal-huong-dan` | HƯỚNG DẪN tab | Image-only popup |
| `#modal-hoa-free` | HOA FREE tab | 5 rows absolutely positioned over bg image |
| `#modal-profile` | Any `.candidate-card` click | Vote stepper + success overlay |
| `#modal-ls` | `.pp-btn-ls` inside profile modal | Must close profile first — see JS pattern below |
| `#modal-nhan-code` | `.btn-nhan` in tích lũy section | Shows gift code + clipboard copy |

**JS modal chaining pattern** (`js/main.js`): opening `#modal-ls` from inside `#modal-profile` requires hiding the profile modal first and listening for `hidden.bs.modal` with `{ once: true }` before showing the LS modal. Do not change this to a direct `.show()` — Bootstrap modals cannot stack without custom config.

## Figma MCP

`.mcp.json` wires up `figma-developer-mcp`. Use `mcp__figma__get_figma_data` to pull node measurements and colors, and `mcp__figma__download_figma_images` to export specific nodes as images. The API key is already configured.

## Overlays inside #modal-profile

Two overlays live **inside** `#modal-profile` and are toggled with `element.style.display`, not Bootstrap modals:

- `#pp-success` (`.pp-success-overlay`) — success confirmation after clicking TẶNG HOA
- `.pp-history-overlay` — donation history table rendered over the profile popup

The standalone `#modal-ls` (Bootstrap modal, `modal-ls-dialog`) is a separate route to the same history content, opened via the JS chaining pattern described above.

## Known broken assets

- `index.html` line 499 (inside `#modal-ls`): `src="TN/buttonlstang.png"` — path does not exist; correct asset should be in `assets/img/`.
- `css/style.css` line 1335 (`.pls-table tbody tr`): `url('../TN/box.png')` — same issue; correct asset should be `../assets/img/box-item.png` or equivalent.
