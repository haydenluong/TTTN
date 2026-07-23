import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePageManager } from "../../hooks/usePageManager";
import { findTranslatedPage, PageTemplate } from "../../data/pageModel";
import { buildPageHref, resolvePageFromPath } from "../../utils/pageUrl";

function LangSwitcher({ lang, setLang }) {
  return (
    <div className="lang-switcher flex items-center gap-2 ml-4">
      <button
        type="button"
        title="Tiếng Việt"
        onClick={() => setLang("vi")}
        style={{ opacity: lang === "vi" ? 1 : 0.45, transition: "opacity 0.2s", cursor: "pointer", background: "none", border: "none", padding: 0 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-4 object-cover rounded-sm">
          <defs>
            <clipPath id="vn-a"><path fillOpacity=".7" d="M-85.3 0h682.6v512H-85.3z" /></clipPath>
          </defs>
          <g fillRule="evenodd" clipPath="url(#vn-a)" transform="translate(80)scale(.9375)">
            <path fill="#da251d" d="M-128 0h768v512h-768z" />
            <path fill="#ff0" d="M349.6 381 260 314.3l-89 67.3L204 272l-89-67.7 110.1-1 34.2-109.4L294 203l110.1.1-88.5 68.4 33.9 109.6z" />
          </g>
        </svg>
      </button>
      <button
        type="button"
        title="English"
        onClick={() => setLang("en")}
        style={{ opacity: lang === "en" ? 1 : 0.45, transition: "opacity 0.2s", cursor: "pointer", background: "none", border: "none", padding: 0 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-4 object-cover rounded-sm">
          <path fill="#012169" d="M0 0h640v480H0z" />
          <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" />
          <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
          <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
          <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
        </svg>
      </button>
    </div>
  );
}

export default function Header({ logoUrl, logoAlt, siteName, navLinks }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { pages } = usePageManager();


  const currentPage = resolvePageFromPath(location.pathname, pages);
  const [lang, setLangState] = useState(currentPage?.lang ?? "vi");

  
  const [prefLang, setPrefLang] = useState(() => localStorage.getItem("hexagon-lang") || "vi");

  useEffect(() => {
    if (currentPage) setLangState(currentPage.lang);
  }, [currentPage]);


  useEffect(() => {
    if (!currentPage || currentPage.lang === prefLang) return;
    const translated = findTranslatedPage(currentPage, pages, { publishedOnly: true });
    if (translated) {
      navigate(buildPageHref(translated), { replace: true });
    }
  }, [currentPage, prefLang, pages, navigate]);

  function setLang(targetLang) {
    localStorage.setItem("hexagon-lang", targetLang);
    setPrefLang(targetLang);

    if (!currentPage) {
      // trang không nằm trong hệ thống page: chỉ đổi hiển thị cờ
      setLangState(targetLang);
      return;
    }
    if (currentPage.lang === targetLang) return;

    const translated = findTranslatedPage(currentPage, pages, { publishedOnly: true });
    if (translated) {
      navigate(buildPageHref(translated));
    }
    // không tìm thấy bản dịch: giữ nguyên trang hiện tại, không điều hướng
  }

  const homeVi = pages.find((p) => p.lang === "vi" && p.template === PageTemplate.HOME);
  const homeEn = homeVi ? findTranslatedPage(homeVi, pages, { publishedOnly: true }) : null;
  const homeBase = buildPageHref(lang === "en" ? homeEn : homeVi);
  const resolveHref = (href) => (href?.startsWith("#") ? `${homeBase}${href}` : href);

  // toggle navbar background once the page scrolls past the hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nav-scrolled" : ""}`}
    >
      <nav className="mx-auto py-2 flex justify-between items-center" style={{ paddingInline: "clamp(1.5rem, 5vw, 5rem)" }}>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-16">
            <a href={resolveHref("#trang-chu")} className="block">
              <img src={logoUrl} alt={logoAlt} />
            </a>
          </div>
          <span className="text-xl font-bold text-white">{siteName}</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={resolveHref(link.href)}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-gray-300 hover:text-gold-accent transition"
            >
              {lang === "en" && link.labelEn ? link.labelEn : link.label}
            </a>
          ))}
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>

        <div className="md:hidden">
          <button id="menu-btn" className="text-white focus:outline-none" onClick={() => setMenuOpen((v) => !v)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${menuOpen ? "" : "hidden"} md:hidden fixed top-20 left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-40 transition-all pb-4 py-2`}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={resolveHref(link.href)}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            onClick={() => setMenuOpen(false)}
            className="block py-3 px-6 text-base font-medium text-gray-800 hover:text-[#d97706] hover:bg-gray-50"
          >
            {lang === "en" && link.labelEn ? link.labelEn : link.label}
          </a>
        ))}
        <div className="lang-switcher flex items-center gap-4 px-6 pt-4 mt-2 pb-2 border-t border-gray-100">
          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
      </div>
    </header>
  );
}
