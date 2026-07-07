# CLAUDE.md — Hexagon Website + Puck Editor + Multilingual Page Manager

You are working inside my existing React/Vite/Tailwind/Puck project. Please inspect the full codebase first before editing anything. Make changes carefully, keep the structure clean, and do not overengineer.

The project/folder name should be:

```txt
Hexagon
```

---

## Commands

Run from inside `Hexagon/`:

```bash
npm install
npm run dev      # vite dev server
npm run build    # vite build
npm run lint     # oxlint
npm run preview  # vite preview
```

No test runner is configured. `Doanhnhandongthap/` and `Metik/` are sibling projects one level up (`../Doanhnhandongthap`, `../Metik`) — see "Puck Editing Page" below for why they matter here; there is no shared root build, so commands must always be run from inside `Hexagon/`.

## Current implementation state (read before assuming the spec below is done)

Everything under "Main Goal" onward in this file is the **target spec**, not a description of what exists yet. As of the last update, only a fraction of it is built:

- **Ported to Puck so far:** `Hero` and `About` (`src/blocks/Hero/Hero.jsx`, `src/blocks/About/About.jsx`, registered in `src/puck.config.jsx`). `About`'s `defaultProps` still has a `TODO(em)` — it hasn't been backfilled from the legacy static content yet.
- **Still static legacy React (not Puck-editable yet):** `src/components/{Header,About,Services,News,Partners,Contact,Footer,ScrollToTopButton}.jsx`. Note `src/components/About.jsx` (legacy) and `src/blocks/About/About.jsx` (Puck block) currently coexist — the legacy one is the port source, not dead code, until every section is migrated.
- **Multilingual system (built 2026-07):** `src/data/pageModel.js` (PageData shape, `findTranslatedPage`, `duplicateToOtherLanguage` with slug/id collision handling), `src/hooks/usePageManager.js` (all pages in ONE localStorage key `hexagon-pages`, seeds from `src/data/seedPages.js` only when the key was never written), `src/pages/PageManager.jsx` (`/admin/pages` table+filters), `src/pages/PageEditor.jsx` (`/admin/pages/:id/edit`, Puck + metadata strip), `src/pages/PublicPageView.jsx` (catch-all `/:slug`, published pages only), and the Header `LangSwitcher` wired to `findTranslatedPage(..., { publishedOnly: true })`. **Site mirroring (not a migration):** every legacy page (home, 4 services, news list, 5 articles) is *mirrored* into the manager as a published VI record via `getSeedPages()` (reading the legacy localStorage keys through `src/data/legacyPageData.js` so prior edits carry over). Legacy routes still render VI exactly as before; EN duplicates render through `PublicPageView`'s `template` switch (`home`/`service`/`article`/`news-list`/`default`). `/` maps to the record with slug `trang-chu` in the Header lookup. Caveat: post-seeding `/editor` edits do NOT sync into the manager's VI copies (seed version bump in `usePageManager` re-merges only missing pages).
- **Routing today** (`src/App.jsx`): just `/` (renders `<Render>` for the Hero/About Puck content, then the remaining sections as static components, all under one shared `Header`/`Footer`) and `/editor` (the `<Puck>` editor for that same single page, `localStorage` key `puck-data-home`).
- Check `LEARNING.md` for the live list of which architecture decisions are confirmed-understood vs. still open — some of the spec's literal field shapes (e.g. the 5-mode background system, button fields) were deliberately adapted rather than implemented verbatim; the "Decided" entries there are the actual source of truth, not the spec text.

## Architecture as built

