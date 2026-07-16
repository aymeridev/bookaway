import { useSearchParams } from "react-router";
import { List, Map } from "lucide-react";
import { useMemo, useState } from "react";
import { PropertiesMap } from "../PropertiesMap";
import { SearchBar } from "../SearchBar";
import { useTranslation } from "react-i18next";
import { differenceInDays, parseISO } from "date-fns";
import Button from "../components/ui/Button";
import { useSearchProperties } from "../hooks/apiHooks";
import { PropertyCard } from "../components/property/PropertyCard";
import { SearchPropertyCardResult } from "../components/property/SearchPropertyCardResult";

export function SearchPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { data: propertiesData, isLoading } = useSearchProperties(searchParams);
    const properties = propertiesData || [];

    const [view, setView] = useState<"list" | "map">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const loading = isLoading;

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const numberOfNights =
        from && to
            ? Math.max(
                differenceInDays(
                    parseISO(to),
                    parseISO(from)
                ),
                1
            )
            : 1;

    const itemsPerPage = 18;

    const radius = Number(searchParams.get("radius") || 50);

    // Seulement les logements dans le rayon spécifié
    const nearbyProperties = useMemo(() => {
        const list = propertiesData || [];
        return list.filter((property) => {
            if (property.distance === undefined) {
                return true;
            }

            return property.distance <= radius;
        });
    }, [propertiesData, radius]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentProperties = nearbyProperties.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const totalPages = Math.ceil(
        nearbyProperties.length / itemsPerPage
    );

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);

        setTimeout(() => {
            const element = document.getElementById("page-title");

            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        }, 10);
    };

    return (
        <main className="max-w-6xl mx-auto p-4 md:p-8">
            <SearchBar />
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1
                        id="page-title"
                        className="text-3xl font-extrabold text-gray-900 tracking-tight"
                    >
                        {t("search.page-title")}
                    </h1>

                    <p className="text-gray-500 mt-1">
                        {t("search.found-count", { count: nearbyProperties.length })}
                    </p>
                </div>

                <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
                    <Button
                        variant="flat"
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-100 active:scale-100 shadow-none hover:shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none ${view === "list"
                            ? "bg-white shadow-sm text-blue-600 hover:bg-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-transparent"
                            }`}
                    >
                        <List size={18} />
                        {t("search.view-list")}
                    </Button>

                    <Button
                        variant="flat"
                        onClick={() => setView("map")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-100 active:scale-100 shadow-none hover:shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none ${view === "map"
                            ? "bg-white shadow-sm text-blue-600 hover:bg-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-transparent"
                            }`}
                    >
                        <Map size={18} />
                        {t("search.view-map")}
                    </Button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">
                        {t("search.loading")}
                    </p>
                </div>
            ) : (
                <div className="flex">
                    <div className="flex flex-1 flex-col gap-4">
                        {currentProperties.map((property) => (
                            <SearchPropertyCardResult
                                key={property.id}
                                property={property}
                                numberOfNights={numberOfNights}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    paginate(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            >
                                {t("search.btn-prev")}
                            </Button>

                            {[...Array(totalPages)].map((_, i) => (
                                <Button
                                    key={i + 1}
                                    onClick={() =>
                                        paginate(i + 1)
                                    }
                                    variant={currentPage === i + 1 ? "primary" : "secondary"}
                                >
                                    {i + 1}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                onClick={() =>
                                    paginate(currentPage + 1)
                                }
                                disabled={
                                    currentPage === totalPages
                                }
                            >
                                {t("search.btn-next")}
                            </Button>
                        </div>
                    )}
                    <PropertiesMap properties={properties} />
                </div>
            )}
        </main>
    );
}
