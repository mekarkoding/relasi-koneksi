"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/**
 * ID | EN toggle (PRD 4.1). Switching preserves the current page path.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-sm font-semibold" aria-label="Language">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-volcanic/30">|</span>}
          <Link
            href={pathname}
            locale={l}
            className={`rounded px-1.5 py-0.5 uppercase transition-all duration-300 ease-in-out ${
              locale === l
                ? "bg-terracotta text-white"
                : "text-volcanic/60 hover:text-terracotta"
            }`}
            aria-current={locale === l ? "true" : undefined}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
