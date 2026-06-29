import { PlusCircle, Home } from "lucide-react";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import { useLoaderData, useNavigate, Link } from "react-router";
import type { Property } from "../types";
import { PropertyCard } from "./SearchPage";

export function MyPropertiesPage() {
    const properties: Property[] = useLoaderData();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <Banner title="Mes logements" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Vos annonces actives</h2>
                        <p className="text-sm text-gray-500">Gérez, modifiez et visualisez les logements que vous louez.</p>
                    </div>

                    <Button
                        onClick={() => {
                            navigate("/new-property", {
                                viewTransition: true
                            })
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Nouveau logement
                    </Button>
                </div>

                {properties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-md mx-auto mt-8 space-y-4">
                        <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                            <Home className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900 text-lg">Aucun logement enregistré</h3>
                            <p className="text-sm text-gray-500 max-w-xs">
                                Vous n'avez pas encore mis de propriété en location sur notre plateforme.
                            </p>
                        </div>
                        <Link
                            to="/new-property"
                            className="inline-block text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-sm transition"
                        >
                            Créer ma première annonce
                        </Link>
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