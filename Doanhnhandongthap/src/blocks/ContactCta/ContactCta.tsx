import type { ReactNode } from "react";
import { getBackgroundStyle, type SectionBackground } from "../shared/background";
import { alignClass, type Alignment } from "../shared/alignment";
import { getTitleStyle, type TitleStyle } from "../shared/titleStyle";

export type ContactPill = {
  icon: string;
  label: string;
  href: string;
};

export type ContactCtaProps = {
  title: ReactNode;
  pills: ContactPill[];
  registerLabel: string;
  background: SectionBackground;
  titleAlign: Alignment;
  titleStyle: TitleStyle;
};

export default function ContactCta({
  title,
  pills,
  registerLabel,
  background,
  titleAlign,
  titleStyle,
}: ContactCtaProps) {
  return (
    <section
      className="relative overflow-hidden pt-[100px] pb-[160px] text-center"
      style={getBackgroundStyle(background)}
    >
      <div className="relative z-[2] w-full max-w-[90%] mx-auto">
        <h2 className={`font-extrabold leading-[1.5] ${alignClass(titleAlign)}`} style={getTitleStyle(titleStyle)}>
          {title}
        </h2>

        <div className="my-[45px] flex flex-wrap justify-center gap-[30px]">
          {pills.map((pill, i) => (
            <a
              key={i}
              href={pill.href}
              className="flex items-center gap-4 rounded-full border border-white/25 bg-white/75 px-[30px] py-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
            >
              <span className="text-lg">{pill.icon}</span>
              <span className="text-sm text-black/10">|</span>
              <span className="text-[15px] font-bold text-[#0B5077]">{pill.label}</span>
            </a>
          ))}
        </div>

        <button className="rounded-full bg-gradient-to-br from-[#0f2e5c] to-[#0d5c8a] px-[45px] py-4 text-[15px] font-bold text-white shadow-[0_8px_25px_rgba(15,46,92,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(15,46,92,0.45)]">
          {registerLabel}
        </button>
      </div>
    </section>
  );
}
