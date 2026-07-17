import "react-day-picker/style.css";
import { SearchBar } from "../SearchBar";
import { useTranslation } from "react-i18next";

export function HomePage() {
    const { t } = useTranslation();

    return (
        <main
            className="hero min-h-screen bg-hero"
        >
            <div className="hero-overlay"></div>
            <div className="hero-content text-neutral-content text-center">

                <div className="relative z-10 flex gap-2 flex-col items-center -mt-[110px]">
                    <h2 className="font-display text-3xl font-medium">{t("home-page.title")}</h2>
                    <h3 className="text-2xl font-medium text-white/70 tracking-wide">{t("home-page.subtitle")}</h3>
                    <div className="h-0.5 bg-white/50 w-full"></div>
                    <p className="text-lg">{t("home-page.search-label")}</p>
                    <SearchBar />
                </div>
            </div>
        </main>
    );
}