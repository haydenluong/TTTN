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

All images in `assets/img/` (create the directory when adding the first image). CSS uses `../assets/img/`, HTML uses `assets/img/`.
