import { Link, useLocation } from "react-router-dom";
import { Render } from "@puckeditor/core";
import { puckConfig } from "../puck.config";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ScrollToTopButton from "../components/ScrollToTopButton";
import NewsArticlePage from "../components/NewsArticlePage";
import NewsListPage from "../components/NewsListPage";
import { usePageManager } from "../hooks/usePageManager";
import { PageStatus, PageTemplate } from "../data/pageModel";

export default function PublicPageView() {
  const slug = useLocation().pathname.replace(/^\//, "");
  const { pages } = usePageManager();
  const page = pages.find((p) => p.slug === slug && p.status === PageStatus.PUBLISHED);

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
