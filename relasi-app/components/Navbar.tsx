"use client";

import { useEffect, useRef, useState } from "react";
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

interface NavLink {
  key: string;
  href: string;
}

interface NavDropdown {
  key: string;
  /** Path prefix that marks this dropdown active */
  match: string;
  children: NavLink[];
}

type NavItem = NavLink | NavDropdown;

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "wisata", href: "/wisata" },
  {
    key: "artikel",
    match: "/articles",
    children: [
      { key: "sejarah", href: "/articles/sejarah" },
      { key: "berita", href: "/articles/berita" },
      { key: "partnership", href: "/articles/partnership" },
      { key: "liputan", href: "/articles/liputan" },
    ],
  },
  {
    key: "desa",
    match: "/desa",
    children: [
      { key: "gobleg", href: "/desa/gobleg" },
      { key: "munduk", href: "/desa/munduk" },
      { key: "gesing", href: "/desa/gesing" },
      { key: "umejero", href: "/desa/umejero" },
    ],
  },
  {
    key: "media",
    match: "/media",
    children: [
      { key: "galeri", href: "/media/galeri" },
      { key: "buklet", href: "/media/buklet" },
      { key: "peta", href: "/media/peta" },
    ],
  },
  {
    key: "tentang",
    match: "/about",
    children: [
      { key: "adatDalemTamblingan", href: "/about/adat-dalem-tamblingan" },
      { key: "kknMekarBanjar", href: "/about/kkn-mekar-banjar" },
    ],
  },
];

function isDropdown(item: NavItem): item is NavDropdown {
  return "children" in item;
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DesktopDropdown({
  item,
  active,
  t,
}: {
  item: NavDropdown;
  active: boolean;
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearCloseTimer(), []);

  return (
    <li
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={openMenu}
        className={`flex items-center gap-1 text-sm font-medium transition-colors duration-300 hover:text-tamblingan ${
          active ? "text-tamblingan" : "text-forest/80"
        }`}
      >
        {t(item.key)}
        <Chevron className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        // pt-3 (not mt-3): keeps a visual gap while remaining part of the
        // hover hit-area so the pointer can reach the menu without closing it.
        <div className="absolute left-0 top-full z-10 pt-3">
          <ul className="min-w-48 rounded-xl border border-mist-dark bg-white p-2 shadow-lg">
            {item.children.map((child) => (
              <li key={child.key}>
                <Link
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-forest/80 transition-colors duration-300 hover:bg-marigold/20 hover:text-tamblingan"
                >
                  {t(child.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

/**
 * Sticky top navigation (PRD 4.7): 6 items, 4 with dropdowns.
 * On home, slides down with the entrance reveal (transform only — no backdrop-blur while moving).
 */
export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
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

  const isActive = (item: NavItem) =>
    isDropdown(item)
      ? pathname.startsWith(item.match)
      : item.href === "/"
        ? pathname === "/"
        : pathname.startsWith(item.href);

  const closeMobile = () => {
    setOpen(false);
    setOpenSection(null);
  };

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
          onClick={closeMobile}
        >
          RELASI<span className="text-tamblingan">.</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) =>
            isDropdown(item) ? (
              <DesktopDropdown
                key={item.key}
                item={item}
                active={isActive(item)}
                t={t}
              />
            ) : (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-tamblingan ${
                    isActive(item) ? "text-tamblingan" : "text-forest/80"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ),
          )}
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
        <div className="animate-fade-in border-t border-mist-dark px-6 py-4 sm:px-8 lg:hidden">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) =>
              isDropdown(item) ? (
                <li key={item.key}>
                  <button
                    type="button"
                    aria-expanded={openSection === item.key}
                    onClick={() =>
                      setOpenSection((s) => (s === item.key ? null : item.key))
                    }
                    className={`flex w-full items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                      isActive(item)
                        ? "text-tamblingan"
                        : "text-forest/80 hover:bg-mist-dark"
                    }`}
                  >
                    {t(item.key)}
                    <Chevron
                      className={`transition-transform duration-200 ${
                        openSection === item.key ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSection === item.key && (
                    <ul className="mb-1 ml-3 space-y-1 border-l border-mist-dark pl-3">
                      {item.children.map((child) => (
                        <li key={child.key}>
                          <Link
                            href={child.href}
                            onClick={closeMobile}
                            className={`block rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
                              pathname.startsWith(child.href)
                                ? "bg-marigold/20 text-tamblingan"
                                : "text-forest/70 hover:bg-mist-dark"
                            }`}
                          >
                            {t(child.key)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`block rounded-md px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                      isActive(item)
                        ? "bg-marigold/20 text-tamblingan"
                        : "text-forest/80 hover:bg-mist-dark"
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </motion.header>
  );
}
