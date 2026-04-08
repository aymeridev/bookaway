import { Link, useLoaderData } from "react-router";
import type { Property } from "../types";
import { List, Map } from "lucide-react";
import { useState } from "react";
import { PropertiesMap } from "../PropertiesMap";
import { SearchBar } from "../SearchBar";

export function SearchPage() {
    const properties: any = useLoaderData();
    const [view, setView] = useState<"list" | "map">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    // Calcul des index
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Les propriétés à afficher sur la page actuelle
    const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);

    // Nombre total de pages
    const totalPages = Math.ceil(properties.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        setTimeout(() => {
            const element = document.getElementById('page-title');
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 10);
    };

    return (
        <main className="max-w-6xl mx-auto p-4 md:p-8">
            <SearchBar />
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 id="page-title" className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Nos meilleurs logements
                    </h1>
                    <p className="text-gray-500 mt-1">{properties.length} hébergements trouvés</p>
                </div>

                <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
                    <button
                        onClick={() => setView("list")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <List size={18} /> Liste
                    </button>
                    <button
                        onClick={() => setView("map")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === "map" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <Map size={18} /> Carte
                    </button>
                </div>
            </header>

            {view === "list" ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {currentProperties.map((property: Property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-12">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                            >
                                Précédent
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "hover:bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
                            >
                                Suivant
                            </button>
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

export function PropertyCard({ property }: { property: Property }) {
    return (
        <Link to={`/property/${property.id}`} className="group block">
            <article className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden">

                <div className="relative w-full aspect-video flex-shrink-0 overflow-hidden">
                    <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={`https://loremflickr.com/600/400/house,cabin?lock=${property.id}`}
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
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold text-gray-900">
                                    {property.base_price + property.price_per_night * 3}€
                                </span>
                                <span className="text-gray-500 text-xs">/ 3 nuits</span>
                            </div>
                        </div>

                        <span className="text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                            Voir l'offre →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}