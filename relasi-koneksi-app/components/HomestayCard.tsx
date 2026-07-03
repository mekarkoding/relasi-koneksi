import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import type { Homestay } from "@/data/homestays";
import { pickLocale } from "@/lib/locale-content";

/**
 * Homestay card (PRD 4.4): one primary action — a 1-click external
 * WhatsApp redirect with a locale-aware prefilled greeting. No booking form.
 */
export function HomestayCard({ homestay }: { homestay: Homestay }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("homestay");

  const name = pickLocale(locale, homestay.name_id, homestay.name_en);
  const description = pickLocale(locale, homestay.description_id, homestay.description_en);
  const greeting = encodeURIComponent(t("whatsappGreeting", { name }));
  const waLink = `https://wa.me/${homestay.whatsappNumber}?text=${greeting}`;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={homestay.photos[0]}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-jungle">{name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-volcanic/70">{description}</p>

        <p className="mt-3 text-sm font-semibold text-terracotta">{homestay.priceRange}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("facilities")}>
          {homestay.facilities.map((facility) => (
            <li
              key={facility}
              className="rounded-full bg-sand-dark px-2.5 py-0.5 text-xs text-volcanic/70"
            >
              {facility}
            </li>
          ))}
        </ul>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out hover:bg-terracotta-dark"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.2c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.3 1.2z" />
          </svg>
          {t("contactWhatsApp")}
        </a>
      </div>
    </article>
  );
}
