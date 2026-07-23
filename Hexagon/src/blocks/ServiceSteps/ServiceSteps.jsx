import { getTitleStyle } from "../shared/titleStyle";
import { useScrollReveal } from "../shared/useScrollReveal";
import { alignClass } from "../shared/alignment";

export default function ServiceSteps({ heading, headingAlignment, headingStyle, subheading, subheadingStyle, steps, animate }) {
  const revealRef = useScrollReveal(0, animate);

  return (
    <section ref={revealRef} className="reveal mb-20 lg:mb-32">
      <div className={`${alignClass(headingAlignment)} mb-16`}>
        <h2 className="font-bold mb-4" style={getTitleStyle(headingStyle)}>
          {heading}
        </h2>
        <p className="mt-2 max-w-2xl" style={{ ...(headingAlignment === "center" ? { margin: "0.5rem auto 0" } : { marginTop: "0.5rem" }), ...getTitleStyle(subheadingStyle) }}>
          {subheading}
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {steps.map((step, index) => (
          <div
            key={step}
            className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md"
          >
            <div className="text-3xl font-bold text-gold-accent mb-4">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h4 className="font-bold text-gray-900 mb-2">{step}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
