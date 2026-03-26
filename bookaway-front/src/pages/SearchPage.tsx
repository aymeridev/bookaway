import { Link, useLoaderData } from "react-router";
import type { Property } from "../types";

export function SearchPage() {
    const properties = useLoaderData();





    return (
        <main className="max-w-6xl mx-auto p-6">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Résultats de recherche</h1>
                {/* <p className="text-gray-600 mt-2">
                    📍 Voyage pour <span className="font-semibold text-blue-600">{travelers} voyageur(s)</span> {dateDisplay}.
                </p> */}
            </header>
            <ul className="flex flex-col gap-1">
                {properties.map((property: Property) => (
                    <PropertyCard property={property} />
                ))}

            </ul>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-100 h-64 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Connexion à Laravel en cours...</p>
                </div>
            </section>
        </main>
    );
}

function PropertyCard({ property }: { property: Property }) {
    return (
        <li key={property.id} className="max-w-lg p-4 rounded-xl shadow border border-gray-300">
            <Link to={`/property/${property.id}`}>
                <div className="flex">
                    <img src="https://loremflickr.com/320/240/camping" />
                </div>
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-medium">{property.base_price + property.price_per_night * 3}€</span>
                    <span className="text-sm">total pour 3p.</span>
                </div>
                <p className="line-clamp-2">{property.description}</p>
            </Link>
        </li>
    );
}