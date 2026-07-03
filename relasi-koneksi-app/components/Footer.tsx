import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const QUICK_LINKS = [
  { key: "attractions", href: "/attractions" },
  { key: "homestay", href: "/homestay" },
  { key: "articles", href: "/articles" },
  { key: "about", href: "/about" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="mt-16 bg-jungle text-sand">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">
            RELASI<span className="text-terracotta-light">.</span>
          </p>
          <p className="mt-3 text-sm text-sand/80">{t("address")}</p>
        </div>

        <div>
          <p className="font-semibold">{t("quickLinks")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {QUICK_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-sand/80 transition-all duration-300 ease-in-out hover:text-white"
                >
                  {tNav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold">{t("followUs")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/80 transition-all duration-300 ease-in-out hover:text-white"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand/80 transition-all duration-300 ease-in-out hover:text-white"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-sand/60">
        {t("credit")} · © {new Date().getFullYear()} {t("rights")}
      </div>
    </footer>
  );
}
