import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig } from "../puck.config";
import { PuckNumberFieldOverride } from "../blocks/shared/fieldStyles";
import { PageLanguage, PageStatus, uniqueSlug } from "../data/pageModel";
import { usePageManager } from "../hooks/usePageManager";
import { slugify } from "../utils/slugify";
import { buildPageHref, childSegment } from "../utils/pageUrl";

const puckOverrides = { fieldTypes: { number: PuckNumberFieldOverride } };

export default function PageEditor() {
  const { id, lang } = useParams();
  const navigate = useNavigate();
  const { pages, updatePage } = usePageManager();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const page = pages.find((p) => p.id === id && p.lang === lang);

  // title/slug là controlled vì auto-slug cần cập nhật slug ngay khi gõ tiêu đề,
  // không đợi tới lúc rời khỏi ô input (onBlur) như trước
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [autoSlug, setAutoSlug] = useState(page?.autoSlug ?? true);

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy page này.</p>
          <button
            onClick={() => navigate("/admin/pages")}
            className="text-blue-600 hover:underline font-medium"
          >
            Quay lại Quản lý Pages
          </button>
        </div>
      </div>
    );
  }

  function handlePublish(data) {
    updatePage(page.id, page.lang, { puckData: data, status: PageStatus.PUBLISHED });
    navigate("/admin/pages");
  }

  function handleMetaChange(field, value) {
    updatePage(page.id, page.lang, { [field]: value });
  }

  // trang con (dịch vụ/bài viết) thì slug phải có sẵn đoạn cha ở trước
  // (vd "dich-vu/ten-trang"), đúng url thật của trang — không chỉ mỗi phần lá
  function regenerateSlug(fromTitle) {
    const parent = page.parentId ? pages.find((p) => p.id === page.parentId) : null;
    const segment = parent ? childSegment(parent.template, page.lang) : null;
    const leaf = slugify(fromTitle);
    const base = segment ? `${segment}/${leaf}` : leaf;
    return uniqueSlug(base, { lang: page.lang, parentId: page.parentId }, pages, page.id);
  }

  function handleTitleChange(value) {
    setTitle(value);
    if (autoSlug) setSlug(regenerateSlug(value));
  }

  function handleTitleBlur() {
    updatePage(page.id, page.lang, autoSlug ? { title, slug } : { title });
  }

  function handleSlugChange(value) {
    setSlug(value);
    if (autoSlug) setAutoSlug(false); // sửa tay thì tắt auto, tránh bị ghi đè lại
  }

  function handleSlugBlur() {
    updatePage(page.id, page.lang, { slug, autoSlug });
  }

  function handleAutoToggle(checked) {
    setAutoSlug(checked);
    if (checked) {
      const regenerated = regenerateSlug(title);
      setSlug(regenerated);
      updatePage(page.id, page.lang, { autoSlug: true, slug: regenerated });
    } else {
      updatePage(page.id, page.lang, { autoSlug: false });
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/pages")}
            className="text-gray-500 hover:text-gray-800 text-sm font-medium"
          >
            ← Quản lý Pages
          </button>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-900">{page.title}</span>
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
              page.lang === "vi" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
            }`}
          >
            {page.lang.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {page.status === PageStatus.PUBLISHED && (
            <a
              href={buildPageHref(page)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Xem trang ↗
            </a>
          )}
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {settingsOpen ? "Ẩn cài đặt page ▲" : "Cài đặt page ▼"}
          </button>
        </div>
      </div>

      {settingsOpen && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">SEO Title</label>
            <input
              type="text"
              defaultValue={page.seoTitle || ""}
              onBlur={(e) => handleMetaChange("seoTitle", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Slug</span>
              <label className="flex items-center gap-1 font-normal normal-case">
                <input
                  type="checkbox"
                  checked={autoSlug}
                  onChange={(e) => handleAutoToggle(e.target.checked)}
                />
                Tự động
              </label>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              onBlur={handleSlugBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ngôn ngữ</label>
            <select
              value={page.lang}
              onChange={(e) => handleMetaChange("lang", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value={PageLanguage.VI}>VI</option>
              <option value={PageLanguage.EN}>EN</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Trạng thái</label>
            <select
              value={page.status}
              onChange={(e) => handleMetaChange("status", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
            >
              <option value={PageStatus.DRAFT}>Bản nháp</option>
              <option value={PageStatus.PUBLISHED}>Đã xuất bản</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <Puck
          key={`${page.id}-${page.lang}`}
          config={puckConfig}
          data={page.puckData}
          overrides={puckOverrides}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}
