import { getBackgroundStyle, type SectionBackground } from "../shared/background";
import { alignClass, type Alignment } from "../shared/alignment";
import { type CardStyle } from "../shared/cardStyle";
import { paddingYStyle, type SectionSpacing } from "../shared/spacing";
import { cornerRadiusToCss } from "../shared/cornerRadius";
import { getTitleStyle, type TitleStyle } from "../shared/titleStyle";

export type NewsCard = {
  imageUrl: string;
  alt: string;
  badge?: string;
  date: string;
  title: string;
  desc: string;
  href: string;
  large?: boolean;
};

export type NewsSectionProps = {
  title: string;
  viewMoreLabel: string;
  cards: NewsCard[];
  background: SectionBackground;
  titleAlign: Alignment;
  titleStyle: TitleStyle;
  cardStyle: CardStyle;
  spacing: SectionSpacing;
};

export default function NewsSection({
  title,
  viewMoreLabel,
  cards,
  background,
  titleAlign,
  titleStyle,
  cardStyle,
  spacing,
}: NewsSectionProps) {
  return (
    <section
      id="tin-tuc"
      style={{ ...getBackgroundStyle(background), ...paddingYStyle(spacing) }}
    >
      <div className="w-full max-w-[90%] mx-auto">
        <div className="mb-[50px] flex items-end justify-between border-b border-black/[0.06] pb-4">
          <h2 className={`font-extrabold ${alignClass(titleAlign)}`} style={getTitleStyle(titleStyle)}>
            {title}
          </h2>
          <a href="#" className="group flex items-center gap-1.5 text-sm font-bold text-[#0B355B] transition-colors hover:text-[#f43f5e]">
            {viewMoreLabel}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="grid grid-cols-6 gap-[30px]">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`group flex flex-col overflow-hidden border border-[#eef3f7] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:border-[#dbeafe] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] ${
                card.large ? "col-span-6 md:col-span-3" : "col-span-3 md:col-span-2 min-h-[380px]"
              }`}
              style={{ borderRadius: cornerRadiusToCss(cardStyle.borderRadius) }}
            >
              <div className={`relative w-full overflow-hidden ${card.large ? "h-[220px]" : "h-[170px]"}`}>
                <img
                  src={card.imageUrl}
                  alt={card.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {card.badge && (
                  <span className="absolute right-[15px] top-[15px] rounded-xl bg-gradient-to-br from-[#ffd700] to-[#f59e0b] px-3 py-1 text-[11px] font-bold text-[#0B5077] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                    {card.badge}
                  </span>
                )}
              </div>
              <div className="relative flex flex-grow flex-col p-6">
                <span className="mb-2.5 text-xs font-medium text-[#64748b]">{card.date}</span>
                <h4
                  className="mb-3 font-bold leading-[1.4]"
                  style={{ color: cardStyle.textColor, fontSize: cardStyle.fontSize }}
                >
                  {card.title}
                </h4>
                <p className="mb-5 text-[13px] leading-[1.6] text-[#64748b]">{card.desc}</p>
                {card.large ? (
                  <a
                    href={card.href}
                    className="group mt-auto flex items-center gap-1.5 text-[13px] font-bold text-[#0B355B] transition-colors hover:text-[#f43f5e]"
                  >
                    {viewMoreLabel}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                ) : (
                  <a
                    href={card.href}
                    className="absolute bottom-5 right-6 flex h-8 w-8 items-center justify-center text-lg text-[#0B355B]"
                  >
                    ➔
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
