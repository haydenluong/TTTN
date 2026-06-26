import { getBackgroundStyle, type SectionBackground } from "../shared/background";
import { alignClass, type Alignment } from "../shared/alignment";
import { paddingYStyle, type SectionSpacing } from "../shared/spacing";
import { StatNumber } from "../shared/statCountUp";
import { getTitleStyle, type TitleStyle } from "../shared/titleStyle";

export type Stat = {
  number: number;
  suffix?: string;
  desc: string;
};

export type StatsSectionProps = {
  title: string;
  bgLoopUrl: string;
  stats: Stat[];
  background: SectionBackground;
  titleAlign: Alignment;
  titleStyle: TitleStyle;
  spacing: SectionSpacing;
};

export default function StatsSection({
  title,
  bgLoopUrl,
  stats,
  background,
  titleAlign,
  titleStyle,
  spacing,
}: StatsSectionProps) {
  return (
    <section
      id="hoi-vien"
      className="relative overflow-hidden text-center"
      style={{ ...getBackgroundStyle(background), ...paddingYStyle(spacing) }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-full w-[750px] max-w-full -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-80 mix-blend-screen"
        style={{ backgroundImage: `url('${bgLoopUrl}')` }}
      />
      <div className="relative z-[2] w-full max-w-[90%] mx-auto">
        <h2
          className={`mb-[70px] font-extrabold tracking-[0.05em] [text-shadow:0_1px_2px_rgba(255,255,255,0.5)] ${alignClass(titleAlign)}`}
          style={getTitleStyle(titleStyle)}
        >
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-[30px] md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-[20px_10px] transition-transform duration-300 hover:-translate-y-1.5"
            >
              <StatNumber
                value={stat.number}
                suffix={stat.suffix}
                className="mb-4 font-serif text-[52px] font-bold leading-none text-[#0b2540]"
              />
              <p className="max-w-[250px] text-sm font-medium leading-[1.6] text-[#1e293b]">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
