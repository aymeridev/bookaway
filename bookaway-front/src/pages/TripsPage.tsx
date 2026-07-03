import { useSearchParams } from "react-router";
import { format, parseISO } from "date-fns";
import { fr as dfFr, enUS as dfEnUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export function TripsPage() {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();

    const isFrench = i18n.language.startsWith("fr");
    const dfLocale = isFrench ? dfFr : dfEnUS;

    const travelers = parseInt(searchParams.get("travelers") || "1", 10);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const dateDisplay = fromStr && toStr 
        ? t("trips.dates-range", {
            start: format(parseISO(fromStr), "dd MMMM", { locale: dfLocale }),
            end: format(parseISO(toStr), "dd MMMM", { locale: dfLocale })
          })
        : t("trips.dates-undefined");

    return (
        <main className="max-w-6xl mx-auto p-6">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    {t("trips.page-title")}
                </h1>
                <p className="text-gray-600 mt-2">
                    {t("trips.summary", { count: travelers, dates: dateDisplay })}
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-100 h-64 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">
                        {t("trips.loading")}
                    </p>
                </div>
            </section>
        </main>
    );
}