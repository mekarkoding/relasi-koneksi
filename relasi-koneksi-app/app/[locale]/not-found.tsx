import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <div className="animate-fade-in mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-tamblingan">404</p>
      <h1 className="mt-4 text-2xl font-bold text-forest">{t("title")}</h1>
      <p className="mt-2 text-forest/60">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-marigold px-6 py-3 font-semibold text-forest transition-all duration-300 ease-in-out hover:bg-marigold-dark"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
