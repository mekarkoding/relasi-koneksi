"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useEntranceScroll } from "@/components/home/EntranceScrollProvider";
import {
  ENTRANCE_REVEAL_END,
  ENTRANCE_REVEAL_START,
} from "@/lib/entrance-timing";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "attractions", href: "/attractions" },
  { key: "homestay", href: "/homestay" },
  { key: "articles", href: "/articles" },
  { key: "booklet", href: "/booklet" },
  { key: "downloads", href: "/downloads" },
  { key: "about", href: "/about" },
] as const;

/**
 * Sticky top navigation (PRD 4.7).
 * On home, slides down with the entrance reveal (transform only — no backdrop-blur while moving).
 */
export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const entrance = useEntranceScroll();
  const fallbackProgress = useMotionValue(1);
  const progress = entrance?.progress ?? fallbackProgress;
  const isHome = pathname === "/";
  const animateEntrance = Boolean(isHome && !reduceMotion && entrance);

  const navY = useTransform(
    progress,
    [ENTRANCE_REVEAL_START, ENTRANCE_REVEAL_END, 1],
    ["-100%", "0%", "0%"],
  );

  return (
    <motion.header
      className={
        isHome
          ? "fixed inset-x-0 top-0 z-[60] border-b border-mist-dark bg-mist will-change-transform"
          : "sticky top-0 z-[60] border-b border-mist-dark bg-mist/90 backdrop-blur"
      }
      style={animateEntrance ? { y: navY } : { y: 0 }}
      initial={false}
    >
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6 sm:px-8">
        <Link
          href="/"
          className="shrink-0 font-extrabold tracking-tight text-forest transition-colors duration-300 hover:text-tamblingan"
          onClick={() => setOpen(false)}
        >
          RELASI<span className="text-tamblingan">.</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map(({ key, href }) => (
            <li key={key}>
              <Link
                href={href}
                prefetch
                className={`text-sm font-medium transition-colors duration-300 hover:text-tamblingan ${
                  pathname === href ? "text-tamblingan" : "text-forest/80"
                }`}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md text-forest transition-colors duration-300 hover:bg-mist-dark lg:hidden"
            aria-expanded={open}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="animate-fade-in space-y-2 border-t border-mist-dark px-6 py-4 sm:px-8 lg:hidden">
          {NAV_ITEMS.map(({ key, href }) => (
            <li key={key}>
              <Link
                href={href}
                prefetch
                onClick={() => setOpen(false)}
                className={`block rounded-md px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                  pathname === href
                    ? "bg-marigold/20 text-tamblingan"
                    : "text-forest/80 hover:bg-mist-dark"
                }`}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </motion.header>
  );
}
