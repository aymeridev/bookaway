import { PlusCircle, Home, Loader2 } from "lucide-react";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import { Link } from "react-router";
import { Card } from "../components/Card";
import { useMyProperties } from "../hooks/apiHooks";
import { useTranslation } from "react-i18next";
import { PropertyCard } from "../components/property/PropertyCard";

export function MyPropertiesPage() {
    const { t } = useTranslation();
    const { data: propertiesData, isLoading } = useMyProperties();
    const properties = propertiesData || [];
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50/50 pb-12">
                <Banner title="Mes logements" />
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
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

                    <Button asChild>
                        <Link to={"/new-property"} viewTransition={true}>
                            <PlusCircle className="w-5 h-5" />
                            {t("accommodation.new-accommodation")}
                        </Link>
                    </Button>
                </div>

                {properties.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center text-center max-w-md mx-auto mt-8 space-y-4">
                        <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                            <Home className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{t("accommodation.none-accommodation")}</h3>
                            <p className="text-sm text-gray-500 max-w-xs">
                                {t("accommodation.none-location-platform")}
                            </p>
                        </div>
                    </Card>
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