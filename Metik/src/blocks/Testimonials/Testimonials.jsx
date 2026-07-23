function StarRating({ count = 5 }) {
  return (
    <div className="flex justify-start gap-0.5 mb-3">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-5 h-5" fill="#f5a100">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

import { useScrollReveal } from "../shared/useScrollReveal";
import { getBackgroundStyle } from "../shared/background";
import { TitleWithDivider } from "../shared/titleDivider";

export default function Testimonials({ title, titleStyle = {}, divider, testimonials = [], background, bgColor }) {
  const ref = useScrollReveal();
  const bgStyle = background?.type ? getBackgroundStyle(background) : (bgColor ? { backgroundColor: bgColor } : {});
  return (
    <section className="reveal px-6 py-14" ref={ref} style={bgStyle}>
      <div className="max-w-7xl mx-auto">
        <TitleWithDivider title={title} titleStyle={titleStyle} divider={divider} className="mb-10" />

        <div className="grid grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="flex items-start gap-5">
              {/* Avatar */}
              <div className="shrink-0 w-20 h-20 rounded-full overflow-hidden" style={{ border: "3px solid #f5a100" }}>
                {t.avatarUrl
                  ? <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-200" />
                }
              </div>
              {/* Content */}
              <div className="flex flex-col">
                <StarRating count={t.stars || 5} />
                <p className="italic leading-relaxed mb-2" style={{ fontSize: t.quoteSize ? `${t.quoteSize}px` : undefined, color: t.quoteColor || "#4b5563" }}>
                  {t.quote}
                </p>
                <p className="font-bold text-gray-900">
                  {t.name}{t.role && <>, {t.role}</>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
