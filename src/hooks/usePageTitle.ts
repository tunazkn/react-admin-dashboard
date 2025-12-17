import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const usePageTitle = (title: string) => {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = `${title} | ${t("sidebar.adminPanel")}`;
  }, [title]); // Title değişirse tekrar çalışır
};

export default usePageTitle;