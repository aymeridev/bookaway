import { useTranslation } from "react-i18next";

export function HomePage() {
    const { t } = useTranslation();
    return <h2>{t("searchTrip")}</h2>;
}