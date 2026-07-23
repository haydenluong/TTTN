import { getBackgroundStyle } from "../shared/background";
import { alignClass } from "../shared/alignment";
import { cornerRadiusToCss } from "../shared/cornerRadius";
import { getButtonStyle } from "../shared/buttonStyle";
import { paddingYStyle } from "../shared/spacing";
import { getTitleStyle } from "../shared/titleStyle";

export default function TeamsSection({
  title,
  subtitle,
  teams,
  background,
  titleAlign,
  titleStyle,
  subtitleStyle,
  cardStyle,
  button,
  spacing,
}) {
  return (
    <section
      id="hoat-dong-ban"
      className="text-center"
      style={{ ...getBackgroundStyle(background), ...paddingYStyle(spacing) }}
    >
      <div className="w-full max-w-[90%] mx-auto">
        <h2 className={`font-extrabold ${alignClass(titleAlign)}`} style={getTitleStyle(titleStyle)}>
          {title}
        </h2>
        <h2 className={`mb-12 font-bold ${alignClass(titleAlign)}`} style={getTitleStyle(subtitleStyle)}>
          {subtitle}
        </h2>

        <div className="flex flex-wrap justify-center gap-[30px]">
          {teams.map((team, i) => (
            <div
              key={i}
              className="group flex min-h-[270px] w-full grow-0 shrink basis-[360px] flex-col items-center bg-gradient-to-b from-[#2CB2FF] to-[#0B5077] p-6 shadow-[0_15px_35px_rgba(12,74,115,0.25)] transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-[#21adff] hover:to-[#0e5685] hover:shadow-[0_25px_45px_rgba(12,74,115,0.4)]"
              style={{ borderRadius: cornerRadiusToCss(cardStyle.borderRadius) }}
            >
              <div className="mb-1 flex h-[100px] w-full items-center justify-center">
                <img
                  src={team.iconUrl}
                  alt={team.alt}
                  className="h-[70px] w-auto max-w-full object-contain opacity-95 brightness-0 invert transition-transform duration-300 group-hover:scale-[1.08]"
                />
              </div>
              <h4
                className="mb-6 font-bold [text-shadow:0_1px_2px_rgba(0,0,0,0.15)]"
                style={{ color: cardStyle.textColor, fontSize: `${cardStyle.fontSize}px` }}
              >
                {team.title}
              </h4>
              <button
                className="flex items-center gap-2 border border-white/40 px-7 py-2.5 font-semibold transition-all duration-300 hover:bg-white hover:text-[#0c4c73] hover:shadow-[0_5px_15px_rgba(255,255,255,0.2)]"
                style={getButtonStyle(button)}
              >
                {button.label}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
