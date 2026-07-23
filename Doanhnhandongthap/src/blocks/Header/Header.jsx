import { useEffect, useState } from "react";

export default function Header({ logo, menu, styles, isHome }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparentNow = styles.transparentOnHome && isHome && !scrolled;

  const headerStyle = {
    height: `${styles.headerHeight}px`,
    background: transparentNow ? "transparent" : scrolled ? styles.scrolledBgColor : styles.nonHomeBgColor,
    backdropFilter: scrolled ? `blur(${styles.blurAmount}px)` : "blur(0px)",
    WebkitBackdropFilter: scrolled ? `blur(${styles.blurAmount}px)` : "blur(0px)",
    borderBottom: scrolled ? styles.scrolledBorderBottom : "1px solid transparent",
    boxShadow: scrolled ? styles.scrolledShadow : "none",
    transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
  };

  const langToggleStyle = {
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(180deg, #CBA359 0%, #FAF390 18%, #FBC944 65%, #FCAF14 94%)",
    borderRadius: "50px",
    padding: "3px 5px",
    gap: "2px",
    flexShrink: 0,
    cursor: "pointer",
  };

  const LangToggle = () => (
    <div style={langToggleStyle}>
      <span
        role="button"
        tabIndex={0}
        title="Tiếng Việt"
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#c8860a",
          letterSpacing: "0.06em",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "#5a3200",
          flexShrink: 0,
        }}
      >
        VN
      </span>
      <span
        role="button"
        tabIndex={0}
        title="English"
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#7a4e00",
          letterSpacing: "0.04em",
          lineHeight: 1,
          paddingLeft: "2px",
        }}
      >
        EN
      </span>
    </div>
  );

  return (
    <header id="navbar" className="fixed top-0 left-0 w-full z-50 flex items-center" style={headerStyle}>
      <div className="max-w-[1750px] mx-auto px-4 md:px-[85px] w-full flex items-center justify-between">
        <a href={logo.link} className="flex items-center gap-3 flex-shrink-0 no-underline">
          <img src={logo.imageUrl} alt={logo.imageAlt} className="h-48 w-auto object-contain" />
          <div className="flex flex-col leading-tight" style={{ gap: `${logo.lineGap}px` }}>
            {logo.lines.map((line, i) => (
              <span
                key={i}
                className="font-bold block w-full"
                style={{ fontSize: `${line.fontSize}px`, color: line.color, textAlign: line.align }}
              >
                {line.text}
              </span>
            ))}
          </div>
        </a>

        <nav className="hidden md:flex items-center justify-center flex-1" style={{ gap: `${styles.gap}px` }}>
          {menu.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
              style={{ color: styles.textColor, fontSize: `${styles.menuFontSize}px`, fontWeight: styles.menuFontWeight }}
              onMouseEnter={(e) => (e.currentTarget.style.color = styles.hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = styles.textColor)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <LangToggle />
        </div>

        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Mở menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`${mobileOpen ? "flex" : "hidden"} md:hidden fixed top-20 left-0 w-full flex-col bg-white shadow-2xl border-t border-gray-100 z-40 transition-all`}
      >
        <div className="py-4 w-full">
          {menu.map((item) => (
            <a
              key={item.id}
              href={item.url}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50"
            >
              {item.label}
            </a>
          ))}
          <div className="flex justify-center px-6 pt-4 mt-2 pb-2 border-t border-gray-100">
            <LangToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
