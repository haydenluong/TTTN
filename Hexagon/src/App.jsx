import { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Puck, Render } from "@puckeditor/core";
import "@puckeditor/core/puck.css";

import { puckConfig } from "./puck.config";
import { PuckNumberFieldOverride } from "./blocks/shared/fieldStyles";
import { SERVICE_PAGES } from "./data/servicePages";
import { NEWS_ARTICLES } from "./data/newsArticles";
import {
  homeStorageKey,
  loadHomeData,
  serviceStorageKey,
  loadServiceData,
  newsListStorageKey,
  loadNewsListData,
  newsArticleStorageKey,
  loadNewsArticleData,
} from "./data/legacyPageData";

import SiteHeader, { loadHeaderData, headerStorageKey } from "./components/SiteHeader";
import SiteFooter, { loadFooterData, footerStorageKey } from "./components/SiteFooter";
import ScrollToTopButton from "./components/ScrollToTopButton";
import NewsArticlePage from "./components/NewsArticlePage";
import NewsListPage from "./components/NewsListPage";
import PageManager from "./pages/PageManager";
import PageEditor from "./pages/PageEditor";
import PageRestore from "./pages/PageRestore";
import PublicPageView from "./pages/PublicPageView";
import { usePageManager } from "./hooks/usePageManager";
import { PageStatus } from "./data/pageModel";

// sửa lỗi backspace số nhảy về "0" của field type:"number" gốc của Puck
const puckOverrides = { fieldTypes: { number: PuckNumberFieldOverride } };

// nếu slug này (bản vi) đã có bản publish trong Page Manager thì dùng bản đó,
// không thì fallback về dữ liệu tĩnh cũ (chưa từng mở Page Manager để sửa) —
// các route legacy này luôn là vi, bản en đi qua PublicPageView (path="*")
function useManagedPuckData(slug, fallbackLoader) {
  const { pages } = usePageManager();
  const managed = pages.find((p) => p.slug === slug && p.lang === "vi" && p.status === PageStatus.PUBLISHED);
  return managed ? managed.puckData : fallbackLoader();
}

// Trang chủ thật: toàn bộ section (Hero...Contact) đã chuyển qua Puck (<Render>);
// Header/Footer là chrome cố định quanh nội dung, không phải component kéo-thả.
function HomePage() {
  const data = useManagedPuckData("trang-chu", loadHomeData);
  return (
    <>
      <SiteHeader />
      <ScrollToTopButton />
      <main>
        <Render config={puckConfig} data={data} />
      </main>
      <SiteFooter />
    </>
  );
}

