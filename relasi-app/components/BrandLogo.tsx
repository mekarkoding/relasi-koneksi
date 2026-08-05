import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface Props {
  /** Extra classes on the link wrapper */
  className?: string;
  onClick?: () => void;
}

/**
 * Site brand: Homelogo2 seal from the old Catur Desa navbar + "Tamblingan" wordmark.
 * The source file is a wide black canvas with the seal on the left; we crop to the seal
 * and invert so it reads on light navbar/footer surfaces.
 */
export function BrandLogo({ className = "", onClick }: Props) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 font-extrabold tracking-tight text-forest transition-colors duration-300 hover:text-tamblingan ${className}`}
    >
      <span className="relative h-12 w-14 shrink-0 overflow-hidden sm:h-14 sm:w-16">
        <Image
          src="/images/brand/logo.png"
          alt="Catur Desa Adat Dalem Tamblingan"
          width={160}
          height={80}
          sizes="64px"
          className="absolute left-0 top-1/2 h-full w-auto max-w-none -translate-y-1/2 object-contain object-left invert"
          priority
        />
      </span>
      <span>
        Tamblingan<span className="text-tamblingan">.</span>
      </span>
    </Link>
  );
}
