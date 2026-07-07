import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig } from "../puck.config";
import { PuckNumberFieldOverride } from "../blocks/shared/fieldStyles";
import { PageLanguage, PageStatus } from "../data/pageModel";
import { usePageManager } from "../hooks/usePageManager";

const puckOverrides = { fieldTypes: { number: PuckNumberFieldOverride } };

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pages, updatePage } = usePageManager();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const page = pages.find((p) => p.id === id);

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

  // lưu xong quay về bảng quản lý — đúng flow "bấm publish thì nó sẽ lưu vào đây";
  // an toàn vì commit trong hook đã ghi localStorage đồng bộ trước khi navigate
  function handlePublish(data) {
    updatePage(page.id, { puckData: data, status: PageStatus.PUBLISHED });
    navigate("/admin/pages");
  }

  function handleMetaChange(field, value) {
    updatePage(page.id, { [field]: value });
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
              href={`/${page.slug}`}
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
              defaultValue={page.title}
              onBlur={(e) => handleMetaChange("title", e.target.value)}
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
            <label className="block text-xs text-gray-500 mb-1">Slug</label>
            <input
              type="text"
              defaultValue={page.slug}
              onBlur={(e) => handleMetaChange("slug", e.target.value)}
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
          key={page.id}
          config={puckConfig}
          data={page.puckData}
          overrides={puckOverrides}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}
