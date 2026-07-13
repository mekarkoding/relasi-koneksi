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
    <footer className="border-t-2 border-tamblingan bg-white text-forest">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">
            RELASI<span className="text-tamblingan">.</span>
          </p>
          <p className="mt-3 text-sm text-forest/70">{t("address")}</p>
        </div>

        <div>
          <p className="font-semibold text-forest">{t("quickLinks")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {QUICK_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-forest/70 transition-colors duration-300 hover:text-tamblingan"
                >
                  {tNav(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-forest">{t("followUs")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest/70 transition-colors duration-300 hover:text-tamblingan"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest/70 transition-colors duration-300 hover:text-tamblingan"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-tamblingan/20 py-4 text-center text-xs text-forest/50">
        {t("credit")} · © {new Date().getFullYear()} {t("rights")}
      </div>
    </footer>
  );
}
