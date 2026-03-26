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
        </main>
    );
}

function PropertyCard({ property }: { property: Property }) {
    return (
        <li key={property.id} className="max-w-lg p-4 rounded-xl shadow border border-gray-300">
            <Link to={`/property/${property.id}`} viewTransition>
                <div className="flex gap-1">
                    <img className="flex-1 rounded-xl" src="https://loremflickr.com/320/240/camping" />
                    <div className="flex flex-col gap-1">
                        <img className="flex-1 rounded-xl" src="https://loremflickr.com/320/240/camping" />
                        <img className="flex-1 rounded-xl" src="https://loremflickr.com/320/240/camping" />

                    </div>
                </div>
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-medium">{property.base_price + property.price_per_night * 3}€</span>
                    <span className="text-sm">total pour 3p.</span>
                </div>
                <p className="line-clamp-2">{property.description}</p>
                <div className="flex justify-end">
                    <span className="bg-blue-500 rounded-xl p-2 font-medium tracking-wide text-white">Réserver</span>
                </div>
            </Link>
        </li>
    );
}