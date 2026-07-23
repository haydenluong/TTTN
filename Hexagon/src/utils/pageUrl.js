import { PageStatus, PageTemplate } from "../data/pageModel";

// tên đoạn url của trang cha, dựa vào template của trang cha + ngôn ngữ của trang con
// (home -> "dich-vu"/"services", danh sách bài viết -> "tin-tuc"/"news")
export function childSegment(parentTemplate, lang) {
  const isEn = lang === "en";
  if (parentTemplate === PageTemplate.HOME) return isEn ? "services" : "dich-vu";
  if (parentTemplate === PageTemplate.NEWS_LIST) return isEn ? "news" : "tin-tuc";
  return null;
}

// đường dẫn public của 1 page — slug đã bao gồm sẵn đoạn cha (vd "dich-vu/giai-phap-cong-nghe"),
// nên ở đây chỉ cần thêm tiền tố ngôn ngữ:
// trang chủ: "/" (vi) hoặc "/en" (en)
// còn lại: "/slug" hoặc "/en/slug"
export function buildPageHref(page) {
  if (!page) return "/";
  const isEn = page.lang === "en";
  if (page.template === PageTemplate.HOME) return isEn ? "/en" : "/";
  return isEn ? `/en/${page.slug}` : `/${page.slug}`;
}

// ngược lại của buildPageHref: từ pathname suy ra lang + slug thật (chỉ bỏ tiền tố "en/" —
// đoạn cha nếu có đã nằm sẵn trong page.slug nên không cần bóc riêng)
export function parsePagePath(pathname) {
  const clean = pathname.replace(/^\/+/, "");
  const isEn = clean === "en" || clean.startsWith("en/");
  const slug = isEn ? clean.slice(2).replace(/^\//, "") : clean;
  return { lang: isEn ? "en" : "vi", slug };
}

// chỉ cần biết ngôn ngữ hiện tại đang xem (dùng cho Header, sidebar, breadcrumb...)
export function getLangFromPath(pathname) {
  return parsePagePath(pathname).lang;
}

// tìm page public khớp với pathname hiện tại (dùng bởi route catch-all)
export function resolvePageFromPath(pathname, allPages) {
  const { lang, slug } = parsePagePath(pathname);
  return (
    allPages.find(
      (p) =>
        p.lang === lang &&
        p.status === PageStatus.PUBLISHED &&
        (slug === "" ? p.template === PageTemplate.HOME : p.slug === slug)
    ) || null
  );
}
