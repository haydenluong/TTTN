import { Link } from "react-router-dom";
import { getBackgroundStyle } from "../shared/background";
import { getButtonStyle } from "../shared/buttonStyle";
import { getTitleStyle } from "../shared/titleStyle";
import { alignClass } from "../shared/alignment";

export default function ServiceCta({
  heading,
  headingAlignment,
  headingStyle,
  description,
  descriptionStyle,
  primaryButton,
  secondaryButton,
  background,
}) {
  const justifyClass = headingAlignment === "center" ? "justify-center" : headingAlignment === "right" ? "justify-end" : "justify-start";

  return (
    <section
      className={`rounded-2xl p-8 md:p-16 ${alignClass(headingAlignment)} border border-white/10 backdrop-blur-sm`}
      style={getBackgroundStyle(background)}
    >
      <h2 className="font-bold mb-6" style={getTitleStyle(headingStyle)}>
        {heading}
      </h2>
      {/* chỉ set margin ngang — margin shorthand sẽ đè mất mb-10 (khoảng cách với hàng nút) */}
      <p className="mb-10 max-w-2xl text-lg leading-relaxed" style={{ ...(headingAlignment === "center" ? { marginLeft: "auto", marginRight: "auto" } : {}), ...getTitleStyle(descriptionStyle) }}>
        {description}
      </p>
      <div className={`flex flex-col sm:flex-row gap-6 ${justifyClass}`}>
        <Link
          to={secondaryButton.href}
          className="px-10 py-3.5 border border-white/10 font-bold rounded-lg transition-all text-center hover:brightness-125"
          style={getButtonStyle(secondaryButton)}
        >
          {secondaryButton.label}
        </Link>
        <Link
          to={primaryButton.href}
          className="px-10 py-3.5 font-bold rounded-lg transition-all shadow-lg shadow-yellow-500/20 text-center hover:brightness-110"
          style={getButtonStyle(primaryButton)}
        >
          {primaryButton.label}
        </Link>
      </div>
    </section>
  );
}
