import { Link, useSearchParams } from "react-router";
import type { Property } from "../types";
import { ArrowRight, List, Map } from "lucide-react";
import { useMemo, useState } from "react";
import { PropertiesMap } from "../PropertiesMap";
import { SearchBar } from "../SearchBar";
import { amenitiesIcon } from "../amenities";
import { t } from "i18next";
import { differenceInDays, parseISO } from "date-fns";
import Button from "../components/ui/Button";
import { useSearchProperties } from "../hooks/apiHooks";

export function SearchPage() {
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

    // Seulement les logements dans un rayon de 50km
    const nearbyProperties = useMemo(() => {
        return properties.filter((property) => {
            if (property.distance === undefined) {
                return true;
            }

            return property.distance <= 50;
        });
    }, [properties]);

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
                        Nos meilleurs logements
                    </h1>

                    <p className="text-gray-500 mt-1">
                        {nearbyProperties.length} hébergements trouvés
                    </p>
                </div>

                <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
                    <button
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "list"
                            ? "bg-white shadow-sm text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <List size={18} />
                        Liste
                    </button>

                    <button
                        onClick={() => setView("map")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "map"
                            ? "bg-white shadow-sm text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Map size={18} />
                        Carte
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">
                        Recherche des logements...
                    </p>
                </div>
            ) : view === "list" ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {currentProperties.map((property) => (
                            <PropertyCard
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
                                Précédent
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
                                Suivant
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="h-[70vh] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <PropertiesMap properties={properties} />
                </div>
            )}
        </main>
    );
}

export function PropertyCard({
    property, numberOfNights
}: {
    property: Property;
    numberOfNights: number;
}) {
    const totalPrice =
        property.base_price + property.price_per_night * numberOfNights;
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const url = (from && to) ? `/property/${property.id}?from=${from}&to=${to}` : `/property/${property.id}`;
    return (
        <Link
            to={url}
            className="group max-w-xl block"
        >
            <article className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative w-full aspect-video shrink-0 overflow-hidden">
                    <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={property.images[0].url}
                        alt={property.title}
                    />
                </div>

                <div className="flex flex-col flex-1 p-5 justify-between">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {property.title}
                        </h3>

                        <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                            {property.description}
                        </p>

                        {property.distance !== undefined && (
                            <p className="text-sm text-blue-600 font-medium">
                                📍 {Number(property.distance).toFixed(1)} km
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {property.amenities.map((amenity) => {
                                const Icon = amenitiesIcon[amenity];
                                return (
                                    <span key={amenity} className="flex items-center gap-1 px-2 py-1">
                                        {Icon && <Icon />}
                                        {t(`amenities.${amenity}` as any)}
                                    </span>
                                )
                            })}

                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                        {numberOfNights > 0 && <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold text-gray-900">
                                    {totalPrice}€
                                </span>

                                <span className="text-gray-500 text-xs">
                                    / {numberOfNights} nuit
                                    {numberOfNights > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>}


                        <Button variant="flat" className="text-blue-600">
                            <ArrowRight />
                            Voir le logement
                        </Button>
                    </div>
                </div>
            </article>
        </Link>
    );
}