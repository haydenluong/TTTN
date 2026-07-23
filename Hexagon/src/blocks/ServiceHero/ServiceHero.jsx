import { Link } from "react-router-dom";
import { getButtonStyle } from "../shared/buttonStyle";
import { getTitleStyle } from "../shared/titleStyle";

export default function ServiceHero({
  title,
  titleStyle,
  description,
  descriptionStyle,
  imageUrl,
  imageAlt,
  ctaButton,
  reverse,
}) {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-center mb-20 lg:mb-32">
      <div className={`text-left ${reverse === "true" ? "order-last" : "order-first"}`}>
        <h1 className="font-bold mb-6 leading-tight" style={getTitleStyle(titleStyle)}>
          {title}
        </h1>
        <p className="max-w-xl mb-10 leading-relaxed" style={getTitleStyle(descriptionStyle)}>
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={ctaButton.href}
            className="px-8 py-3.5 font-bold rounded-lg transition-all shadow-lg shadow-yellow-500/20 text-center hover:brightness-110"
            style={getButtonStyle(ctaButton)}
          >
            {ctaButton.label}
          </Link>
        </div>
      </div>
      <div className={`relative max-w-[600px] mx-auto w-full ${reverse === "true" ? "order-first" : "order-last"}`}>
        <div className="rounded-lg overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-500 aspect-[16/9]">
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
          )}
        </div>
      </div>
    </section>
  );
}
