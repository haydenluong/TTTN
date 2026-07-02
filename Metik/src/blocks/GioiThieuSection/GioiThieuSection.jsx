import { useScrollReveal } from "../shared/useScrollReveal";
import { getBackgroundStyle } from "../shared/background";

export default function GioiThieuSection({ paragraph1, paragraph1Size, paragraph1Color, paragraph2, paragraph2Size, paragraph2Color, videoUrl, background }) {
  const ref = useScrollReveal();
  const bgStyle = background?.type ? getBackgroundStyle(background) : { backgroundColor: "#ffffff" };

  return (
    <section
      className="reveal px-6 py-14"
      ref={ref}
      style={{ ...bgStyle, borderBottom: "5px solid #f7941d" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-12 items-center">
          {/* Video - left */}
          <div className="overflow-hidden rounded-2xl bg-gray-900 aspect-video flex items-center justify-center">
            {videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-gray-500 text-sm">Chưa có video</span>
            )}
          </div>

          {/* Text - right */}
          <div className="flex flex-col gap-6 leading-relaxed">
            {paragraph1 && <p style={{ fontSize: paragraph1Size ? `${paragraph1Size}px` : undefined, color: paragraph1Color || "#374151" }}>{paragraph1}</p>}
            {paragraph2 && <p style={{ fontSize: paragraph2Size ? `${paragraph2Size}px` : undefined, color: paragraph2Color || "#374151" }}>{paragraph2}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
