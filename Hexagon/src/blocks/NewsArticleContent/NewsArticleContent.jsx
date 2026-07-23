import { cornerRadiusToCss } from "../shared/cornerRadius";
import { getTitleStyle } from "../shared/titleStyle";
import { alignClass } from "../shared/alignment";

function CalendarIcon() {
  return (
    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function NewsArticleContent({
  title,
  titleAlignment,
  titleStyle,
  date,
  time,
  image,
  imageAlt,
  imageRadius,
  body,
  bodyStyle,
  hashtags,
  showCompanyInfo,
}) {
  const paragraphs = body.map((item) => item.text);

  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className={`px-6 sm:px-10 pt-8 pb-6 border-b border-gray-100 ${alignClass(titleAlignment)}`}>
        <h1 className="leading-tight mb-4" style={getTitleStyle(titleStyle)}>
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <CalendarIcon />
            {date}
          </span>
          {time && (
            <span className="flex items-center gap-1.5">
              <ClockIcon />
              {time}
            </span>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-10 py-10">
        <div className="max-w-none leading-relaxed space-y-4" style={getTitleStyle(bodyStyle)}>
          {paragraphs[0] && <p>{paragraphs[0]}</p>}
          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="w-full object-cover max-h-[420px]"
              style={{ borderRadius: cornerRadiusToCss(imageRadius) }}
            />
          )}
          {paragraphs.slice(1).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {hashtags.length > 0 && (
          <p className="text-sm text-yellow-600 mt-6">{hashtags.map((item) => item.tag).join(" ")}</p>
        )}

        {showCompanyInfo && (
          <div className="text-sm text-gray-500 border-t border-gray-100 mt-8 pt-6 space-y-1">
            <p className="font-semibold text-gray-800">HEXAGON CORPORATION</p>
            <p>Address: 615 Au Co Str, Tan Phu Ward, HCMC</p>
            <p>Hotline: +84 70 390 9333</p>
          </div>
        )}
      </div>
    </article>
  );
}
