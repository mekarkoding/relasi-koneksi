import { Link } from "@/i18n/navigation";

/**
 * One candi-bentar wing — 5 stepped tiers, tall open edge toward the text.
 */
function GapuraWing({ mirror = false }: { mirror?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 48"
      className={`h-10 w-7 shrink-0 text-marigold/80 transition-colors duration-300 group-hover:text-marigold sm:h-11 sm:w-8 ${
        mirror ? "-scale-x-100" : ""
      }`}
      fill="currentColor"
    >
      {/* 5 steps: top → base */}
      <path d="M30 0H18V8H14V16H10V24H6V32H0V48H30V0Z" />
      <path d="M30 0H22V10H18V18H14V26H10V34H8V48H30V0Z" className="opacity-40" />
      <path
        d="M18 8H30M14 16H30M10 24H30M6 32H30"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        className="opacity-30"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Hero CTA — text framed by gapura wings, not a flat rectangle button.
 */
export function HeroCta({ label }: { label: string }) {
  return (
    <Link
      href="/attractions"
      className="group mt-10 inline-flex flex-col items-center gap-2.5 text-mist focus-visible:outline-offset-4"
    >
      <span className="inline-flex items-center gap-1.5 sm:gap-2">
        <GapuraWing />
        <span className="px-2 text-sm font-semibold uppercase tracking-[0.22em] text-marigold transition-colors duration-300 group-hover:text-marigold-light sm:text-base">
          {label}
        </span>
        <GapuraWing mirror />
      </span>
      <span
        aria-hidden
        className="h-px w-24 bg-gradient-to-r from-transparent via-marigold/70 to-transparent transition-all duration-500 ease-out group-hover:w-36 group-hover:via-marigold"
      />
    </Link>
  );
}
