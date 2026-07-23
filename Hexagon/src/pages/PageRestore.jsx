import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageManager } from "../hooks/usePageManager";
import Modal from "../components/Modal";

const LANG_LABEL = { vi: "VI", en: "EN" };

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

export default function PageRestore() {
  const navigate = useNavigate();
  const { trash, restorePage, restoreAllPages, purgeTrashPage, purgeAllTrash } = usePageManager();
  const [purgeTarget, setPurgeTarget] = useState(null); // page object hoặc "all"

  function handleRestoreOne(page) {
    restorePage(page.id, page.lang);
    navigate("/admin/pages");
  }

  function handleRestoreAll() {
    restoreAllPages();
    navigate("/admin/pages");
  }

  function handlePurgeConfirm() {
    if (purgeTarget === "all") purgeAllTrash();
    else purgeTrashPage(purgeTarget.id, purgeTarget.lang);
    setPurgeTarget(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🗑</span> Thùng rác
            </h1>
            <p className="text-gray-500 mt-1">Khôi phục hoặc xóa vĩnh viễn các page đã xóa</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/pages")}
              className="text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              ← Quản lý Pages
            </button>
            {trash.length > 0 && (
              <>
                <button
                  onClick={handleRestoreAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
                >
                  Khôi phục tất cả
                </button>
                <button
                  onClick={() => setPurgeTarget("all")}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
                >
                  Xóa tất cả vĩnh viễn
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Tiêu đề</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Ngôn ngữ</th>
                <th className="px-5 py-3 font-medium">Đã xóa lúc</th>
                <th className="px-5 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {trash.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                    Thùng rác trống.
                  </td>
                </tr>
              )}
              {trash.map((page) => (
                <tr key={`${page.id}-${page.lang}`} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-4 font-semibold text-gray-900">{page.title}</td>
                  <td className="px-5 py-4">
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">/{page.slug}</code>
                  </td>
                  <td className="px-5 py-4">
                    <LangBadge lang={page.lang} />
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(page.deletedAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRestoreOne(page)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        Khôi phục
                      </button>
                      <button
                        onClick={() => setPurgeTarget(page)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Xóa vĩnh viễn
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {purgeTarget && (
        <Modal
          open
          onClose={() => setPurgeTarget(null)}
          title="Xóa vĩnh viễn"
          footer={
            <>
              <button
                onClick={() => setPurgeTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Huỷ
              </button>
              <button
                onClick={handlePurgeConfirm}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Xóa vĩnh viễn
              </button>
            </>
          }
        >
          <p className="text-sm text-gray-600">
            {purgeTarget === "all"
              ? "Xóa vĩnh viễn toàn bộ page trong thùng rác? Không thể hoàn tác."
              : `Xóa vĩnh viễn page "${purgeTarget.title}"? Không thể hoàn tác.`}
          </p>
        </Modal>
      )}
    </div>
  );
}
