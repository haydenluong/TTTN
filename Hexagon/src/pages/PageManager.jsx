import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageManager } from "../hooks/usePageManager";

const LANG_LABEL = { vi: "VI", en: "EN" };
const STATUS_LABEL = { draft: "Bản nháp", published: "Đã xuất bản" };

function LangBadge({ lang }) {
  const isVi = lang === "vi";
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
        isVi ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
      }`}
    >
      {LANG_LABEL[lang]}
    </span>
  );
}

function StatusBadge({ status }) {
  const isPublished = status === "published";
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
        isPublished ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function DuplicateIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M8 7h6a2 2 0 012 2v6" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function PageManager() {
  const navigate = useNavigate();
  const { pages, addPage, deletePage, duplicatePage } = usePageManager();
  const [langFilter, setLangFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      if (langFilter !== "all" && p.lang !== langFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (dateFilter) {
        const pageDate = p.updatedAt.slice(0, 10);
        if (pageDate !== dateFilter) return false;
      }
      return true;
    });
  }, [pages, langFilter, statusFilter, dateFilter]);

  function handleDelete(page) {
    if (window.confirm(`Xóa page "${page.title}"?`)) {
      deletePage(page.id);
    }
  }

  function handleDuplicate(page) {
    duplicatePage(page.id);
  }

  function handleCreate() {
    // slug tạm duy nhất để qua validate + không đụng route; admin đổi lại trong Cài đặt page
    const newPage = addPage({
      title: "Trang mới",
      slug: `trang-moi-${crypto.randomUUID().slice(0, 8)}`,
    });
    navigate(`/admin/pages/${newPage.id}/edit`);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>📄</span> Quản lý Pages
            </h1>
            <p className="text-gray-500 mt-1">Tạo và quản lý các trang với PUCK Visual Builder</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            + Tạo Page Mới
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngôn ngữ</label>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="vi">VI</option>
              <option value="en">EN</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngày cập nhật</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Tiêu đề</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Ngôn ngữ</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Cập nhật</th>
                <th className="px-5 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    Chưa có page nào.
                  </td>
                </tr>
              )}
              {filteredPages.map((page) => (
                <tr key={page.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{page.title}</div>
                    {page.seoTitle && <div className="text-xs text-gray-400">SEO: {page.seoTitle}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">/{page.slug}</code>
                  </td>
                  <td className="px-5 py-4">
                    <LangBadge lang={page.lang} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={page.status} />
                  </td>
                  <td className="px-5 py-4 text-gray-500">{new Date(page.updatedAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-gray-500">
                      <button
                        title={page.lang === "vi" ? "Tạo bản dịch EN" : "Tạo bản dịch VI"}
                        onClick={() => handleDuplicate(page)}
                        className="hover:text-blue-600"
                      >
                        <DuplicateIcon />
                      </button>
                      <button
                        title="Chỉnh sửa"
                        onClick={() => navigate(`/admin/pages/${page.id}/edit`)}
                        className="hover:text-blue-600"
                      >
                        <EditIcon />
                      </button>
                      <button title="Xóa" onClick={() => handleDelete(page)} className="hover:text-red-600">
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
