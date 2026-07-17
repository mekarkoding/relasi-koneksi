import { useTranslations } from "next-intl";
import { instagramProfileUrl } from "@/lib/instagram";

export function Footer() {
  const t = useTranslations("footer");

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
          <p className="font-semibold text-forest">{t("followUs")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={instagramProfileUrl}
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

        <div>
          <p className="font-semibold text-forest">{t("supportedBy")}</p>
          {/* Sponsor logo placeholder (PRD 4.7) — swap in real logos when available */}
          <div className="mt-3 flex flex-wrap gap-3">
            <div
              className="flex h-14 w-24 items-center justify-center rounded-lg border border-dashed border-mist-dark text-[10px] uppercase tracking-wide text-forest/40"
              aria-hidden
            >
              Logo
            </div>
            <div
              className="flex h-14 w-24 items-center justify-center rounded-lg border border-dashed border-mist-dark text-[10px] uppercase tracking-wide text-forest/40"
              aria-hidden
            >
              Logo
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-tamblingan/20 py-4 text-center text-xs text-forest/50">
        {t("credit")} · © {new Date().getFullYear()} {t("rights")}
      </div>
    </footer>
  );
}
