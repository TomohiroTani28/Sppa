// src/components/TeaserCard.tsx
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TeaserCard: React.FC = () => {
  const { t } = useTranslation("common");
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-10">
      <p className="text-gray-700">{t("auth.pleaseLogin")}</p>
      <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {t("auth.loginButton")}
        </button>
      </Link>
    </div>
  );
};

export default TeaserCard;
