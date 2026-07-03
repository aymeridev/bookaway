import "react-day-picker/style.css";
import { SearchBar } from "../SearchBar";
import { useNavigation } from "react-router";
import { useTranslation } from "react-i18next";

export function HomePage() {
    const navigation = useNavigation();
    const loading = navigation.state === "loading";
    const { t } = useTranslation();

    return (
        <main className="relative flex h-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white bg-hero">

            {loading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 text-gray-800">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
                        </div>
                        <p className="font-medium">{t("home-page.loading")}</p>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <div className="relative z-10 flex gap-2 flex-col items-center -mt-[110px]">
                <h2 className="font-display text-3xl font-medium">{t("home-page.title")}</h2>
                <h3 className="text-2xl font-medium text-white/70 tracking-wide">{t("home-page.subtitle")}</h3>
                <div className="h-0.5 bg-white/50 w-full"></div>
                <p className="text-lg">{t("home-page.search-label")}</p>
                <SearchBar />
            </div>
        </main>
    );
}