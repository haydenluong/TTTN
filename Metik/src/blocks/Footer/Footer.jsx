function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export default function Footer({ logoUrl, tagline, phone, email, address, copyright }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer style={{ backgroundColor: "#F2BF09" }}>
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-2 gap-16">

        {/* Left: logo + tagline */}
        <div>
          {logoUrl
            ? <img src={logoUrl} alt="Metik" className="h-64 -mt-16 w-auto mb-4" />
            : <span className="text-4xl font-black block mb-4" style={{ color: "#f5a100" }}>metik</span>
          }
          <p className="text-sm text-gray-800 leading-relaxed max-w-xs">{tagline}</p>
        </div>

        {/* Right: contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: "#1a7a2e" }}>
            THÔNG TIN LIÊN HỆ
          </h3>
          <div className="border-t mb-5" style={{ borderColor: "#e6b800" }} />
          <div className="flex flex-col gap-5 text-sm text-gray-800">
            {phone && (
              <div className="flex items-center gap-3">
                <PhoneIcon />
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3">
                <EmailIcon />
                <span>{email}</span>
              </div>
            )}
            {address && (
              <div className="flex items-center gap-3">
                <LocationIcon />
                <span>{address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative" style={{ backgroundColor: "#f59000" }}>
        <p className="text-center text-white text-sm py-3 font-medium">{copyright}</p>
        <button
          onClick={scrollToTop}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </svg>
        </button>
      </div>
    </footer>
  );
}
