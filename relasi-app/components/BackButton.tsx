"use client";

import { useRouter } from "@/i18n/navigation";

/**
 * History back button with a safe fallback (PRD 4.6/4.12 - desa pages).
 * Uses router.back() when there is history, otherwise navigates to fallbackHref.
 */
export function BackButton({
  label,
  fallbackHref = "/",
}: {
  label: string;
  fallbackHref?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-tamblingan transition-colors duration-300 hover:text-tamblingan-dark"
    >
      <span aria-hidden>←</span> {label}
    </button>
  );
}
