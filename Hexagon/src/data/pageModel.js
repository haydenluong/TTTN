// Page data structure for multilingual page management
// A VI page and its EN translation share the same `id` — lang is what tells them apart

export const PageStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

export const PageLanguage = {
  VI: "vi",
  EN: "en",
};

// template quyết định khung public bọc quanh nội dung Puck khi render qua /:slug
// (breadcrumb dịch vụ, sidebar bài viết, full-width trang chủ...)
export const PageTemplate = {
  DEFAULT: "default",
  HOME: "home",
  SERVICE: "service",
  ARTICLE: "article",
  NEWS_LIST: "news-list",
};

// smallest unused id, so ids stay sequential and restore can mint "current max + 1"
export function nextPageId(allPages) {
  const max = allPages.reduce((m, p) => {
    const n = Number(p.id);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return String(max + 1);
}

// create a new page — id must be supplied by the caller (nextPageId(), or an existing
// id when creating a translation of that same page)
export function createPage({
  id,
  lang = PageLanguage.VI,
  slug = "",
  title = "Untitled",
  seoTitle = "",
  status = PageStatus.DRAFT,
  parentId = null, // id of this page's parent (e.g. a service page's parent is the homepage)
  autoSlug = true, // whether slug keeps re-deriving from title in the editor
  template = PageTemplate.DEFAULT,
  puckData = { blocks: [], root: {} },
} = {}) {
  if (id === undefined) {
    throw new Error("createPage requires an explicit id (use nextPageId(allPages))");
  }
  return {
    id,
    lang,
    slug,
    title,
    seoTitle,
    status,
    parentId,
    autoSlug,
    template,
    puckData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// validate page structure
export function validatePage(page) {
  const errors = [];
  if (!page.id) errors.push("id is required");
  if (!page.lang || !Object.values(PageLanguage).includes(page.lang)) errors.push("lang must be 'vi' or 'en'");
  if (!page.slug) errors.push("slug is required");
  if (!page.title) errors.push("title is required");
  if (!Object.values(PageStatus).includes(page.status)) errors.push("status must be 'draft' or 'published'");
  if (!page.puckData) errors.push("puckData is required");
  return errors.length === 0 ? { valid: true } : { valid: false, errors };
}

// find the translated version of a page in an array
// same id, opposite lang — publishedOnly: the public site must never route to a draft translation
export function findTranslatedPage(page, allPages, { publishedOnly = false } = {}) {
  return (
    allPages.find(
      (p) => p.id === page.id && p.lang !== page.lang && (!publishedOnly || p.status === PageStatus.PUBLISHED)
    ) || null
  );
}

// pick a slug that no sibling page (same lang + same parent) already uses
export function uniqueSlug(baseSlug, { lang, parentId = null }, allPages, excludeId = null) {
  const collides = (s) =>
    allPages.some((p) => p.id !== excludeId && p.slug === s && p.lang === lang && p.parentId === parentId);
  if (!collides(baseSlug)) return baseSlug;
  let n = 2;
  let slug = `${baseSlug}-${n}`;
  while (collides(slug)) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
  return slug;
}

// create the sibling-language row for a page — SAME id, opposite (or chosen) lang
export function createTranslation(page, targetLang, allPages, { title, slug, seoTitle } = {}) {
  if (allPages.some((p) => p.id === page.id && p.lang === targetLang)) {
    throw new Error(`A ${targetLang} translation for id ${page.id} already exists`);
  }
  const finalSlug = uniqueSlug(slug ?? page.slug, { lang: targetLang, parentId: page.parentId }, allPages);
  return createPage({
    id: page.id,
    lang: targetLang,
    slug: finalSlug,
    title: title ?? page.title,
    seoTitle: seoTitle ?? page.seoTitle,
    status: PageStatus.DRAFT,
    parentId: page.parentId,
    autoSlug: false, // a manually-picked translation slug shouldn't silently re-slugify later
    template: page.template, // bản dịch giữ nguyên khung public của bản gốc
    puckData: JSON.parse(JSON.stringify(page.puckData)), // deep clone
  });
}

// get both versions of a page (if they exist)
export function getPageWithTranslation(page, allPages) {
  const translated = findTranslatedPage(page, allPages);
  return {
    [page.lang]: page,
    [translated?.lang || (page.lang === PageLanguage.VI ? PageLanguage.EN : PageLanguage.VI)]: translated || null,
  };
}
