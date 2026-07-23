import { getBackgroundStyle } from "../shared/background";
import { getTitleStyle } from "../shared/titleStyle";
import { useScrollReveal } from "../shared/useScrollReveal";

export default function About({
  sectionTitle,
  sectionTitleStyle,
  description,
  descriptionStyle,
  imageUrl,
  imageAlt,
  quoteText,
  quoteTextStyle,
  quoteAuthor,
  pillars,
  pillarTitleStyle,
  background,
  animate,
  reverse,
}) {
  const revealRef = useScrollReveal(0, animate);

  return (
    <section
      id="gioi-thieu"
      ref={revealRef}
      className="reveal py-16 lg:py-24"
      style={getBackgroundStyle(background)}
    >
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={` grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center `} >
          <div className={`w-full h-full flex items-center justify-center relative ${reverse === "true" ? "order-first" : "order-last"}`}>
            <div className="relative p-3 w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl transform rotate-2" />
              <img
                src={imageUrl}
                alt={imageAlt}
                className="relative rounded-lg shadow-2xl object-cover max-h-[300px] sm:max-h-[400px] md:max-h-[500px] w-full"
              />
            </div>
            <div className="absolute -bottom-4 right-4 md:bottom-8 md:-right-8 bg-white p-5 rounded-xl shadow-[0_10px_40px_rgba(217,119,6,0.3)] max-w-[280px] z-10 transition-transform hover:-translate-y-2 duration-300">
              <p className="text-sm md:text-base italic font-medium leading-relaxed" style={getTitleStyle(quoteTextStyle)}>
                {quoteText}
              </p>
              <p className="text-yellow-500 text-xs mt-2 font-bold uppercase tracking-wider text-right">— {quoteAuthor}</p>
            </div>
          </div>

          <div className="text-left order-1 md:order-2">
            <h2 className="font-bold mb-4 leading-tight" style={getTitleStyle(sectionTitleStyle)}>{sectionTitle}</h2>
            <p className="mb-6 leading-relaxed" style={getTitleStyle(descriptionStyle)}>
              {description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2" style={getTitleStyle(pillarTitleStyle)}>{pillar.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
