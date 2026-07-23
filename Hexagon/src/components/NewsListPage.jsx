import { Link, useLocation } from "react-router-dom";
import { Render } from "@puckeditor/core";
import { puckConfig } from "../puck.config";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import ScrollToTopButton from "./ScrollToTopButton";
import ServicesSidebar from "./ServicesSidebar";
import { NEWS_ARTICLES, formatDateEn, translateCategory } from "../data/newsArticles";
import { usePageManager } from "../hooks/usePageManager";
import { findTranslatedPage, PageTemplate } from "../data/pageModel";
import { buildPageHref, getLangFromPath } from "../utils/pageUrl";

function CalendarIcon() {
  return (
    <svg className="w-3 h-3 text-gold-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3 text-gold-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function NewsListPage({ puckData }) {
  const { pages } = usePageManager();
  const location = useLocation();
  const lang = getLangFromPath(location.pathname);

  const homeVi = pages.find((p) => p.lang === "vi" && p.template === PageTemplate.HOME);
  const homeEn = homeVi ? findTranslatedPage(homeVi, pages, { publishedOnly: true }) : null;
  const homeHref = buildPageHref(lang === "en" ? homeEn : homeVi);

  const articles = NEWS_ARTICLES.map((article) => {
    // slug trong Page Manager có thể có tiền tố "tin-tuc/" nên so theo phần cuối
    const viPage = pages.find(
      (p) => p.lang === "vi" && (p.slug === article.slug || p.slug.endsWith(`/${article.slug}`))
    );
    const enPage = viPage ? findTranslatedPage(viPage, pages, { publishedOnly: true }) : null;
    const targetPage = lang === "en" ? enPage : viPage;
    return {
      ...article,
      title: lang === "en" ? (enPage?.title ?? article.title) : article.title,
      href: targetPage ? buildPageHref(targetPage) : `/${article.slug}`,
    };
  });

  return (
    <>
      <SiteHeader />
      <ScrollToTopButton />
      <main className="pt-28 md:pt-32 bg-[#F8FAFC] min-h-screen">
        <div className="container mx-auto px-6 py-6">
          <section className="text-left mb-8 text-base">
            <nav className="text-sm text-gray-400 flex items-center gap-1 flex-wrap">
              <Link to={homeHref} className="hover:text-gold-accent transition-colors">
                {lang === "en" ? "Home" : "Trang chủ"}
              </Link>
              <span className="mx-1 text-gray-300">&gt;</span>
              <span className="text-gray-700 font-medium">{lang === "en" ? "News" : "Tin tức"}</span>
            </nav>
          </section>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0">
              <Render config={puckConfig} data={puckData} />

              <section className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      to={article.href}
                      className="group bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-gold-accent/40 flex flex-col"
                    >
                      <div className="relative overflow-hidden aspect-[16/9] bg-gradient-to-br from-slate-200 to-slate-300">
                        {article.image && (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <span className="inline-block text-[11px] font-semibold text-[#f59e0b] bg-yellow-50 border border-yellow-200 rounded-full px-2 py-0.5 mb-2 w-fit">
                          {lang === "en" ? translateCategory(article.category) : article.category}
                        </span>
                        <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#d97706] transition-colors leading-snug">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 flex-1 mb-3">{article.excerpt}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-2 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <CalendarIcon />
                              {lang === "en" ? formatDateEn(article.date) : article.date}
                            </span>
                            {article.time && (
                              <span className="flex items-center gap-1">
                                <ClockIcon />
                                {article.time}
                              </span>
                            )}
                          </div>
                          <span className="text-[#f59e0b] text-[11px] font-semibold group-hover:underline">
                            {lang === "en" ? "Read more →" : "Xem thêm →"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-24 self-start">
              <ServicesSidebar lang={lang} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
