import { Link } from "@/i18n/navigation";

/**
 * Back button that links to an explicit parent route (PRD 4.12).
 * Used at the top of article and wisata detail pages.
 */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-tamblingan transition-colors duration-300 hover:text-tamblingan-dark"
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}
