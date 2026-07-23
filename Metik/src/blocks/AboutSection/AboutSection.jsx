import { cornerRadiusToCss } from "../shared/cornerRadius";
import { useScrollReveal } from "../shared/useScrollReveal";
import { getBackgroundStyle } from "../shared/background";
import { TitleWithDivider } from "../shared/titleDivider";

export default function AboutSection({
  title,
  titleStyle = {},
  divider,
  row1Reverse,
  row2Reverse,
  row3Reverse,
  introText,
  introTextSize,
  introTextColor,
  row1ImageUrl,
  row1Radius,
  row1Text,
  row1TextSize,
  row1TextColor,
  row2Bullets,
  row2ImageUrl,
  row2Radius,
  bulletSize,
  bulletColor,
  row3ImageUrl,
  row3Radius,
  row3Text,
  row3TextSize,
  row3TextColor,
  background,
  bgColor,
}) {
  const ref = useScrollReveal();
  const bgStyle = background?.type ? getBackgroundStyle(background) : (bgColor ? { backgroundColor: bgColor } : {});
  const r1 = row1Reverse === "true";
  const r2 = row2Reverse === "true";
  const r3 = row3Reverse === "true";
  return (
    <section className="reveal px-6 py-14" ref={ref} style={bgStyle}>
      <div className="max-w-7xl mx-auto">
        <TitleWithDivider title={title} titleStyle={titleStyle} divider={divider} />

        {/* Intro */}
        {introText && (
          <p className="leading-relaxed mb-12 max-w-3xl" style={{ fontSize: introTextSize ? `${introTextSize}px` : undefined, color: introTextColor || "#374151" }}>{introText}</p>
        )}

        {/* Row 1: image / text */}
        <div className="grid grid-cols-2 gap-12 items-center mb-14">
          <div className={r1 ? "order-last" : "order-first"}>
            {row1ImageUrl ? (
              <img src={row1ImageUrl} alt="" className="w-full h-72 object-cover" style={{ borderRadius: row1Radius ? cornerRadiusToCss(row1Radius) : "1rem" }} />
            ) : (
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400" style={{ borderRadius: row1Radius ? cornerRadiusToCss(row1Radius) : "1rem" }}>Ảnh hàng 1</div>
            )}
          </div>
          <p className={`leading-relaxed ${r1 ? "order-first" : "order-last"}`} style={{ fontSize: row1TextSize ? `${row1TextSize}px` : undefined, color: row1TextColor || "#374151" }}>{row1Text}</p>
        </div>

        {/* Row 2: bullets / image */}
        <div className="grid grid-cols-2 gap-12 items-center mb-14">
          <ul className={`list-disc pl-5 space-y-4 ${r2 ? "order-last" : "order-first"}`}>
            {(row2Bullets || []).map((bullet, i) => (
              <li key={i} className="leading-relaxed" style={{ fontSize: bulletSize ? `${bulletSize}px` : undefined, color: bulletColor || "#4b5563" }}>
                {bullet}
              </li>
            ))}
          </ul>
          <div className={r2 ? "order-first" : "order-last"}>
            {row2ImageUrl ? (
              <img src={row2ImageUrl} alt="" className="w-full h-72 object-cover" style={{ borderRadius: row2Radius ? cornerRadiusToCss(row2Radius) : "1rem" }} />
            ) : (
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400" style={{ borderRadius: row2Radius ? cornerRadiusToCss(row2Radius) : "1rem" }}>Ảnh nhà máy</div>
            )}
          </div>
        </div>

        {/* Row 3: image / text */}
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className={r3 ? "order-last" : "order-first"}>
            {row3ImageUrl ? (
              <img src={row3ImageUrl} alt="" className="w-full h-72 object-cover" style={{ borderRadius: row3Radius ? cornerRadiusToCss(row3Radius) : "1rem" }} />
            ) : (
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400" style={{ borderRadius: row3Radius ? cornerRadiusToCss(row3Radius) : "1rem" }}>Ảnh hàng 3</div>
            )}
          </div>
          <p className={`leading-relaxed ${r3 ? "order-first" : "order-last"}`} style={{ fontSize: row3TextSize ? `${row3TextSize}px` : undefined, color: row3TextColor || "#374151" }}>{row3Text}</p>
        </div>
      </div>
    </section>
  );
}
