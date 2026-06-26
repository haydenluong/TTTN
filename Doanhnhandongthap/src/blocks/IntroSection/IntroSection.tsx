import { getBackgroundStyle, type SectionBackground } from "../shared/background";
import { StatNumber } from "../shared/statCountUp";
import { alignClass, type Alignment } from "../shared/alignment";
import { getTitleStyle, type TitleStyle } from "../shared/titleStyle";

export type IntroStat = {
  number: number;
  suffix?: string;
  desc: string;
};

export type IntroSectionProps = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  contentTitle: string;
  paragraphs: string[];
  visionLabel: string;
  visionText: string;
  missionLabel: string;
  missionText: string;
  stats: IntroStat[];
  background: SectionBackground;
  titleAlign: Alignment;
  titleStyle: TitleStyle;
};

export default function IntroSection({
  title,
  imageUrl,
  imageAlt,
  contentTitle,
  paragraphs,
  visionLabel,
  visionText,
  missionLabel,
  missionText,
  stats,
  background,
  titleAlign,
  titleStyle,
}: IntroSectionProps) {
  return (
    <section className="max-w-[1100px] mx-auto px-5 py-[60px]" style={getBackgroundStyle(background)}>
      <div className={`mb-[50px] ${alignClass(titleAlign)}`}>
        <h1 className="mb-2.5 font-bold" style={getTitleStyle(titleStyle)}>
          {title}
        </h1>
        <hr className="mx-auto h-1 w-[90px] rounded-[20px] bg-[#f7941d]" />
      </div>

      <div className="grid grid-cols-1 items-center gap-[50px] md:grid-cols-2">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full rounded-[14px] object-cover shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
        />

        <div>
          <h2 className="mb-5 text-[28px] font-bold text-[#0f5b94]">{contentTitle}</h2>

          {paragraphs.map((p, i) => (
            <p key={i} className="mb-[18px] text-[#555]">
              {p}
            </p>
          ))}

          <div className="mt-5 rounded-[10px] border-l-[5px] border-[#f7941d] bg-[#f7f8fa] p-[25px] text-[#333]">
            <p>
              <strong>{visionLabel}</strong> {visionText}
            </p>
            <br />
            <p>
              <strong>{missionLabel}</strong> {missionText}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[60px] grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-[14px] bg-white p-[30px] text-center shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
            <StatNumber
              value={stat.number}
              suffix={stat.suffix}
              className="mb-2.5 block text-[34px] font-bold text-[#0f5b94]"
            />
            <p className="text-[#666]">{stat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