function ServicePageView({ page }) {
  const data = useManagedPuckData(page.slug, () => loadServiceData(page));
  return (
    <>
      <SiteHeader />
      <ScrollToTopButton />
      <main className="pt-28 md:pt-32 bg-[#F8FAFC] min-h-screen">
        <div className="container mx-auto px-6 py-6">
          <nav className="text-sm mb-10 text-gray-400">
            <Link to="/" className="hover:text-gold-accent">
              Trang chủ
            </Link>{" "}
            &gt;{" "}
            <Link to="/#dich-vu" className="hover:text-gold-accent">
              Dịch vụ
            </Link>{" "}
            &gt; <span className="text-gray-700">{page.title}</span>
          </nav>
          <Render config={puckConfig} data={data} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}


const editorTabs = [
  { key: "home", label: "Trang chủ", type: "main"},
  { key: "services-group", label: "Trang Con của Giải pháp nổi bật", type: "group" },
  { key: "news-group", label: "Trang Con của Tin tức", type: "group" },
];

function loadEditorData(tabKey) {
  if (tabKey === "home") return loadHomeData();
  if (tabKey === "news-list") return loadNewsListData();
  if (tabKey === "header") return loadHeaderData();
  if (tabKey === "footer") return loadFooterData();
  const page = SERVICE_PAGES.find((p) => p.slug === tabKey);
  if (page) return loadServiceData(page);
  const article = NEWS_ARTICLES.find((a) => a.slug === tabKey);
  return loadNewsArticleData(article);
}

function editorStorageKey(tabKey) {
  if (tabKey === "home") return homeStorageKey;
  if (tabKey === "news-list") return newsListStorageKey;
  if (tabKey === "header") return headerStorageKey;
  if (tabKey === "footer") return footerStorageKey;
  const page = SERVICE_PAGES.find((p) => p.slug === tabKey);
  if (page) return serviceStorageKey(tabKey);
  return newsArticleStorageKey(tabKey);
}

function Editor() {
  const [activeTab, setActiveTab] = useState("home");
  const [expandedGroup, setExpandedGroup] = useState(null);

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        {/* Main tabs row */}
        <div className="flex flex-wrap gap-2 px-4 py-2">
          {editorTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.type === "group") {
                  setExpandedGroup(expandedGroup === tab.key ? null : tab.key);
                } else {
                  setActiveTab(tab.key);
                  setExpandedGroup(null);
                }
              }}
              className={
                expandedGroup === tab.key || (expandedGroup === null && activeTab === tab.key)
                  ? "cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  : "cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              }
            >
              {tab.label}
              {tab.type === "group" && <span>{expandedGroup === tab.key ? " ▼" : " ▶"}</span>}
            </button>
          ))}
        </div>

        {/* Expanded services group */}
        {expandedGroup === "services-group" && (
          <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3">
            {SERVICE_PAGES.map((page) => (
              <button
                key={page.slug}
                onClick={() => {
                  setActiveTab(page.slug);
                  setExpandedGroup(null);
                }}
                className={
                  activeTab === page.slug
                    ? "cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                    : "cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                }
              >
                {page.title}
              </button>
            ))}
          </div>
        )}

        {/* Expanded news group */}
        {expandedGroup === "news-group" && (
          <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3">
            {NEWS_ARTICLES.map((article) => (
              <button
                key={article.slug}
                onClick={() => {
                  setActiveTab(article.slug);
                  setExpandedGroup(null);
                }}
                className={
                  activeTab === article.slug
                    ? "cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                    : "cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                }
              >
                {article.title}
              </button>
            ))}
          </div>
        )}
      </div>
      {activeTab && (
        <Puck
          key={activeTab}
          config={puckConfig}
          data={loadEditorData(activeTab)}
          overrides={puckOverrides}
          onPublish={(d) => localStorage.setItem(editorStorageKey(activeTab), JSON.stringify(d))}
        />
      )}
    </>
  );
}

function NewsListRoute() {
  const data = useManagedPuckData("bai-viet", loadNewsListData);
  return <NewsListPage puckData={data} />;
}

function NewsArticleRoute({ article }) {
  const data = useManagedPuckData(article.slug, () => loadNewsArticleData(article));
  return <NewsArticlePage article={article} puckData={data} />;
}

// trình duyệt tự scroll tới #hash trước khi React kịp render section,
// nên phải đợi element xuất hiện rồi mới scroll
function ScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    let tries = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
      else if (tries++ < 40) requestAnimationFrame(attempt);
    };
    attempt();
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/admin/pages" element={<PageManager />} />
        <Route path="/admin/pages/:id/:lang/edit" element={<PageEditor />} />
        <Route path="/admin/khoi-phuc" element={<PageRestore />} />
        {/* /dich-vu/slug là đường dẫn chính thức mới; /slug (cũ) giữ lại làm alias
            để link/href cũ đã lưu trong nội dung Puck (vd thẻ ở block Services) không bị gãy */}
        {SERVICE_PAGES.map((page) => (
          <Fragment key={page.slug}>
            <Route path={`/dich-vu/${page.slug}`} element={<ServicePageView page={page} />} />
            <Route path={`/${page.slug}`} element={<ServicePageView page={page} />} />
          </Fragment>
        ))}
        <Route path="/bai-viet" element={<NewsListRoute />} />
        {NEWS_ARTICLES.map((article) => (
          <Fragment key={article.slug}>
            <Route path={`/tin-tuc/${article.slug}`} element={<NewsArticleRoute article={article} />} />
            <Route path={`/${article.slug}`} element={<NewsArticleRoute article={article} />} />
          </Fragment>
        ))}
        <Route path="*" element={<PublicPageView />} />
      </Routes>
    </BrowserRouter>
  );
}
