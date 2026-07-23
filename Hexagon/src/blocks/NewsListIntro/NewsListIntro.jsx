import { getTitleStyle } from "../shared/titleStyle";
import { alignClass } from "../shared/alignment";

export default function NewsListIntro({ sectionTitle, titleAlignment, sectionTitleStyle, description, descriptionStyle }) {
  return (
    <section className={`mb-10 ${alignClass(titleAlignment)}`}>
      <h1 className="leading-tight mb-3" style={getTitleStyle(sectionTitleStyle)}>
        {sectionTitle}
      </h1>
      <p className="max-w-2xl leading-relaxed" style={getTitleStyle(descriptionStyle)}>
        {description}
      </p>
      <div className="w-16 h-1 bg-gold-accent mt-5 rounded-full" style={titleAlignment === "center" ? { margin: "1.25rem auto 0" } : titleAlignment === "right" ? { marginLeft: "auto", marginRight: 0, marginTop: "1.25rem" } : { marginTop: "1.25rem" }} />
    </section>
  );
}
