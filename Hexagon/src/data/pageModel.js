// Page data structure for multilingual page management
// All pages (VI and EN) are stored in one array with translationOf linking them

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

// create a new page
export function createPage({
  id = `page-${crypto.randomUUID()}`,
  lang = PageLanguage.VI,
  slug = "",
  title = "Untitled",
  seoTitle = "",
  status = PageStatus.DRAFT,
  translationOf = null,
  template = PageTemplate.DEFAULT,
  puckData = { blocks: [], root: {} },
} = {}) {
  return {
    id,
    lang,
    slug,
    title,
    seoTitle,
    status,
    translationOf, // null for original, "page-id" for translations
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
// publishedOnly: the public site must never route visitors to a draft translation
export function findTranslatedPage(page, allPages, { publishedOnly = false } = {}) {
  const targetLang = page.lang === PageLanguage.VI ? PageLanguage.EN : PageLanguage.VI;
  const matches = (p) =>
    p.lang === targetLang && (!publishedOnly || p.status === PageStatus.PUBLISHED);

  // if this page is an original (translationOf is null), find translated versions
  if (page.translationOf === null) {
    return allPages.find((p) => p.translationOf === page.id && matches(p)) || null;
  }

  // if this page is a translation, find the original itself or another sibling of it
  const original = allPages.find((p) => p.id === page.translationOf);
  if (!original) return null;
  if (matches(original)) return original;

  return allPages.find((p) => p.translationOf === original.id && matches(p)) || null;
}

// pick a slug that no existing page uses, so two pages never fight over one route
function uniqueSlug(baseSlug, targetLang, allPages) {
  let slug = `${baseSlug}-${targetLang}`;
  let n = 2;
  while (allPages.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${targetLang}-${n}`;
    n += 1;
  }
  return slug;
}

// duplicate a page to another language (creates a new draft)
export function duplicateToOtherLanguage(page, allPages) {
  if (page.translationOf !== null) {
    throw new Error("Can only duplicate original pages (translationOf === null)");
  }

  const targetLang = page.lang === PageLanguage.VI ? PageLanguage.EN : PageLanguage.VI;

  const newPage = createPage({
    lang: targetLang,
    slug: uniqueSlug(page.slug, targetLang, allPages),
    title: page.title,
    seoTitle: page.seoTitle,
    status: PageStatus.DRAFT,
    translationOf: page.id,
    template: page.template, // bản dịch giữ nguyên khung public của bản gốc
    puckData: JSON.parse(JSON.stringify(page.puckData)), // deep clone
  });

  return newPage;
}

// get both versions of a page (if they exist)
export function getPageWithTranslation(page, allPages) {
  const translated = findTranslatedPage(page, allPages);
  return {
    [page.lang]: page,
    [translated?.lang || (page.lang === PageLanguage.VI ? PageLanguage.EN : PageLanguage.VI)]: translated || null,
  };
}
