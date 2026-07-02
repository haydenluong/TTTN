import { cornerRadiusToCss } from "../shared/cornerRadius";
import { useScrollReveal } from "../shared/useScrollReveal";
import { getBackgroundStyle } from "../shared/background";

export default function AboutSection({
  title,
  titleStyle = {},
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
  const bgStyle = background?.type ? getBackgroundStyle(background) : { backgroundColor: bgColor || "#fdf5e8" };
  return (
    <section className="reveal px-6 py-14" ref={ref} style={bgStyle}>
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h2
            className="uppercase mb-2"
            style={{ color: titleStyle.textColor || "#1a7a2e", fontSize: titleStyle.fontSize ? `${titleStyle.fontSize}px` : "1.5rem", fontWeight: "bold" }}
          >
            {title}
          </h2>
          <div className="w-14 h-[4px] rounded" style={{ backgroundColor: "#f5a100" }} />
        </div>

        {/* Intro */}
        {introText && (
          <p className="leading-relaxed mb-12 max-w-3xl" style={{ fontSize: introTextSize ? `${introTextSize}px` : undefined, color: introTextColor || "#374151" }}>{introText}</p>
        )}

        {/* Row 1: image left, text right */}
        <div className="grid grid-cols-2 gap-12 items-center mb-14">
          <div className="overflow-hidden" style={{ borderRadius: row1Radius ? cornerRadiusToCss(row1Radius) : "1rem" }}>
            {row1ImageUrl ? (
              <img src={row1ImageUrl} alt="" className="w-full h-72 object-cover" />
            ) : (
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">
                Ảnh hàng 1
              </div>
            )}
          </div>
          <p className="leading-relaxed" style={{ fontSize: row1TextSize ? `${row1TextSize}px` : undefined, color: row1TextColor || "#374151" }}>{row1Text}</p>
        </div>

        {/* Row 2: bullets left, factory image right */}
        <div className="grid grid-cols-2 gap-12 items-center mb-14">
          <ul className="list-disc pl-5 space-y-4">
            {(row2Bullets || []).map((bullet, i) => (
              <li key={i} className="leading-relaxed" style={{ fontSize: bulletSize ? `${bulletSize}px` : undefined, color: bulletColor || "#4b5563" }}>
                {bullet}
              </li>
            ))}
          </ul>
          <div className="overflow-hidden" style={{ borderRadius: row2Radius ? cornerRadiusToCss(row2Radius) : "1rem" }}>
            {row2ImageUrl ? (
              <img src={row2ImageUrl} alt="" className="w-full h-72 object-cover" />
            ) : (
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">
                Ảnh nhà máy
              </div>
            )}
          </div>
        </div>

        {/* Row 3: person image left, text right */}
        <div className="grid grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden" style={{ borderRadius: row3Radius ? cornerRadiusToCss(row3Radius) : "1rem" }}>
            {row3ImageUrl ? (
              <img src={row3ImageUrl} alt="" className="w-full h-72 object-cover" />
            ) : (
              <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">
                Ảnh hàng 3
              </div>
            )}
          </div>
          <p className="leading-relaxed" style={{ fontSize: row3TextSize ? `${row3TextSize}px` : undefined, color: row3TextColor || "#374151" }}>{row3Text}</p>
        </div>
      </div>
    </section>
  );
}
