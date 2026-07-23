// turns a title into a url-safe slug, e.g. "Bài viết" -> "bai-viet"
export function slugify(input) {
  return (input || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (combining diacritical marks left over from NFD)
    .replace(/[đĐ]/g, "d") // NFD doesn't decompose đ/Đ
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
