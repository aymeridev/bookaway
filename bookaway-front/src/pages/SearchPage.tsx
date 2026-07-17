import { useSearchParams } from "react-router";
import { useMemo, useState } from "react";
import { PropertiesMap } from "../PropertiesMap";
import { SearchBar } from "../components/search_bar/SearchBar";
import { useTranslation } from "react-i18next";
import { differenceInDays, parseISO } from "date-fns";
import { useSearchProperties } from "../hooks/apiHooks";
import { SearchPropertyCardResult } from "../components/property/SearchPropertyCardResult";

export function SearchPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { data: propertiesData, isLoading } = useSearchProperties(searchParams);
    const properties = propertiesData || [];

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
                        className="text-title-medium"
                    >
                        {t("search.page-title")}
                    </h1>

                    <p className="text-base-content/60">
                        {t("search.found-count", { count: nearbyProperties.length })}
                    </p>
                </div>
            </header>

            {nearbyProperties.length === 0 && <div className="alert alert-error">
                <span>Aucun logement trouvé.</span>
            </div>}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">
                        {t("search.loading")}
                    </p>
                </div>
            ) : (
                <div className="flex">
                    <div className="flex w-full min-w-md flex-1 flex-col gap-4">
                        {currentProperties.map((property) => (
                            <SearchPropertyCardResult
                                key={property.id}
                                property={property}
                                numberOfNights={numberOfNights}
                            />
                        ))}

                        <div>
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                                    <button
                                        className="btn btn-outline"
                                        onClick={() =>
                                            paginate(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        {t("search.btn-prev")}
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() =>
                                                paginate(i + 1)
                                            }
                                            className={currentPage === i + 1 ? "btn btn-primary" : "btn btn-secondary"}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        className="btn btn-outline"
                                        onClick={() =>
                                            paginate(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage === totalPages
                                        }
                                    >
                                        {t("search.btn-next")}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <PropertiesMap properties={properties} />
                </div>
            )}
        </main>
    );
}
