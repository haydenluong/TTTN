import { getTitleStyle } from "../shared/titleStyle";
import { useScrollReveal } from "../shared/useScrollReveal";
import { alignClass } from "../shared/alignment";

// 2 logo này chưa có ảnh thật (Ecobook/Comoon) nên vẽ tay bằng SVG — khác với
// `logos` (ảnh thật), đây là chi tiết trang trí cố định, không phải nội dung
// admin cần sửa, giống cách CheckCircleIcon của ServiceFeatures được giữ cố định.
function EcobookLogo() {
  return (
    <div className="logo-card">
      <div className="custom-logo eco-logo">
        <svg viewBox="0 0 80 40" width="80" height="32" style={{ display: "block", margin: "0 auto 4px" }}>
          <path
            d="M 15 25 C 25 15, 38 15, 40 20 C 42 15, 55 15, 65 25 C 55 18, 42 18, 40 23 C 38 18, 25 18, 15 25 Z"
            fill="#22c55e"
          />
          <path
            d="M 18 18 C 26 10, 38 10, 40 15 C 42 10, 54 10, 62 18 C 54 12, 42 12, 40 17 C 38 12, 26 12, 18 18 Z"
            fill="#eab308"
          />
          <path
            d="M 22 11 C 28 5, 38 5, 40 10 C 42 5, 52 5, 58 11 C 52 7, 42 7, 40 12 C 38 7, 28 7, 22 11 Z"
            fill="#22c55e"
          />
        </svg>
        <div className="logo-text eco-text">ECOBOOK</div>
      </div>
    </div>
  );
}

function ComoonLogo() {
  return (
    <div className="logo-card">
      <div className="custom-logo comoon-logo">
        <svg viewBox="0 0 80 40" width="80" height="32" style={{ display: "block", margin: "0 auto 4px" }}>
          <path
            d="M 20 12 C 30 5, 50 5, 60 12 C 55 18, 45 18, 40 18 C 35 18, 25 18, 20 12 Z"
            fill="#15803d"
          />
          <path
            d="M 22 17 C 30 11, 50 11, 58 17 C 53 23, 47 23, 40 23 C 33 23, 27 23, 22 17 Z"
            fill="#eab308"
          />
          <path
            d="M 25 22 C 32 17, 48 17, 55 22 C 50 30, 45 32, 40 32 C 35 32, 30 30, 25 22 Z"
            fill="#15803d"
          />
        </svg>
        <div className="logo-text comoon-text">COMOON</div>
      </div>
    </div>
  );
}

function MarqueeTrack({ logos }) {
  return (
    <>
      {logos.map((logo) => (
        <div className="logo-card" key={logo.alt}>
          <img src={logo.imageUrl} alt={logo.alt} />
        </div>
      ))}
      <EcobookLogo />
      <ComoonLogo />
    </>
  );
}

export default function Partners({ sectionTitle, titleAlignment, sectionTitleStyle, logos, animate }) {
  const revealRef = useScrollReveal(0, animate);

  return (
    <div ref={revealRef} className="reveal sponsor-bar">
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`font-bold leading-tight mb-5 ${alignClass(titleAlignment)}`} style={getTitleStyle(sectionTitleStyle)}>
          {sectionTitle}
        </h2>
        <div className="logo-marquee">
          <div className="marquee-track">
            {/* track is duplicated back-to-back so the scroll animation loops seamlessly */}
            <MarqueeTrack logos={logos} />
            <MarqueeTrack logos={logos} />
          </div>
        </div>
      </div>
    </div>
  );
}
