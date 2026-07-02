import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "TRANG CHỦ", href: "/" },
  { label: "GIỚI THIỆU", href: "/gioi-thieu" },
  { label: "SẢN PHẨM", href: "/san-pham" },
  { label: "TIN TỨC", href: "#" },
  { label: "LIÊN HỆ", href: "/lien-he" },
];

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1-.39z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Header({ logoUrl, facebookUrl, tiktokUrl, linkedinUrl }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-t-4 border-b-4 transition-shadow duration-300"
        style={{
          borderTopColor: "#1a1a1a",
          borderBottomColor: "#f7941d",
          boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between overflow-visible">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            {logoUrl
              ? <img src={logoUrl} alt="Metik" className="h-[200px] w-auto -my-14" />
              : <span className="text-2xl font-black" style={{ color: "#f5a100" }}>metik</span>
            }
          </a>

          {/* Nav */}
          <nav
            className="flex items-center gap-8"
            onMouseEnter={() => setNavHovered(true)}
            onMouseLeave={() => setNavHovered(false)}
          >
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link text-sm font-bold tracking-wide transition-all duration-200 pb-1"
                  style={{
                    color: "#1b2a4b",
                    borderBottom: active ? "3px solid #f7941d" : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f7941d";
                    e.currentTarget.style.borderBottomColor = "#f7941d";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#1b2a4b";
                    e.currentTarget.style.borderBottomColor = active ? "#f7941d" : "transparent";
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold hover:opacity-80 transition"
                style={{ backgroundColor: "#1877f2" }}>
                f
              </a>
            )}
            {tiktokUrl && (
              <a href={tiktokUrl} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition">
                <TiktokIcon />
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition"
                style={{ backgroundColor: "#0077b5" }}>
                <LinkedinIcon />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Dim overlay when hovering nav */}
      <div
        className="fixed left-0 right-0 bottom-0 z-40 pointer-events-none transition-opacity duration-300"
        style={{
          top: 96,
          backgroundColor: "rgba(0,0,0,0.18)",
          opacity: navHovered ? 1 : 0,
        }}
      />
    </>
  );
}
