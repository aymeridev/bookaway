import { Link, useSearchParams } from "react-router";
import { useRef, useState, type Ref } from "react";
import { PropertiesMap } from "../PropertiesMap";
import { SearchBar } from "../components/search_bar/SearchBar";
import { useTranslation } from "react-i18next";
import { differenceInDays, parseISO } from "date-fns";
import { SearchPropertyCardResult } from "../components/property/SearchPropertyCardResult";
import { MagnifyingGlassIcon, MapTrifoldIcon, SidebarIcon } from "@phosphor-icons/react";
import { useSearchProperties } from "../services/properties";
import { validatePropertiesSearchParams } from "../schemas/properties";
import { objectToSearchParams } from "../api/utils";



export function PropertiesSearchResultsPage() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const params = validatePropertiesSearchParams(searchParams);
    const { from, to } = params;
    const { data: res, isPending, isError, error } = useSearchProperties(params);

    const [focusedProperty, setFocusedProperty] = useState<number>();
    const propertiesRefs = useRef(new Map<number, HTMLAnchorElement>());

    // const [currentPage, setCurrentPage] = useState(1);
    const [mapVisibility, setMapVisibility] = useState(true);

    const numberOfNights =
        from && to
            ? Math.max(
                differenceInDays(
                    parseISO(to),
                    parseISO(from)
                ),
                0
            )
            : 0;

    const getPropertyRef = (id: number) => {
        return (el: HTMLAnchorElement) => {
            if (el) {
                propertiesRefs.current.set(id, el);
            } else {
                propertiesRefs.current.delete(id);
            }
        }
    }

    // const paginate = (pageNumber: number) => {
    //     setCurrentPage(pageNumber);

    //     setTimeout(() => {
    //         const element = document.getElementById("page-title");

    //         if (element) {
    //             element.scrollIntoView({
    //                 behavior: "smooth",
    //                 block: "start",
    //             });
    //         } else {
    //             window.scrollTo({
    //                 top: 0,
    //                 behavior: "smooth",
    //             });
    //         }
    //     }, 10);
    // };

    return (
        <main className="max-w-6xl mx-auto p-4 md:p-8">
            <SearchBar action="Mettre à jour" />
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h1
                        id="page-title"
                        className="text-title-medium"
                    >
                        Résultats de votre <span className="flex items-center -rotate-5 gap-2 shadow-xl p-1 rounded-xl border-2 border-secondary">
                            <MagnifyingGlassIcon />
                            recherche
                        </span>
                    </h1>

                    <span className="text-base-content/60">
                        Nous avons trouvées {res?.total} logements.
                    </span>
                </div>
            </header>

            <div className="flex justify-end">
                <button onClick={() => {
                    setMapVisibility(!mapVisibility);
                }} className="btn btn-secondary btn-soft">
                    <SidebarIcon />
                    Masquer la carte
                </button>

            </div>

            {isError && <div className="alert alert-error"><span>Erreur : {error.message}</span></div>}

            {res?.total === 0 && <div className="alert alert-info">
                <span>Aucun logement trouvé.</span>
            </div>}

            {isPending ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">
                        {t("search.loading")}
                    </p>
                </div>
            ) : (
                <div className="flex gap-4">
                    <div className={`grid w-full min-w-md flex-1 gap-4 ${mapVisibility ? "grid-cols-1" : "grid-cols-3"}`}>
                        {res?.data.map((property) => (
                            <SearchPropertyCardResult
                                key={property.id}
                                ref={getPropertyRef(property.id)}
                                focus={mapVisibility && focusedProperty === property.id}
                                property={property}
                                numberOfNights={numberOfNights}
                                onPointerEnter={() => {
                                    console.log("test");
                                }}
                            />
                        ))}

                        {/* <div>
                            {propertiesData?.total > 1 && (
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
                        </div> */}
                        {res?.last_page && <div className="join">
                            {Array.from(Array(res?.last_page).keys()).map((index) => (
                                <button onClick={() => {
                                    setSearchParams(objectToSearchParams({ ...params, page: index + 1 }))
                                }} className={`join-item btn ${res?.current_page === index + 1 && "btn-primary"}`}>{index + 1}</button>
                            ))}
                        </div>}
                    </div>
                    {res?.data && mapVisibility && <div className="flex-1">
                        <div className="sticky top-0">
                            <h2 className="text-title-medium">
                                <MapTrifoldIcon className="size-8" weight="duotone" />
                                Carte interactive
                            </h2>
                            <p>Cliquez sur un marqueur pour accéder aux détails du logement.</p>
                            <PropertiesMap onMarkerClick={(p) => {
                                setFocusedProperty(p.id);
                                propertiesRefs.current.get(p.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'center'
                                });
                            }} properties={res?.data} />

                        </div>
                    </div>}
                </div>
            )}
        </main>
    );
}
