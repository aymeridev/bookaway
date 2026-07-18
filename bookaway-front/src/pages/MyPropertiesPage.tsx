import { Banner } from "../components/Banner";
import { Link } from "react-router";
import { Card } from "../components/Card";
import { useMyProperties } from "../hooks/apiHooks";
import { useTranslation } from "react-i18next";
import { PropertyCard } from "../components/property/PropertyCard";
import { CircleIcon, HouseIcon, PlusIcon, SpinnerIcon } from "@phosphor-icons/react";

export function MyPropertiesPage() {
    const { t } = useTranslation();
    const { data: propertiesData, isLoading } = useMyProperties();
    const properties = propertiesData || [];
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 pb-12">
                <Banner title="Mes logements" />
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <SpinnerIcon className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-gray-500 font-medium">{t("accommodation.loading")}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <Banner title={t("accommodation.accommodation")} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{t("accommodation.announcements")}</h2>
                        <p className="text-sm text-gray-500">{t("accommodation.management-accommodation")}</p>
                    </div>

                    <Link className="btn btn-primary btn-soft" to={"/new-property"} viewTransition>
                        <PlusIcon className="w-5 h-5" />
                        {t("accommodation.new-accommodation")}
                    </Link>
                </div>

                {properties.length === 0 ? (
                    <div className="card bg-base-100 m-auto max-w-sm shadow-xl">
                        <div className="card-body items-center">
                            <div className=" bg-blue-50 size-12 flex items-center justify-center rounded-full text-blue-600">
                                <HouseIcon className="size-8" />
                            </div>
                            <h2 className="card-title">{t("accommodation.none-accommodation")}</h2>

                            <p className="text-sm text-gray-500 max-w-xs">
                                {t("accommodation.none-location-platform")}
                            </p>

                        </div>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {properties.map((property) => (
                            <li
                                key={property.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                            >
                                <PropertyCard property={property} numberOfNights={0} />
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
}