import { Link } from "react-router-dom";
import { getBackgroundStyle } from "../shared/background";
import { getButtonStyle } from "../shared/buttonStyle";
import { getTitleStyle } from "../shared/titleStyle";
import { useScrollReveal } from "../shared/useScrollReveal";
import { dividerMarginStyle } from "../shared/titleDivider";

function CalendarIcon() {
  return (
    <svg className="w-3 h-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

import { alignClass } from "../shared/alignment";

export default function News({
  sectionTitle,
  titleAlignment,
  sectionTitleStyle,
  description,
  descriptionStyle,
  divider,
  articles,
  readMoreLabel,
  viewAllButton,
  background,
  animate,
}) {
  const revealRef = useScrollReveal(0, animate);

  return (
    <section id="tin-tuc" ref={revealRef} className="reveal py-10 md:py-16" style={getBackgroundStyle(background)}>
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`${alignClass(titleAlignment)} mb-8 md:mb-12`}>
          <h2 className="font-bold leading-tight" style={getTitleStyle(sectionTitleStyle)}>
            {sectionTitle}
          </h2>
          <p className="mt-2 leading-relaxed px-4" style={getTitleStyle(descriptionStyle)}>
            {description}
          </p>
          <div
            className="h-1 rounded-full mt-4"
            style={{
              width: `${divider?.width || 64}px`,
              backgroundColor: divider?.color || "#fbbf24",
              ...dividerMarginStyle(divider?.align || "center"),
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          {articles.map((article, index) => {
            const spanClass = index < 2 ? "lg:col-span-3" : "lg:col-span-2";

            return (
              <Link
                key={article.title}
                to={article.href}
                className={`${spanClass} group bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-yellow-400/50`}
              >
                <div className="overflow-hidden h-48 sm:h-52 bg-gradient-to-br from-slate-200 to-slate-300">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">{article.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <CalendarIcon />
                      {article.date}
                    </span>
                    <span className="text-yellow-600 text-xs font-semibold group-hover:underline">{readMoreLabel}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to={viewAllButton.href}
            className="inline-flex items-center gap-2 px-8 py-3 font-bold rounded-lg transition-all duration-200 hover:ring-2 hover:ring-green-500"
            style={getButtonStyle(viewAllButton)}
          >
            {viewAllButton.label}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
