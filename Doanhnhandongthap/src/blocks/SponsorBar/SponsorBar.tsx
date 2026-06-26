import { getBackgroundStyle, type SectionBackground } from "../shared/background";
import { alignClass, type Alignment } from "../shared/alignment";
import { paddingYStyle, type SectionSpacing } from "../shared/spacing";
import { getTitleStyle, type TitleStyle } from "../shared/titleStyle";

export type SponsorBarLogo = {
  imageUrl: string;
  alt: string;
  icon?: string;
  label?: string;
};

export type SponsorBarProps = {
  title: string;
  logos: SponsorBarLogo[];
  background: SectionBackground;
  titleAlign: Alignment;
  titleStyle: TitleStyle;
  spacing: SectionSpacing;
};

export default function SponsorBar({ title, logos, background, titleAlign, titleStyle, spacing }: SponsorBarProps) {
  // tao array voi 3 items cua logos duplicated -> 6 items de tao hieu ung scroll lien tuc
  const track = [...logos, ...logos];

  return (
    <section
      className="relative z-10 overflow-hidden text-center"
      style={{ ...getBackgroundStyle(background), ...paddingYStyle(spacing) }}
    >
      <div className="w-full max-w-[90%] mx-auto">
        <h2
          className={`mb-7 px-5 font-extrabold uppercase tracking-wide ${alignClass(titleAlign)}`}
          style={getTitleStyle(titleStyle)}
        >
          {title}
        </h2>

        <div className="relative flex w-full overflow-hidden before:content-[''] before:absolute before:inset-y-0 before:left-0 before:z-[2] before:w-[150px] before:bg-gradient-to-r before:from-[#cdeeff] before:to-transparent after:content-[''] after:absolute after:inset-y-0 after:right-0 after:z-[2] after:w-[150px] after:bg-gradient-to-l after:from-[#e6efff] after:to-transparent">
          <div className="flex w-max gap-6 animate-[marquee-scroll_24s_linear_infinite] hover:[animation-play-state:paused]">
            {track.map((logo, i) => (
              <div
                key={i}
                className="flex h-[108px] w-[180px] shrink-0 flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-[0_4px_12px_rgba(10,37,64,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(10,37,64,0.08)]"
              >
                {logo.imageUrl ? (
                  <img
                    src={logo.imageUrl}
                    alt={logo.alt}
                    className="max-h-16 max-w-[140px] object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    {logo.icon && (
                      <div
                        className="mb-0.5"
                        dangerouslySetInnerHTML={{ __html: logo.icon }}
                      />
                    )}
                    <span className="text-[11px] font-extrabold tracking-[0.08em] text-[#15803d]">
                      {logo.label}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
