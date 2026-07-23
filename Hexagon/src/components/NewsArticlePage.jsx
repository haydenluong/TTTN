import { Link, useLocation } from "react-router-dom";
import { Render } from "@puckeditor/core";
import { puckConfig } from "../puck.config";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ScrollToTopButton from "./ScrollToTopButton";
import ServicesSidebar from "./ServicesSidebar";
import { NEWS_ARTICLES, formatDateEn } from "../data/newsArticles";
import { usePageManager } from "../hooks/usePageManager";
import { findTranslatedPage, PageTemplate } from "../data/pageModel";
import { buildPageHref, getLangFromPath } from "../utils/pageUrl";

export default function NewsArticlePage({ article, puckData }) {
  const { title } = article;
  const { pages } = usePageManager();
  const lang = getLangFromPath(useLocation().pathname);
  const category = lang === "en" ? "News" : article.category;

  const homeVi = pages.find((p) => p.lang === "vi" && p.template === PageTemplate.HOME);
  const homeEn = homeVi ? findTranslatedPage(homeVi, pages, { publishedOnly: true }) : null;
  const homeHref = buildPageHref(lang === "en" ? homeEn : homeVi);

  const listVi = pages.find((p) => p.lang === "vi" && p.template === PageTemplate.NEWS_LIST);
  const listEn = listVi ? findTranslatedPage(listVi, pages, { publishedOnly: true }) : null;
  const listHref = buildPageHref(lang === "en" ? listEn : listVi);

  const related = NEWS_ARTICLES.map((item) => {
      // slug trong Page Manager có thể có tiền tố "tin-tuc/" nên so theo phần cuối
      const viPage = pages.find(
        (p) => p.lang === "vi" && (p.slug === item.slug || p.slug.endsWith(`/${item.slug}`))
      );
      const enPage = viPage ? findTranslatedPage(viPage, pages, { publishedOnly: true }) : null;
      const targetPage = lang === "en" ? enPage : viPage;
      return {
        ...item,
        title: lang === "en" ? (enPage?.title ?? item.title) : item.title,
        href: targetPage ? buildPageHref(targetPage) : `/${item.slug}`,
      };
    })
    .filter((item) => item.slug !== article.slug)
    .slice(0, 4);

  return (
    <>
      <SiteHeader />
      <ScrollToTopButton />
      <main className="pt-28 md:pt-32 bg-[#F8FAFC] min-h-screen">
        <div className="container mx-auto px-6 py-6">
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link to={homeHref} className="hover:text-yellow-500 transition-colors">
              {lang === "en" ? "Home" : "Trang chủ"}
            </Link>
            <span>›</span>
            <Link to={listHref} className="hover:text-yellow-500 transition-colors">
              {lang === "en" ? "News" : "Bài viết"}
            </Link>
            <span>›</span>
            <Link to={listHref} className="hover:text-yellow-500 transition-colors">
              {category}
            </Link>
            <span>›</span>
            <span className="text-gray-600 line-clamp-1 max-w-xs">{title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0">
              <Render config={puckConfig} data={puckData} />
            </div>

            <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-24 self-start">
              <Link
                to={listHref}
                className="inline-flex items-center gap-2 mb-4 text-yellow-600 font-semibold hover:gap-3 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                {lang === "en" ? "Back to news" : "Quay lại danh sách"}
              </Link>
              <ServicesSidebar lang={lang} />
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-1 h-7 bg-yellow-400 rounded-full inline-block flex-shrink-0" />
                {lang === "en" ? "Related articles" : "Bài viết liên quan"}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={item.href}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-yellow-300 transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1.5">{lang === "en" ? formatDateEn(item.date) : item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
