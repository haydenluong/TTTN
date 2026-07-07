import { getBackgroundStyle } from "../shared/background";
import { getTitleStyle } from "../shared/titleStyle";
import { useScrollReveal } from "../shared/useScrollReveal";

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

// icon cố định theo type — không phải field vì mỗi loại chỉ có 1 icon phù hợp
const ICONS = { location: <LocationIcon />, email: <EmailIcon />, phone: <PhoneIcon /> };

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full border border-teal-500/40 flex items-center justify-center bg-teal-500/10">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        <p className="text-black text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function Contact({
  sectionTitle,
  sectionTitleStyle,
  description,
  descriptionStyle,
  reverse,
  infoRows,
  socialLinks,
  mapEmbedUrl,
  background,
  animate,
}) {
  const revealRef = useScrollReveal(0, animate);
  const isReversed = reverse === "true" || reverse === true;

  return (
    <section
      id="lien-he"
      ref={revealRef}
      className="reveal py-10 lg:py-24"
      style={{ scrollMarginTop: "72px", ...getBackgroundStyle(background) }}
    >
      <div className="container max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className={`flex flex-col lg:mt-10 gap-6 ${isReversed ? "md:order-2" : "md:order-1"}`}>
            <div>
              <h2 className="font-bold mb-2" style={getTitleStyle(sectionTitleStyle)}>
                {sectionTitle}
              </h2>
              <p className="leading-relaxed" style={getTitleStyle(descriptionStyle)}>
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              {infoRows.map((row) => (
                <InfoRow key={row.label} icon={ICONS[row.icon]} label={row.label} value={row.value} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 font-bold rounded-lg transition-all duration-300 border border-teal-500/30 hover:border-teal-500/50 text-sm shadow-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className={`w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-xl ${isReversed ? "md:order-1" : "md:order-2"}`}>
            <iframe title="Hexagon Corporation location" className="w-full h-full" src={mapEmbedUrl} />
          </div>
        </div>
      </div>
    </section>
  );
}
