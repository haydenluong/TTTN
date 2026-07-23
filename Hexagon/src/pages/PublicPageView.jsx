import { Link, useLocation } from "react-router-dom";
import { Render } from "@puckeditor/core";
import { puckConfig } from "../puck.config";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import NewsArticlePage from "../components/NewsArticlePage";
import NewsListPage from "../components/NewsListPage";
import { usePageManager } from "../hooks/usePageManager";
import { PageTemplate } from "../data/pageModel";
import { buildPageHref, getLangFromPath, resolvePageFromPath } from "../utils/pageUrl";

export default function PublicPageView() {
  const { pathname } = useLocation();
  const { pages } = usePageManager();
  const page = resolvePageFromPath(pathname, pages);
  const lang = getLangFromPath(pathname);

  if (!page) {
    return (
      <>
        <SiteHeader />
        <main className="pt-32 min-h-screen flex items-center justify-center text-gray-500">
          Không tìm thấy trang này.
        </main>
        <SiteFooter />
      </>
    );
  }

  // bài viết: tái dùng nguyên khung của NewsArticlePage (sidebar, related, breadcrumb)
  if (page.template === PageTemplate.ARTICLE) {
    return (
      <NewsArticlePage
        article={{ slug: page.slug, category: "Bài viết", title: page.title }}
        puckData={page.puckData}
      />
    );
  }

  // danh sách bài viết: tái dùng khung NewsListPage (grid bài viết + sidebar)
  if (page.template === PageTemplate.NEWS_LIST) {
    return <NewsListPage puckData={page.puckData} />;
  }

  // trang chủ: full-width, không container — giống hệt HomePage ở App.jsx
  if (page.template === PageTemplate.HOME) {
    return (
      <>
        <SiteHeader />
        <ScrollToTopButton />
        <main>
          <Render config={puckConfig} data={page.puckData} />
        </main>
        <SiteFooter />
      </>
    );
  }

  // trang dịch vụ: container + breadcrumb — giống hệt ServicePageView ở App.jsx
  if (page.template === PageTemplate.SERVICE) {
    const homePage = page.parentId ? pages.find((p) => p.id === page.parentId && p.lang === lang) : null;
    const homeHref = buildPageHref(homePage);
    return (
      <>
        <SiteHeader />
        <ScrollToTopButton />
        <main className="pt-28 md:pt-32 bg-[#F8FAFC] min-h-screen">
          <div className="container mx-auto px-6 py-6">
            <nav className="text-sm mb-10 text-gray-400">
              <Link to={homeHref} className="hover:text-gold-accent">
                {lang === "en" ? "Home" : "Trang chủ"}
              </Link>{" "}
              &gt;{" "}
              <Link to={`${homeHref}#dich-vu`} className="hover:text-gold-accent">
                {lang === "en" ? "Services" : "Dịch vụ"}
              </Link>{" "}
              &gt; <span className="text-gray-700">{page.title}</span>
            </nav>
            <Render config={puckConfig} data={page.puckData} />
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <ScrollToTopButton />
      <main className="pt-28 md:pt-32 bg-[#F8FAFC] min-h-screen">
        <div className="container mx-auto px-6 py-6">
          <Render config={puckConfig} data={page.puckData} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
