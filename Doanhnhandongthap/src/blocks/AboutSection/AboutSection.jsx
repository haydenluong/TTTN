import { useEffect, useRef, useState } from "react";
import { getBackgroundStyle } from "../shared/background";
import { paddingYStyle } from "../shared/spacing";
import { cornerRadiusToCss } from "../shared/cornerRadius";
import { getTitleStyle } from "../shared/titleStyle";

function radiusStyle(radius) {
  return { borderRadius: cornerRadiusToCss(radius) };
}

function chunk(items, size) {
  const groups = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

export default function AboutSection({
  leftCard,
  rightCard,
  arrowButton,
  background,
  decorativeImageUrl,
  spacing,
}) {
  const slides = chunk(rightCard.profiles, 3);
  const [active, setActive] = useState(0);
  const timerRef = useRef(undefined);

  const resetAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 6000);
  };

  useEffect(() => {
    resetAutoplay();
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const goTo = (i) => {
    setActive(i);
    resetAutoplay();
  };
  const change = (step) => goTo((active + step + slides.length) % slides.length);

  return (
    <section
      className="relative overflow-hidden"
      style={{ ...getBackgroundStyle(background), ...paddingYStyle(spacing) }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-bottom bg-no-repeat bg-contain"
        style={{ backgroundImage: `url('${decorativeImageUrl}')` }}
      />
      <div className="relative z-[1] w-full max-w-[1550px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div
          className="group relative flex min-h-[480px] flex-col overflow-hidden border-[1.5px] border-[rgba(0,198,255,0.25)] bg-white py-[50px] px-10 shadow-[0px_10px_30px_rgba(0,114,255,0.08)]"
          style={radiusStyle(leftCard.radius)}
        >
          <h2
            className="relative z-[3] mb-6 font-extrabold tracking-[0.03em]"
            style={getTitleStyle(leftCard.titleStyle)}
          >
            {leftCard.title}
          </h2>
          <p className="relative z-[3] max-w-[85%] text-[15px] leading-[1.8] text-[#1e293b]">
            {leftCard.text}
          </p>
          <img
            src={leftCard.cornerImageUrl}
            alt=""
            className="pointer-events-none absolute bottom-[-15px] left-[-15px] z-[2] w-[290px] opacity-95 transition-transform duration-300 group-hover:scale-[1.03] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] group-hover:opacity-100"
          />
          <img
            src={leftCard.veclbImageUrl}
            alt=""
            className="pointer-events-none absolute bottom-0 right-0 z-[1] w-[320px] opacity-70 transition-transform duration-300 group-hover:scale-[1.04] group-hover:opacity-85"
          />
        </div>

        <div
          className="relative flex min-h-[480px] flex-col overflow-hidden border-[1.5px] border-[rgba(0,198,255,0.25)] bg-white py-[50px] px-10 shadow-[0px_10px_30px_rgba(0,114,255,0.08)]"
          style={radiusStyle(rightCard.radius)}
        >
          <h2
            className="relative z-[3] mb-6 font-extrabold tracking-[0.03em]"
            style={getTitleStyle(rightCard.titleStyle)}
          >
            {rightCard.title}
          </h2>

          <div className="relative flex flex-grow items-center">
            {slides.map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`w-full flex-col gap-4 ${slideIndex === active ? "flex" : "hidden"}`}
              >
                {slide.map((p, i) => (
                  <div
                    key={i}
                    className="flex w-full items-center gap-5 rounded-[100px_20px_20px_100px] border border-white/55 bg-white/45 p-2 pl-2 pr-6 shadow-[0_4px_15px_rgba(10,37,64,0.03)] backdrop-blur-[10px] transition-[transform,box-shadow,background] duration-300 hover:-translate-y-0.5 hover:bg-white/65 hover:shadow-[0_8px_25px_rgba(10,37,64,0.08)]"
                  >
                    <div className="h-[110px] w-[110px] shrink-0 overflow-hidden rounded-full border-4 border-white shadow-[0_4px_12px_rgba(10,37,64,0.1)]">
                      <img src={p.avatarUrl} alt={p.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm leading-[1.4] text-[#1e293b]">
                        <span className="font-bold text-[#0B355B]">{rightCard.fieldLabels.name}</span>{" "}
                        <span className="font-medium">{p.name}</span>
                      </p>
                      <p className="text-sm leading-[1.4] text-[#1e293b]">
                        <span className="font-bold text-[#0B355B]">{rightCard.fieldLabels.clbRole}</span>{" "}
                        <span className="font-medium">{p.clbRole}</span>
                      </p>
                      <p className="text-sm leading-[1.4] text-[#1e293b]">
                        <span className="font-bold text-[#0B355B]">{rightCard.fieldLabels.companyRole}</span>{" "}
                        <span className="font-medium">{p.companyRole}</span>
                      </p>
                      <p className="text-sm leading-[1.4] text-[#1e293b]">
                        <span className="font-bold text-[#0B355B]">{rightCard.fieldLabels.company}</span>{" "}
                        <span className="font-medium">{p.company}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              onClick={() => change(-1)}
              className="flex h-9 w-9 items-center justify-center text-sm font-bold shadow-[0_4px_10px_rgba(10,37,64,0.05)] transition-colors hover:bg-[#0B5077] hover:text-white"
              style={{
                backgroundColor: arrowButton.bgColor,
                color: arrowButton.textColor,
                borderRadius: cornerRadiusToCss(arrowButton.borderRadius),
              }}
            >
              &#10094;
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <span
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                    i === active ? "w-12 bg-[#0B5077]" : "w-2 bg-[#cdeeff]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => change(1)}
              className="flex h-9 w-9 items-center justify-center text-sm font-bold shadow-[0_4px_10px_rgba(10,37,64,0.05)] transition-colors hover:bg-[#0B5077] hover:text-white"
              style={{
                backgroundColor: arrowButton.bgColor,
                color: arrowButton.textColor,
                borderRadius: cornerRadiusToCss(arrowButton.borderRadius),
              }}
            >
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
