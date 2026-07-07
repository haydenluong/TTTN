import { useEffect, useState } from "react";
import { getBackgroundStyle } from "../shared/background";
import { getButtonStyle } from "../shared/buttonStyle";
import { getTitleStyle } from "../shared/titleStyle";

function useTypingEffect(titles, { typingSpeed = 100, deletingSpeed = 50, pauseTime = 1200 } = {}) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (titles.length === 0) return;
    const currentTitle = titles[titleIndex % titles.length];

    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < currentTitle.length) {
          setCharIndex(charIndex + 1);
        } else if (!isDeleting && charIndex === currentTitle.length) {
          setIsDeleting(true);
        } else if (isDeleting && charIndex > 0) {
          setCharIndex(charIndex - 1);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      },
      !isDeleting && charIndex === currentTitle.length ? pauseTime : isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, titleIndex, titles, typingSpeed, deletingSpeed, pauseTime]);

  if (titles.length === 0) return "";
  return titles[titleIndex % titles.length].slice(0, charIndex);
}

export default function Hero({
  badgeText,
  badgeTextStyle,
  rotatingTitles,
  rotatingTitlesStyle,
  staticTitle,
  description,
  descriptionStyle,
  primaryButton,
  secondaryButton,
  imageUrl,
  imageAlt,
  scrollHintText,
  scrollHintHref,
  background,
}) {
  const displayedText = useTypingEffect(rotatingTitles.map((t) => t.title));

  return (
    <section
      id="trang-chu"
      className="fullscreen-section relative flex items-center pt-24 pb-12 overflow-hidden"
      style={getBackgroundStyle(background)}
    >
      <div className="container max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left space-y-6 lg:pr-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-yellow-500/50 bg-yellow-500/10 backdrop-blur-sm">
              <span className="font-bold tracking-wider uppercase" style={getTitleStyle(badgeTextStyle)}>
                {badgeText}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.15] tracking-tight">
              <span className="inline-block min-h-[1.15em] align-bottom" style={getTitleStyle(rotatingTitlesStyle)}>
                {displayedText}
                <span
                  aria-hidden="true"
                  className="inline-block w-[3px] h-[0.85em] ml-1 bg-current align-middle animate-pulse"
                />
              </span>
              <br />
              <span
                className="inline-block mt-2"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #a8e6d8 55%, #F7931E 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {staticTitle}
              </span>
            </h1>
            <p className="leading-relaxed max-w-xl" style={getTitleStyle(descriptionStyle)}>
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <a
                href={primaryButton.href}
                className="px-8 py-3.5 hover:brightness-110 rounded-lg transition-all shadow-lg text-center shadow-yellow-500/30"
                style={getButtonStyle(primaryButton)}
              >
                {primaryButton.label}
              </a>
              {/* border/backdrop-blur là kiểu dáng cố định của nút "outline" — không cần field riêng */}
              <a
                href={secondaryButton.href}
                className="px-8 py-3.5 border border-white/20 rounded-lg transition-colors backdrop-blur-sm text-center hover:brightness-110"
                style={getButtonStyle(secondaryButton)}
              >
                {secondaryButton.label}
              </a>
            </div>
          </div>
          <div className="relative w-full flex justify-center">
            <div className="relative w-full max-w-none aspect-square">
              <img src={imageUrl} alt={imageAlt} className="w-full h-full object-contain" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-8 flex justify-center animate-bounce z-20">
        <a href={scrollHintHref} className="text-gray-300 hover:text-white flex flex-col items-center gap-1 transition-colors">
          <span className="text-sm font-medium tracking-wide">{scrollHintText}</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
