import { getBackgroundStyle, type SectionBackground } from "../shared/background";
import { alignClass, type Alignment } from "../shared/alignment";
import { type CardStyle } from "../shared/cardStyle";
import { cornerRadiusToCss } from "../shared/cornerRadius";
import { getTitleStyle, type TitleStyle } from "../shared/titleStyle";

export type ValueCard = {
  iconUrl: string;
  alt: string;
  title: string;
  desc: string;
};

export type ValuesSectionProps = {
  title: string;
  viewMoreLabel: string;
  viewMoreHref: string;
  cards: ValueCard[];
  background: SectionBackground;
  titleAlign: Alignment;
  titleStyle: TitleStyle;
  cardStyle: CardStyle;
};

// Vị trí xếp lệch (staggered) của 3 thẻ — không cho chỉnh sửa, gắn với đúng 3 card.
const stackPositionClass = [
  "absolute left-0 top-[50px] z-[1]",
  "absolute left-[260px] top-0 z-[2]",
  "absolute left-[130px] top-[295px] z-[3]",
];

export default function ValuesSection({
  title,
  viewMoreLabel,
  viewMoreHref,
  cards,
  background,
  titleAlign,
  titleStyle,
  cardStyle,
}: ValuesSectionProps) {
  return (
    <section className="relative pt-20 pb-[90px]" style={getBackgroundStyle(background)}>
      <div className="relative z-[1] w-full max-w-[90%] mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div className={`flex flex-1 ${alignClass(titleAlign, "justify")}`}>
            <h2 className="font-extrabold leading-[1.3]" style={getTitleStyle(titleStyle)}>
              {title}
            </h2>
          </div>
          <a
            href={viewMoreHref}
            className="group flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-[#0b4c8c] transition-colors hover:text-[#f43f5e]"
          >
            {viewMoreLabel}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="relative h-[610px] w-[490px]">
          {cards.slice(0, 3).map((card, i) => (
            <div
              key={i}
              className={`flex w-[225px] h-[300px] flex-col items-center justify-start border border-white/82 bg-white/50 px-[22px] pt-[30px] pb-[26px] text-center shadow-[0_16px_40px_rgba(12,74,115,0.10)] backdrop-blur-[16px] transition-all duration-300 hover:-translate-y-2 hover:bg-white/70 hover:shadow-[0_22px_52px_rgba(12,74,115,0.16)] ${stackPositionClass[i]}`}
              style={{ borderRadius: cornerRadiusToCss(cardStyle.borderRadius) }}
            >
              <div className="mb-[18px] flex h-[110px] w-[110px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(12,74,115,0.10)] transition-all duration-300 group-hover:scale-105">
                <img src={card.iconUrl} alt={card.alt} className="h-[100px] w-[100px] object-contain" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h4 className="font-bold" style={{ color: cardStyle.textColor, fontSize: cardStyle.fontSize }}>
                  {card.title}
                </h4>
                <p className="text-[13px] leading-[1.65] text-[#334155]">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
