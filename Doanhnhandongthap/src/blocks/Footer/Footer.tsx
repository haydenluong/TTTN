export type FooterContact = {
  icon: "location" | "email" | "phone";
  text: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterLinkColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterSocialLink = {
  icon: "facebook" | "tiktok" | "youtube" | "linkedin";
  href: string;
};

export type FooterProps = {
  logoUrl: string;
  logoAlt: string;
  brandLines: string[];
  officeLabel: string;
  contacts: FooterContact[];
  linkColumns: FooterLinkColumn[];
  copyrightText: string;
  socialLinks: FooterSocialLink[];
  background: string;
  decorativeImageUrl?: string;
};

const contactIcons: Record<FooterContact["icon"], string> = {
  location: "M12 22s7-7.58 7-12A7 7 0 0 0 5 10c0 4.42 7 12 7 12Zm0-9.5A2.5 2.5 0 1 1 12 7.5a2.5 2.5 0 0 1 0 5Z",
  email: "M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 2.5V18h14V6.5l-7 5-7-5Zm.6-.5L12 10l5.4-4Z",
  phone: "M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.2.4 2.5.6 3.8.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.6.6 3.8a1 1 0 0 1-.25 1Z",
};

const socialIcons: Record<FooterSocialLink["icon"], string> = {
  facebook: "M13 22v-8h2.7l.4-3H13V9c0-.9.3-1.5 1.6-1.5H16V5c-.3 0-1.4-.1-2.6-.1C10.9 4.9 9 6.6 9 9.5V11H6.5v3H9v8Z",
  tiktok: "M16.6 5.8c-1-.7-1.6-1.8-1.7-3.1h-2.9v13.4a2.5 2.5 0 1 1-1.8-2.4V10.7a5.4 5.4 0 1 0 4.7 5.3V9.4a6.5 6.5 0 0 0 3.7 1.2V7.6c-.7 0-1.4-.2-2-.6Z",
  youtube: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.1 5 12 5 12 5s-6.1 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.9 19 12 19 12 19s6.1 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5Z",
  linkedin: "M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3Zm7 0h3.8v1.8h.05c.5-1 1.8-2.1 3.7-2.1 4 0 4.45 2.6 4.45 6V21h-4v-5.3c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9V21h-4Z",
};

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d={path} />
    </svg>
  );
}

export default function Footer({
  logoUrl,
  logoAlt,
  brandLines,
  officeLabel,
  contacts,
  linkColumns,
  copyrightText,
  socialLinks,
  background,
  decorativeImageUrl,
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden text-[#1a237e]" style={{ background }}>
      {decorativeImageUrl && (
        <img
          src={decorativeImageUrl}
          alt=""
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-60"
        />
      )}

      <style>{`
        #footer-main-grid { display: grid; grid-template-columns: 42% 28% 30%; gap: 40px; }
        @media (max-width: 1200px) { #footer-main-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 768px) {
          #footer-main-grid { grid-template-columns: 1fr !important; }
          #footer-bottom-line { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="relative z-[2] mx-auto w-[1300px] max-w-[90%] pt-[60px]">
        <div id="footer-main-grid" className="pb-[50px]">
          <div className="flex flex-col">
            <a href="/" className="mb-5 flex items-center gap-3.5 no-underline">
              <img src={logoUrl} alt={logoAlt} className="h-20 w-auto flex-shrink-0 object-contain" />
              <div className="flex flex-col">
                {brandLines.map((line, i) => (
                  <span key={i} className="text-[15px] font-extrabold uppercase leading-snug tracking-wide">
                    {line}
                  </span>
                ))}
              </div>
            </a>

            <h4 className="mb-3 text-[13px] font-extrabold uppercase tracking-wide">{officeLabel}</h4>
            <div className="flex flex-col gap-3">
              {contacts.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2BB8C4] text-white">
                    <Icon path={contactIcons[c.icon]} />
                  </span>
                  <p className="text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          {linkColumns.map((col, i) => (
            <div key={i} className="flex flex-col">
              <h4 className="mb-5 text-[15px] font-extrabold">{col.title}</h4>
              <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} className="text-[15px] font-medium text-[#1a237e] transition-colors hover:text-[#0B5077]">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="m-0 border-t border-white/60" />

        <div id="footer-bottom-line" className="flex flex-wrap items-center justify-between gap-4 py-5">
          <p className="m-0 text-xs text-white">{copyrightText}</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1a237e] transition-transform hover:scale-110"
              >
                <Icon path={socialIcons[social.icon]} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