- Shared Puck field helpers live in `src/blocks/shared/`: `background.jsx` (`backgroundField`/`getBackgroundStyle` — note the real modes are `color`/`gradient-color`/`image`/`gradient-image`/`gif`, not the CLAUDE.md spec's literal `image+gradient`/`image+color` naming), `buttonStyle.jsx`, `cardStyle.jsx`, `cornerRadius.jsx`, `animation.jsx` (`animateField`), `imageUrl.jsx`, `alignment.jsx`, `spacing.jsx`, `titleStyle.jsx`, `titleDivider.jsx`, `statCountUp.jsx`, `useScrollReveal.js`, and `fieldStyles.jsx` (`PuckNumberFieldOverride`, fixing a real Puck bug where the built-in number field jumps to `0` on backspace — wired globally in `App.jsx` via `overrides.fieldTypes.number`).
- `fieldStyles.jsx` was copied from `Metik/`, not `Doanhnhandongthap/` — `Doanhnhandongthap/src/blocks/shared/fieldStyles.jsx` has a real syntax bug (stray `/usa` breaking `vite build`) that Metik's copy doesn't have (see `LEARNING.md` housekeeping note).
- Puck field order convention per component, top to bottom: Content → Buttons → Layout → Colors → Background → Animation (skip whichever don't apply — see the numbered comments inside `puck.config.jsx`'s `Hero`/`About` field blocks for a worked example of which sections get skipped and why).
- `src/puck.config.jsx` exports a single `puckConfig` object (`components`, `categories`) — no TypeScript, plain `.jsx`, matching `Metik/`'s config shape rather than `Doanhnhandongthap/`'s `.tsx` one.

---

## Teaching Mode (read this first — it governs the whole session)

You are also a wise and incredibly effective teacher. Building the project is only half the job; the other half is making sure I (the human — refer to me as "she/her") deeply understand what we built and why. Treat teaching as a first-class deliverable, not an afterthought.

Follow these rules for the entire session:

**Teach incrementally, not all at once.**
- Explain each concept as we reach it, step by step. Never dump all the learning at the end.
- Before moving to the next stage, confirm I have mastered the current one — at both the high level (motivation, why this matters) and the low level (business logic, edge cases, specific code).
- Do not advance if I have not demonstrated understanding of the current stage.

**Keep a running learning doc.**
- Maintain a markdown file (e.g. `LEARNING.md`) with a live checklist of everything I should understand.
- Update it as we go: check items off only after I have demonstrated mastery, not just after you explained them.
- Group items under the three understanding pillars below.

**Make sure I understand all three pillars:**
1. **The problem** — what the problem is, why the problem existed, and the different possible approaches/branches that could solve it.
2. **The solution** — how it was solved, why it was solved that way, the key design decisions, and the edge cases.
3. **The broader context** — why this matters, and what these changes impact (users, maintainability, future features).

For each of these, make sure I understand the **why** (and keep drilling into deeper whys), as well as the **what** and the **how**. Understanding the problem well is imperative — do not rush past it.

**Probe before you explain.**
- Proactively ask me to restate my current understanding *first*, so you can gauge where I'm at.
- Then fill in the gaps from there. I may ask questions, or ask you to "ELI5", "ELI14", or "ELII" (explain like I'm an intern) — adjust depth accordingly.

**Quiz me to verify, don't just assume.**
- Use the `AskUserQuestion` tool to quiz me with open-ended or multiple-choice questions.
- Vary the position of the correct answer between questions (don't always make it option A/first).
- Do not reveal the answer until after I have submitted my response.
- Follow up on wrong or shaky answers until they're solid.

**Use the code as a teaching tool.**
- Show me relevant code, walk me through it, and have me use the debugger or add logging when it would deepen understanding.
- Point at real files/lines in this project, not abstract examples, whenever possible.

**/goal — the exit condition.**
The session does **not** end until you have verified, through my restated explanations and quiz answers, that I understand *every* item on your learning checklist — problem, solution, and broader context, at both high and low levels.

---

## Main Goal

Build a website that matches this reference site as closely as possible:

```txt
https://beta.hexagon.xyz/
```

The site must be editable using Puck Visual Builder and must include an admin **Page Management** screen that manages Vietnamese and English versions of pages.

This is not just a static website. It should work like a small CMS:

```txt
Admin creates/edits pages in Puck
↓
Admin publishes pages
↓
Pages appear in Page Management
↓
Admin can duplicate a VI page into EN or EN into VI
↓
Admin manually edits the duplicated language page
↓
Website visitor uses VI / EN toggle in the header
↓
The website renders the saved page in the selected language
```

## Tech Requirements

Use:

```txt
Vite
React
TailwindCSS
Puck Editor
```

References:

```txt
https://vite.dev/
https://tailwindcss.com/docs/installation/using-vite
https://puckeditor.com/docs/getting-started
```

Install commands if needed:

```bash
npm create vite@latest
npm install tailwindcss @tailwindcss/vite
npm i @puckeditor/core --save
```

## Important Concept

The VI / EN toggle does **not** translate content automatically.

The website should have separate saved page records:

```ts
type Lang = "vi" | "en";
```

Example:

```ts
const viPage = {
  id: "page-1",
  title: "Giới thiệu",
  slug: "gioi-thieu",
  lang: "vi",
  status: "published",
  puckData: {...}
};

const enPage = {
  id: "page-2",
  title: "About",
  slug: "about",
  lang: "en",
  status: "published",
  translationOf: "page-1",
  puckData: {...}
};
```

When the website user clicks `EN`, the app should find and render the English saved version of that same page.

It should **not** translate Vietnamese text into English live.

The English version is created in the admin by duplicating the Vietnamese page, then manually editing the content in Puck.

## Public Website Behavior

### Header Language Toggle

The public website header needs a `VI / EN` toggle.

Behavior:

```txt
Default language: vi
```

If the user is on a Vietnamese page and clicks `EN`:

```txt
Find the matching English page
Navigate to the English route
Render the English page's saved Puck data
```

If the user is on an English page and clicks `VI`:

```txt
Find the matching Vietnamese page
Navigate to the Vietnamese route
Render the Vietnamese page's saved Puck data
```

If the matching language version does not exist:

```txt
Stay on current page OR route to a safe fallback page
Do not crash
```

Recommended route strategy:

```txt
Vietnamese: /slug
English: /en/slug
```

Examples:

```txt
/gioi-thieu
/en/about
```

If the existing project has a routing strategy already, follow that instead, but avoid route collisions between Vietnamese and English pages.

## Admin / Editor Behavior

Create a new admin page for managing pages.

Suggested route:

```txt
/admin/pages
```

or use the existing project's admin route style if it already has one.

This page is where the admin controls all page versions.

## Page Management Screen

Create a page management screen matching the provided screenshot references.

Text should be Vietnamese.

### Header

```txt
Quản lý Pages
Tạo và quản lý các trang với PUCK Visual Builder
```

Top-right button:

```txt
+ Tạo Page Mới
```

### Filters

Add these filters:

```txt
Ngôn ngữ
Trạng thái
Ngày cập nhật
```

Language filter options:

```txt
Tất cả
VI
EN
```

Status filter options:

```txt
Tất cả
Đã xuất bản
Bản nháp
```

Updated date input placeholder:

```txt
dd/mm/yyyy
```

### Table Columns

The table should have these columns:

```txt
TIÊU ĐỀ
SLUG
NGÔN NGỮ
TRẠNG THÁI
CẬP NHẬT
THAO TÁC
```

Each row should show:

```txt
Page title
SEO title/subtitle if available
Slug
Language badge: VI or EN
Status badge: Đã xuất bản or Bản nháp
Updated date
Actions
```

### Row Actions

Each row should have these actions:

```txt
Duplicate / create other language version
Edit
Delete
```

The duplicate action should show tooltip text like:

```txt
Tạo bản dịch EN
```

when the current page is Vietnamese.

And:

```txt
Tạo bản dịch VI
```

when the current page is English.

Important: the duplicate action does not translate text. It only clones the page and switches the `lang`.

## Page Data Model

Use a data structure similar to this:

```ts
type Lang = "vi" | "en";
type PageStatus = "draft" | "published";

type PageData = {
  id: string;
  title: string;
  seoTitle?: string;
  slug: string;
  lang: Lang;
  status: PageStatus;
  updatedAt: string;
  puckData: any;
  translationOf?: string;
};
```

You can add more fields if needed, but keep this basic concept.

## Duplicate Language Version Logic

Implement a helper function that duplicates a page into the other language.

Behavior:

```txt
Input: one PageData record
Output: a new PageData record
```

If source page is `vi`, create `en`.

If source page is `en`, create `vi`.

The duplicated page should:

```txt
copy the same Puck content/layout
copy the same design settings
copy the same components
switch lang to the other language
set status to draft unless the existing project expects otherwise
update updatedAt
link back using translationOf or another clear relationship field
avoid ID collision
avoid route collision
```

Example:

```ts
function duplicateToOtherLanguage(page: PageData): PageData {
  const targetLang = page.lang === "vi" ? "en" : "vi";

  return {
    ...page,
    id: crypto.randomUUID(),
    lang: targetLang,
    status: "draft",
    updatedAt: new Date().toISOString(),
    translationOf: page.translationOf ?? page.id,
  };
}
```

Adjust this to fit the existing project.

## Puck Editor Requirements

Set up Puck so the admin can visually edit page content.

The editor should support:

```txt
Create new page
Edit existing page
Publish page
Save page data
Return to/manage through Page Management
```

When the admin clicks edit from Page Management:

```txt
Open that exact page in Puck
Load its saved puckData
Allow editing
Publish should update the same page record
```

When the admin clicks `+ Tạo Page Mới`:

```txt
Create a new draft page
Open it in Puck editor
Allow title, slug, lang, status, and content editing
```

## Puck Editing Page — Look, Fields, and Field Order

**First, inspect the reference projects.** In the same parent directory as this project there are two existing folders named `Doanhnhandongthap` and `Metik`. Before writing any Puck config or components, open them and study how they set up Puck:

```txt
Look at how they define the Puck config object (components, categories, root config)
Look at how each component declares its `fields` (types, labels, order)
Look at how they build custom fields (background, button, color, select, etc.)
Look at how the editor page/screen is laid out (Puck component, header bar, save/publish buttons, back navigation)
Look at their folder/file naming and import style
```

**Match those two projects' conventions as closely as possible.** Reuse their field patterns, custom field components, config structure, and editor-page layout instead of inventing a new style. This project should feel like it came from the same codebase. Only deviate where this project genuinely needs something they don't have (e.g. the multilingual page fields).

### How the Puck editor page should look

```txt
A top bar / header with:
  - the page title being edited (and its lang badge: VI or EN)
  - a Save Draft button
  - a Publish button
  - a Back / Return to Page Management link
The main Puck <Puck> editor area filling the rest of the screen:
  - left: component list / drawer (draggable components)
  - center: the live canvas/preview of the page
  - right: the fields panel for the selected component (and Root/page fields)
Match the header/toolbar styling used in Doanhnhandongthap and Metik.
```

If those projects wrap `<Puck>` with a custom layout or override the header, follow the same approach here.

### What must be editable

**Page-level fields (Puck "root" / page settings):**

```txt
title
seoTitle (optional)
slug
lang (vi | en)   <-- required for the multilingual system
status (draft | published)
```

**Per-component fields (shown when a component is selected):**

```txt
Content fields (text, headings, body, image URL, card items, etc.) depending on the component
Background (the reusable background system: color / gradient / image / image+gradient / image+color)
Colors (text color, and any other component-relevant colors)
Buttons (label, href, variant, background/text/border color, radius) where the component has buttons
Animation toggle (animate: true | false)
Layout options where relevant (columns, alignment, spacing/padding)
```

### Order of the editable fields in Puck

Keep the field order **consistent across all components** so the editor is predictable. Use this top-to-bottom order in each component's fields panel (skip any that don't apply to a given component):

```txt
1. Content        (text / heading / body / image / card items — the actual content first)
2. Buttons        (button config, if the component has CTAs)
3. Layout         (columns, alignment, spacing/padding)
4. Colors         (text color and other component colors)
5. Background     (the reusable background field: type + its sub-fields)
6. Animation      (animate toggle, last)
```

For the **background field specifically**, order its sub-fields so the mode comes first and only the relevant sub-fields follow:

```txt
1. type (color | gradient | image | image+gradient | image+color)
2. color            (when type includes color)
3. imageUrl         (when type includes image)
4. gradientFrom     (when type includes gradient)
5. gradientTo       (when type includes gradient)
6. gradientDirection(when type includes gradient)
7. overlayColor     (when type is image+color or image+gradient)
8. overlayOpacity   (when type is image+color or image+gradient)
```

If Puck's field API supports conditional/visible fields the way Doanhnhandongthap or Metik do it, follow their pattern so irrelevant sub-fields are hidden based on the selected `type`.

### How the Puck config page should look (`puckConfig.tsx`)

```txt
Export a single typed Puck `Config` object.
Group components into sensible categories in the component drawer
  (e.g. Layout, Content, Media, CTA) — mirror how Doanhnhandongthap/Metik categorize.
Each component entry defines:
  - fields (in the standard order above)
  - defaultProps (good defaults so it looks useful immediately when dragged in)
  - render (the actual React component)
Reuse shared custom fields (background, button, color) from a single fields/ location —
  do not redefine them per component.
Define the page-level fields on the config `root` (title, seoTitle, slug, lang, status).
Keep it typed and free of TypeScript errors.
```

Match the exact export style, naming, and category structure that the two reference projects use.

## Publish Flow

When the admin publishes:

```txt
Save full puckData
Save title
Save slug
Save lang
Save status as published
Save updatedAt
Make it visible on public route
Show/update it in Page Management
```

## Persistence

Use the simplest persistence appropriate for this project.

Acceptable:

```txt
LocalStorage
JSON mock data
Existing backend/API if present
```

If this project is frontend-only, LocalStorage is preferred.

Saved pages should survive refresh.

## The Website Already Exists — Do Not Rebuild It

Important context: the Hexagon website has **already been built** in this project as **static React components** that replicate `https://beta.hexagon.xyz/`. Your job is **not** to recreate the design from scratch.

Instead, your job is to make the existing static site editable through Puck and add the multilingual page-management layer on top of it.

```txt
Inspect the existing static React components first.
Treat the existing design (layout, colors, spacing, typography, sections) as the source of truth.
Do NOT redesign, restyle, or "improve" the existing look.
Do NOT rebuild pages that already exist — reuse what is there.
```

If something in the existing site is broken or blocks Puck integration, fix the minimum necessary and tell me what you changed and why.

## Puck Components — Wrap the Existing Static Components

Turn the existing static React sections into reusable Puck components. Do not write brand-new visual components with a different design; wrap/adapt the ones already in the project.

For each existing static section:

```txt
Identify the section component and the values in it that should be editable
  (text, headings, images, buttons, colors, background, etc.)
Refactor it so those values come in as props instead of being hardcoded
Register it as a Puck component in the config, with fields for those props
Set defaultProps to the current hardcoded values, so dragging it in reproduces
  the existing look exactly
Keep the rendered output visually identical to the current static version
```

At minimum you should end up with Puck components covering the section types already present, likely including:

```txt
Hero sections
Text/content sections
Image sections
Cards
Buttons/CTA sections
Multi-column layouts
Header/navigation-related sections if needed
Footer
Any repeated sections already in the site
```

Each component should have good `defaultProps` (taken from the existing static content) so when dragged into Puck, it already looks like the real site.

## Animation Toggle

Add an editable animation toggle for relevant components/sections.

Example field:

```ts
animate: true | false
```

Behavior:

```txt
If animate is true: use a clean fade-in / slide-up animation
If animate is false: render normally without animation
```

Do not make animations excessive.

## Button Support

Components that need buttons should support configurable buttons.

Button fields should include when relevant:

```txt
label/text
href/link
variant
background color
text color
border color
border radius
hover behavior if simple
```

Example data:

```ts
type ButtonConfig = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline";
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  radius?: number;
};
```

Adjust to existing code style.

## Color Controls

Allow editable colors in Puck fields.

Support:

```txt
Text color
Background color
Gradient colors
Button colors
Card colors
Overlay colors
```

## Reusable Background System

Create a reusable background system. Do not duplicate background code in every component.

The background field must support exactly these background modes:

```ts
export const BACKGROUND_TYPES = [
  { value: "color", label: "Màu sắc" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Hình ảnh" },
  { value: "image+gradient", label: "Hình ảnh & Gradient" },
  { value: "image+color", label: "Hình ảnh & Màu sắc" },
];
```

Behavior:

```txt
color: plain background color
gradient: gradient background only
image: background image only
image+gradient: background image with gradient overlay
image+color: background image with color overlay
```

Gradient directions must be exactly:

```ts
export const GRADIENT_DIRECTIONS = [
  { value: "to right", label: "Trái → Phải" },
  { value: "to left", label: "Phải → Trái" },
  { value: "to bottom", label: "Trên → Dưới" },
  { value: "to bottom right", label: "Góc trên-trái → dưới-phải" },
  { value: "to bottom left", label: "Góc trên-phải → dưới-trái" },
];
```

Suggested type:

```ts
type BackgroundConfig = {
  type: "color" | "gradient" | "image" | "image+gradient" | "image+color";
  color?: string;
  imageUrl?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to right" | "to left" | "to bottom" | "to bottom right" | "to bottom left";
  overlayColor?: string;
  overlayOpacity?: number;
};
```

Create a helper like:

```ts
function getBackgroundStyle(background: BackgroundConfig): React.CSSProperties {
  // convert background config into CSS styles
}
```

Use the helper in components.

## Multilingual Page Input

Each page must have an editable language input:

```ts
lang: "vi" | "en"
```

This language value controls whether the page belongs to Vietnamese or English.

The Page Management screen should show a language badge.

The public site should use `lang` to render the correct page and route.

## Header Language Toggle Matching Logic

Create helper logic like:

```ts
function findTranslatedPage(currentPage: PageData, pages: PageData[], targetLang: Lang): PageData | undefined {
  // Find page connected by translationOf/id relationship
}
```

Suggested matching logic:

```txt
If current page has translationOf, find pages with same translation group
Otherwise find a page where translationOf equals current page id
Also make sure target lang matches
Only use published pages on the public website
```

## Admin Filtering Logic

The Page Management filters should work:

```txt
Filter by language
Filter by status
Filter by updated date
```

The result table should update based on filters.

## Delete Logic

When clicking delete:

```txt
Ask for confirmation
Delete the page
Update the table
Do not crash if deleting a page that has a translation pair
```

## Suggested File Organization

Follow the existing project structure if it already has one.

If not, use something clean like:

```txt
src/
  components/
    Header.tsx
    Footer.tsx
  components/puck/
    HeroSection.tsx
    TextSection.tsx
    CardSection.tsx
    ImageSection.tsx
    ButtonSection.tsx
  editor/
    puckConfig.tsx
    fields/
      backgroundField.tsx
      buttonField.tsx
      colorField.tsx
  pages/
    PageManager.tsx
    PuckPageEditor.tsx
    PublicPageRenderer.tsx
  utils/
    background.ts
    pages.ts
    storage.ts
    routes.ts
  data/
    seedPages.ts
```

But do not force this exact structure if the existing codebase already has a better structure.

## Seed Data

Add sample/default pages so the app is not empty.

Seed at least:

```txt
One Vietnamese published page
One English page copied from it or manually filled
A few pages matching the reference site structure
```

Include sample Puck data so the public website renders immediately.

## What To Check After Implementation

Run checks:

```bash
npm install
npm run dev
npm run build
```

If the project has lint/typecheck scripts, run those too:

```bash
npm run lint
npm run typecheck
```

Fix all errors.

## Acceptance Criteria

The task is complete only when all of these are true:

```txt
App runs without runtime/build errors
The existing static site's design is preserved (not rebuilt or restyled)
Existing static sections are wrapped as reusable Puck components
Wrapped components render visually identical to the original static version
Each wrapped component's defaultProps reproduce the existing content
Puck editor works
Admin can create a page
Admin can edit a page
Admin can publish a page
Admin can delete a page
Admin can duplicate VI → EN
Admin can duplicate EN → VI
Duplicated page keeps the same content/layout/design first
Duplicated page only changes language metadata and route behavior
No automatic translation is done
Each page has lang: vi or en
Page Management screen resembles the provided screenshot
Page Management filters work
Page table shows title, slug, language, status, updated date, actions
Header defaults to VI
Header VI / EN toggle loads the saved page in the selected language
If a matching language page does not exist, the app handles it safely
Background modes work: color, gradient, image, image+gradient, image+color
Gradient directions work: to right, to left, to bottom, to bottom right, to bottom left
Animation toggle works
Button editing works
Color editing works
Saved pages survive refresh if using LocalStorage
Puck editor page layout matches the Doanhnhandongthap / Metik reference projects
Page-level fields are editable in Puck: title, seoTitle, slug, lang, status
Per-component fields follow the standard order: Content, Buttons, Layout, Colors, Background, Animation
Background sub-fields are ordered mode-first and hide irrelevant options based on type
puckConfig groups components into categories with good defaultProps
```

**Teaching acceptance (also required):**

```txt
A LEARNING.md checklist exists and is kept up to date throughout the session
I have restated my understanding of the problem, solution, and broader context in my own words
I have passed quizzes (via AskUserQuestion) on the key concepts, edge cases, and design decisions
Every item on the learning checklist is confirmed mastered before the session ends
```

## Important Reminders

```txt
Do not auto-translate content.
The website is already built as static React components — do not rebuild or redesign it.
Wrap the existing static sections into Puck components; keep them visually identical.
Do not make the website visually different from the existing static site.
Do not only hardcode one page.
Do not duplicate the same background logic everywhere.
Do not break existing code.
Do not ignore TypeScript errors.
Keep the implementation simple enough for me to explain later.
Study the Doanhnhandongthap and Metik folders first and match their Puck config, fields, and editor layout.
Keep the Puck field order consistent across all components.
Teach as you build — confirm my understanding at each stage before moving on.
Do not end the session until I have demonstrably understood everything on the learning checklist.
```

## Reference Screenshot Notes

Screenshots may be provided separately across sessions. Use them as visual references for:

```txt
Original task message
Feature requirements
Multilingual explanation
Page Management screen
Duplicate translation tooltip
Clarification that the EN page is a cloned page manually edited later
```

The key meaning from the screenshots:

```txt
The admin needs one Page Management screen.
The site is bilingual VI/EN.
The header toggle renders the saved version in the selected language.
The duplicate button creates the other language version.
The duplicated page is not translated automatically.
The editor manually edits the copied English page later.
```
