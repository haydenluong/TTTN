import { useScrollReveal } from "../shared/useScrollReveal";
import { getBackgroundStyle } from "../shared/background";

export default function AboutVideo({ title, titleStyle = {}, paragraph1, paragraph1Size, paragraph1Color, paragraph2, paragraph2Size, paragraph2Color, videoUrl, background, bgColor }) {
  const ref = useScrollReveal();
  const bgStyle = background?.type ? getBackgroundStyle(background) : { backgroundColor: bgColor || "#fef6e0" };
  return (
    <section className="reveal px-6 py-14" ref={ref} style={bgStyle}>
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-10">
          <h2 className="uppercase mb-2" style={{ color: titleStyle.textColor || "#1a7a2e", fontSize: titleStyle.fontSize ? `${titleStyle.fontSize}px` : "1.5rem", fontWeight: "bold" }}>
            {title}
          </h2>
          <div className="w-14 h-[4px] rounded" style={{ backgroundColor: "#f5a100" }} />
        </div>

        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="flex flex-col gap-5">
            {paragraph1 && <p className="leading-relaxed" style={{ fontSize: paragraph1Size ? `${paragraph1Size}px` : undefined, color: paragraph1Color || "#374151" }}>{paragraph1}</p>}
            {paragraph2 && <p className="leading-relaxed" style={{ fontSize: paragraph2Size ? `${paragraph2Size}px` : undefined, color: paragraph2Color || "#374151" }}>{paragraph2}</p>}
          </div>

          {/* Video */}
          <div className="overflow-hidden rounded-2xl bg-black aspect-video">
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
