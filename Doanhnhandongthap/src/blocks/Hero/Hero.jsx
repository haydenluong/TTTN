import { getBackgroundStyle } from "../shared/background";
import { getButtonStyle } from "../shared/buttonStyle";
import { cornerRadiusToCss } from "../shared/cornerRadius";
import { getTitleStyle } from "../shared/titleStyle";

const justifyByPosition = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function Hero({
  subtitle,
  subtitleStyle,
  title,
  description,
  descriptionFontSize,
  descriptionTextColor,
  ctaTargetId,
  background,
  card,
  button,
}) {
  return (
    <section
      className="
        relative flex items-center
        h-screen min-h-[700px] pt-20
        bg-cover bg-center bg-blend-screen
        before:content-[''] before:absolute before:inset-0 before:z-[1]
        before:bg-gradient-to-r before:from-[rgba(4,30,60,0.45)] before:via-[rgba(4,30,60,0.25)] before:to-transparent
        after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-40 after:z-[2]
        after:bg-gradient-to-b after:from-transparent after:to-[#a8dfff]
      "
      style={getBackgroundStyle(background)}
    >
      <div className={`relative z-[3] w-full max-w-[90%] mx-auto flex ${justifyByPosition[card.position]}`}>
        <div
          className="
            flex flex-col items-center gap-8
            w-full max-w-[620px] py-12 px-10
            bg-white/19 outline outline-1 outline-white/32 -outline-offset-1
            backdrop-blur-[9px]
            shadow-[0_20px_50px_rgba(0,0,0,0.25)]
          "
          style={{
            borderRadius: cornerRadiusToCss(card.radius),
          }}
        >
          <div className="flex flex-col text-left gap-3">
            <h3
              className="font-medium uppercase tracking-[0.12em]"
              style={getTitleStyle(subtitleStyle)}
            >
              {subtitle}
            </h3>

            <h1
              className="bg-gradient-to-br from-white from-40% to-[#ffd700] bg-clip-text text-transparent text-[80px] font-extrabold leading-[1.1]"
              style={{ filter: "drop-shadow(0 0 12px rgba(255,215,0,0.45))" }}
            >
              {title}
            </h1>

            <div className="leading-[1.7]" style={{ color: descriptionTextColor, fontSize: `${descriptionFontSize}px` }}>
              {description}
            </div>
          </div>

          <button
            className="py-5 px-9 font-semibold shadow-[0_10px_25px_rgba(0,114,255,0.35)] transition-all hover:-translate-y-[3px] hover:shadow-[0_15px_35px_rgba(0,114,255,0.55)]"
            style={getButtonStyle(button)}
            onClick={() => document.getElementById(ctaTargetId)?.scrollIntoView({ behavior: "smooth" })}
          >
            {button.label}
          </button>
        </div>
      </div>
    </section>
  );
}
