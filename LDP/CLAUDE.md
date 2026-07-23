# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page HTML landing page for a Vietnamese mobile game event (Miss & Mister Hào Khí Du Hiệp). The task is to replicate Figma designs in HTML + Bootstrap 5, with plain CSS fallback only where Bootstrap cannot do it.

There are no build tools, bundlers, or package managers — open `index.html` directly in a browser to preview.

Figma reference screenshots are in `references/`. The MCP Figma connection provides live design data.

## Stack

- **Bootstrap 5.3.3** (CDN) — use utility classes for layout, spacing, flex, grid
- **Bootstrap Icons 1.11.3** (CDN)
- **Montserrat** (Google Fonts)
- `css/style.css` — custom CSS only for what Bootstrap cannot do
- `js/main.js` — minimal vanilla JS

## CSS conventions

- Layout, spacing, flex, grid → Bootstrap classes in HTML
- Custom CSS only for: background images, clip-paths, pseudo-elements, themed colors, image-based UI chrome
- Comment Figma color values inline: `/* Figma: r:0.541 g:0 b:0.561 */`
- Comment pixel dimensions when they inform `%`-based sizing: `/* 750×469 px in Figma at 1920 px */`
- Image-based UI elements (buttons, fields, frames) use `background-image` with `background-size: 100% 100%` and `aspect-ratio` from Figma measurements
- Responsive breakpoints follow Bootstrap's (1199, 991, 767, 480 px)

## Color palette

| Role | Value |
|------|-------|
| Header bg | `#8A008F` |
| Page bg | `#0b0620` |
| Highlight / gold | `#FFE779` |
| Radio selected | `#1F46B4` |
| Neon border | `#35e6e0` |

## Asset paths

All images live in `assets/img/`. Reference the CSS convention: CSS uses `../assets/img/`, HTML uses `assets/img/`.
