import { Banner } from "../components/Banner";
import { useTranslation } from "react-i18next";

export function BookingsPage() {
    const { t } = useTranslation();
    return (
        <>
            <Banner title={t("reservations.reservations")} description={t("reservations.descriptions")} />
        </>
    )
}