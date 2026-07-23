import { useState } from "react";
import { Link } from "react-router-dom";
import { SERVICE_PAGES } from "../data/servicePages";
import { usePageManager } from "../hooks/usePageManager";
import { findTranslatedPage, PageTemplate } from "../data/pageModel";
import { buildPageHref } from "../utils/pageUrl";

// giống ServicesMiniSlider ở beta.hexagon.xyz (sidebar trang /bai-viet và bài viết chi tiết):
// 1 thẻ dịch vụ hiện tại + nút prev/next + chấm chỉ vị trí, dùng luôn SERVICE_PAGES thay vì gọi API
export default function ServicesSidebar({ lang = "vi" }) {
  const [index, setIndex] = useState(0);
  const { pages } = usePageManager();

  const servicePages = SERVICE_PAGES.map((sp) => {
    // slug trong Page Manager có thể có tiền tố "dich-vu/" nên so theo phần cuối
    const viPage = pages.find(
      (p) => p.lang === "vi" && (p.slug === sp.slug || p.slug.endsWith(`/${sp.slug}`))
    );
    const enPage = viPage ? findTranslatedPage(viPage, pages, { publishedOnly: true }) : null;
    const targetPage = lang === "en" ? enPage : viPage;
    return {
      ...sp,
      title: lang === "en" ? (enPage?.title ?? sp.titleEn ?? sp.title) : sp.title,
      href: targetPage ? buildPageHref(targetPage) : `/${sp.slug}`,
    };
  });

  const homeVi = pages.find((p) => p.lang === "vi" && p.template === PageTemplate.HOME);
  const homeEn = homeVi ? findTranslatedPage(homeVi, pages, { publishedOnly: true }) : null;
  const servicesHref = `${buildPageHref(lang === "en" ? homeEn : homeVi)}#dich-vu`;

  const page = servicePages[index];
  const go = (delta) => setIndex((i) => (i + delta + servicePages.length) % servicePages.length);

  return (
    <aside className="bg-white border-2 border-yellow-500/20 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300">
      <div className="bg-[#0D5939] px-6 py-4 flex items-center justify-center gap-3">
        <h3 className="text-white text-center font-bold text-lg md:text-xl uppercase tracking-wide">
          {lang === "en" ? "Our Services" : "Dịch vụ của chúng tôi"}
        </h3>
      </div>
      <div className="relative">
        <Link to={page.href} className="block group">
          <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
            {page.image && (
              <img
                src={page.image}
                alt={page.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>
          <div className="p-6 md:p-8">
            <h4 className="font-bold text-gray-900 text-lg md:text-xl mb-3 line-clamp-2 group-hover:text-[#d97706] transition-colors leading-snug">
              {page.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
              {lang === "en" && page.descriptionEn ? page.descriptionEn : page.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#f59e0b] group-hover:underline">
              {lang === "en" ? "Learn more" : "Tìm hiểu thêm"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous service"
          className="absolute left-2 top-[30%] -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white shadow-md rounded-full border border-gray-100 text-gray-600 hover:text-[#d97706] hover:scale-110 transition-all z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next service"
          className="absolute right-2 top-[30%] -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white shadow-md rounded-full border border-gray-100 text-gray-600 hover:text-[#d97706] hover:scale-110 transition-all z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-center gap-1.5 py-2.5 px-4">
        {servicePages.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to service ${i + 1}`}
            className={`rounded-full transition-all h-1.5 ${i === index ? "w-4 bg-[#f59e0b]" : "w-1.5 bg-gray-300 hover:bg-gray-400"}`}
          />
        ))}
      </div>
      <div className="px-6 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50">
        <Link
          to={servicesHref}
          className="flex items-center justify-center gap-2 text-sm font-bold text-[#f59e0b] hover:text-[#d97706] transition-colors"
        >
          {lang === "en" ? "View all services" : "Xem tất cả dịch vụ"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
