# LEARNING.md — Hexagon: Puck Editor + Multilingual Page Manager

- useRef & hooks

Live checklist. Items are checked off only after you've demonstrated understanding (restated in your own words, or answered correctly in a quiz) — not just after I've explained them.

## 1. The Problem

- [ ] Why does the site need to become "Puck-editable" instead of staying static React — what capability does that unlock, and for whom?
- [ ] Why does the multilingual system store *separate saved pages per language* instead of live-translating text? What breaks if we did live translation instead?
- [x] Why do we inspect `Doanhnhandongthap`/`Metik` before writing any Puck code, instead of designing our own config shape from scratch? — **Understood:** consistency across the 3 sites, *and* inheriting already-debugged patterns (e.g. `PuckNumberFieldOverride` exists because Puck's built-in number field has a real backspace-to-zero bug — designing fresh would've hit that blind).

## 2. The Solution — Architecture Decisions

- [ ] The two-file-per-block convention (`blocks/<Name>/<Name>.jsx` vs `puck.config.jsx`) — why keep presentational code and editor wiring in separate files?
- [x] The shared `type: "custom"` field pattern (`{ value, onChange }`) and the field-definition/converter-function split — **Understood:** reuse (e.g. `cornerRadiusToCss` shared by `cardStyle.jsx` and `buttonStyle.jsx`) *and* decoupling (block components call plain converters, never import `@puckeditor/core` — same component renders identically under `<Puck>` or `<Render>`).
- [x] **Decided:** background system — adopt the reference projects' `color/gradient-image/gradient-color/image/gif` system as-is. Reason: it already handles photo+gradient(+flat-color-multiply) layering that several existing Hexagon sections need; the CLAUDE.md's literal 5-mode spec has no equivalent for that.
- [x] **Decided:** button fields — extend the reference's `label/bgColor/textColor/borderRadius/fontSize` with just `href` added (Hexagon's real buttons link to routes like `/gioi-thieu`, not just scroll-to-section). Skipping `variant`/`borderColor`/`hover` — nothing in the current site design uses them, so building them now means inventing defaults with no real reference.
- [x] **Decided:** animation — building `animate: true|false` fresh (neither reference project has it as a field). `animate:false` keeps the same reveal system and end state, just zeroes the transition duration — never skips applying the "revealed" class, so a component pre-styled at `opacity:0` doesn't get stuck invisible.
- [ ] The multilingual page data model (`PageData` with `lang`/`translationOf`/`status`) — how it layers on top of the existing per-page `localStorage` pattern instead of replacing it (all PageManager pages live in ONE `hexagon-pages` array/key, unlike the legacy one-key-per-page pattern).
- [ ] `findTranslatedPage` matching logic and the VI/EN header toggle — how it finds the sibling-language page via `translationOf`, why the lookup is asymmetric (original vs. translation), and what happens when a translation doesn't exist yet (stay put, don't crash). Includes the `publishedOnly` option — the public toggle must never route a visitor to a draft.
- [ ] The `duplicateToOtherLanguage` helper — why it clones content but never translates it, why it resets `status` to `draft`, and why it must generate a *unique slug* (route collision) and a fresh random id (id collision).
- [ ] Seed data (`seedPages.js`) — why seeding only happens when the localStorage key is `null` (never written), not when it's an empty array (admin deleted everything on purpose). And why `getSeedPages()` is a lazy function instead of a top-level const (circular import: puck.config → Header → usePageManager → seedPages → puck.config would hit a TDZ error).
- [ ] `usePageManager()` hook — the single-drawer storage layer: `useState(loadPages)` reads once, `useEffect` auto-syncs every change back to localStorage; all mutations (`addPage`/`updatePage`/`deletePage`/`duplicatePage`) go through it.
- [ ] The admin surface: `PageManager.jsx` (table + filters at `/admin/pages`), `PageEditor.jsx` (Puck + metadata strip at `/admin/pages/:id/edit`), `PublicPageView.jsx` (catch-all `/:slug` route that renders only *published* pages).

## 3. The Broader Context

- [ ] Why does it matter that Doanhnhandongthap is the "gold standard" and Metik defers to it, rather than treating both as equally authoritative?
- [ ] What breaks for the admin (her future self, or another editor) if the Page Management screen doesn't exist — why is it worth building versus just editing localStorage/JSON by hand?
- [ ] What's the actual cost of getting the background/button/animation field shape wrong now, versus fixing it later once components are built on top of it?

---

*Scope decision (2026-07-07): the multilingual system is wired for **PageManager-created pages only**. Legacy static pages (4 service pages, 5 news articles, home) still use the old one-key-per-page localStorage pattern and their header toggle is cosmetic-only. Migrating them into the `PageData` system is a known, deliberately deferred task.*

*Bug log worth remembering: (1) `if (!page.translationOf === null)` — precedence bug, guard never fired; (2) `findTranslatedPage` EN→VI direction could never find the original because the original's own `translationOf` is `null` — fixed by checking the original itself first; (3) top-level `getSeedPages` const hit a circular-import TDZ crash.*

*Housekeeping note: found a real syntax bug in `Doanhnhandongthap/src/blocks/shared/fieldStyles.jsx:13` (`width: "100%",/usa` — breaks `vite build`). Metik's copy of the same file is clean, so we'll use Metik's version as the copy source. Not fixing Doanhnhandongthap itself unless asked.*
