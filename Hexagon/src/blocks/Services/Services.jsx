import { Link } from "react-router-dom";
import { alignClass } from "../shared/alignment";
import { getBackgroundStyle } from "../shared/background";
import { getTitleStyle } from "../shared/titleStyle";
import { useScrollReveal } from "../shared/useScrollReveal";

export default function Services({
  sectionTitle,
  titleAlignment,
  sectionTitleStyle,
  sectionDescription,
  sectionDescriptionStyle,
  hoverImageUrl,
  cards,
  cardTitleStyle,
  cardDescStyle,
  background,
  animate,
}) {
  const revealRef = useScrollReveal(0, animate);
  return (
    <section ref={revealRef} id="dich-vu" className="py-8 reveal" style={getBackgroundStyle(background)}>
      <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className={`${alignClass(titleAlignment)} mb-4`}>
          <h2 className="font-bold leading-tight" style={getTitleStyle(sectionTitleStyle)}>{sectionTitle}</h2>
          <p className="mt-2 leading-relaxed px-4" style={getTitleStyle(sectionDescriptionStyle)}>
            {sectionDescription}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {cards.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              className="group relative block w-full h-[400px] rounded-xl overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              {/* background color/gradient/image as base */}
              {service.background && (
                <div className={`absolute inset-0 w-full h-full`} style={getBackgroundStyle(service.background)} />
              )}
              {/* hover image that fades in on hover */}
              <img
                src={hoverImageUrl}
                aria-hidden="true"
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-out [will-change:opacity] group-hover:opacity-100"
              />
              {/* light gradient overlay for additional text readability */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.25))`
                }}
              />
              {/* content overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <div className="transform translate-y-0">
                  <h3
                    className="font-bold mb-0 group-hover:mb-3 transition-all duration-300"
                    style={getTitleStyle(cardTitleStyle)}
                  >
                    {service.title}
                  </h3>
                  <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                    <p className="mb-4 line-clamp-3" style={getTitleStyle(cardDescStyle)}>
                      {service.desc}
                    </p>
                    <span className="inline-block font-bold text-sm" style={{ color: service.titleColor || "#eab308" }}>
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
