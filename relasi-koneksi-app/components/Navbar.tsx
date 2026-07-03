"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

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
 * Sticky top navigation (PRD 4.7): logo, 7 section links, language
 * switcher; collapses to a hamburger menu on mobile.
 */
export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sand-dark bg-sand/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-extrabold tracking-tight text-jungle transition-all duration-300 ease-in-out hover:text-terracotta"
          onClick={() => setOpen(false)}
        >
          RELASI<span className="text-terracotta">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map(({ key, href }) => (
            <li key={key}>
              <Link
                href={href}
                className={`text-sm font-medium transition-all duration-300 ease-in-out hover:text-terracotta ${
                  pathname === href ? "text-terracotta" : "text-volcanic/80"
                }`}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {/* Hamburger (mobile) */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md text-volcanic transition-all duration-300 ease-in-out hover:bg-sand-dark lg:hidden"
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

      {/* Mobile menu */}
      {open && (
        <ul className="animate-fade-in space-y-1 border-t border-sand-dark px-4 py-3 lg:hidden">
          {NAV_ITEMS.map(({ key, href }) => (
            <li key={key}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                  pathname === href
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-volcanic/80 hover:bg-sand-dark"
                }`}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
