import { getTitleStyle } from "../shared/titleStyle";
import { useScrollReveal } from "../shared/useScrollReveal";
import { alignClass } from "../shared/alignment";

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function ServiceFeatures({ heading, headingAlignment, headingStyle, features, featureTitleStyle, animate }) {
  const revealRef = useScrollReveal(0, animate);
  // giống ServicePageTemplate gốc: chỉ 3 feature đầu hiện dạng thẻ icon,
  // feature thứ 4 trở đi (nếu admin thêm qua Puck) hiện dạng list ngang
  const cardFeatures = features.length > 3 ? features.slice(0, 3) : features;
  const listFeatures = features.length > 3 ? features.slice(3) : [];

  return (
    <section ref={revealRef} className="reveal mb-20 lg:mb-32">
      <div className={`${alignClass(headingAlignment)} mb-16`}>
        <h2 className="font-bold mb-4" style={getTitleStyle(headingStyle)}>
          {heading}
        </h2>
        <div className="w-16 h-1 bg-gold-accent rounded-full" style={headingAlignment === "center" ? { margin: "0 auto" } : headingAlignment === "right" ? { marginLeft: "auto" } : {}} />
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {cardFeatures.map((feature) => (
          <div
            key={feature.title}
            className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 transition-all hover:shadow-md hover:border-gold-accent/40 group"
          >
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-bold mb-4" style={getTitleStyle(featureTitleStyle)}>
              {feature.title}
            </h4>
            <p className="text-gray-700 text-base leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
      {listFeatures.length > 0 && (
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {listFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-gold-accent/30 transition-colors group"
            >
              <CheckCircleIcon className="w-6 h-6 text-gold-accent mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-gray-700 text-base leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
