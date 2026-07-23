import { useScrollReveal } from "../shared/useScrollReveal";
import { getBackgroundStyle } from "../shared/background";
import { TitleWithDivider } from "../shared/titleDivider";

function boldMetik(text) {
  if (!text) return null;
  return text.split(/\b(metik)\b/gi).map((part, i) =>
    part.toLowerCase() === "metik" ? <strong key={i}>{part}</strong> : part
  );
}

export default function AboutVideo({ title, titleStyle = {}, divider, reverse, paragraph1, paragraph1Size, paragraph1Color, paragraph2, paragraph2Size, paragraph2Color, videoUrl, background, bgColor }) {
  const ref = useScrollReveal();
  const bgStyle = background?.type ? getBackgroundStyle(background) : (bgColor ? { backgroundColor: bgColor } : {});
  const rev = reverse === "true";
  return (
    <section className="reveal px-6 py-14" ref={ref} style={bgStyle}>
      <div className="max-w-7xl mx-auto">
        <TitleWithDivider title={title} titleStyle={titleStyle} divider={divider} className="mb-10" />

        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className={`flex flex-col gap-5 ${rev ? "order-last" : "order-first"}`}>
            {paragraph1 && <p className="leading-relaxed" style={{ fontSize: paragraph1Size ? `${paragraph1Size}px` : undefined, color: paragraph1Color || "#374151" }}>{boldMetik(paragraph1)}</p>}
            {paragraph2 && <p className="leading-relaxed" style={{ fontSize: paragraph2Size ? `${paragraph2Size}px` : undefined, color: paragraph2Color || "#374151" }}>{boldMetik(paragraph2)}</p>}
          </div>

          {/* Video */}
          <div className={`overflow-hidden rounded-2xl bg-black aspect-video ${rev ? "order-first" : "order-last"}`}>
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Video
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
