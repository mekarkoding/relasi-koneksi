import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <div className="animate-fade-in mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-terracotta">404</p>
      <h1 className="mt-4 text-2xl font-bold text-jungle">{t("title")}</h1>
      <p className="mt-2 text-volcanic/60">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-terracotta px-6 py-3 font-semibold text-white transition-all duration-300 ease-in-out hover:bg-terracotta-dark"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
