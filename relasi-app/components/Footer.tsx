import Image from "next/image";
import { useTranslations } from "next-intl";
import { BrandLogo } from "./BrandLogo";
import { sponsors } from "@/data/sponsors";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/mekarbanjar/" },
  { label: "YouTube", href: "https://www.youtube.com/@mekarbanjarugm" },
  { label: "TikTok", href: "https://www.tiktok.com/@mekar.banjar" },
] as const;

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t-2 border-tamblingan bg-white text-forest">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <BrandLogo className="text-lg" />
          <p className="mt-3 text-sm text-forest/70">{t("address")}</p>
        </div>

        <div>
          <p className="font-semibold text-forest">{t("followUs")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest/70 transition-colors duration-300 hover:text-tamblingan"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-forest">{t("supportedBy")}</p>
          <ul className="mt-3 grid max-w-[14rem] grid-cols-2 gap-3">
            {sponsors.map((sponsor) => (
              <li
                key={sponsor.id}
                className="relative flex aspect-[3/2] items-center justify-center"
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  sizes="112px"
                  className="object-contain object-center"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-tamblingan/20 py-4 text-center text-xs text-forest/50">
        {t("credit")} · © {new Date().getFullYear()} {t("rights")}
      </div>
    </footer>
  );
}
