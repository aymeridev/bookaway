import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DayPicker } from "react-day-picker";
import { Link, useLoaderData } from "react-router";

export function PropertyDetailsPage() {
    const property: any = useLoaderData();

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* 1. Header & Title */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            </div>

            {/* 2. Galerie Photos Style "Bento" */}
            <div className="grid grid-cols-1 md:grid-cols-4 h-[450px] gap-3 overflow-hidden rounded-2xl">
                <div className="md:col-span-2 h-full">
                    <img className="w-full h-full object-cover hover:opacity-95 transition cursor-pointer" src="https://loremflickr.com/640/480/camping" alt="Main" />
                </div>
                <div className="hidden md:flex flex-col col-span-1 gap-3 h-full">
                    <img className="flex-1 object-cover hover:opacity-95 transition cursor-pointer" src="https://loremflickr.com/320/240/camping?random=1" alt="Side 1" />
                    <img className="flex-1 object-cover hover:opacity-95 transition cursor-pointer" src="https://loremflickr.com/320/240/camping?random=2" alt="Side 2" />
                </div>
                <div className="hidden md:flex flex-col col-span-1 gap-3 h-full">
                    <img className="flex-1 object-cover hover:opacity-95 transition cursor-pointer" src="https://loremflickr.com/320/240/forest" alt="Side 3" />
                    <img className="flex-1 object-cover hover:opacity-95 transition cursor-pointer" src="https://loremflickr.com/320/240/cabin" alt="Side 4" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* 3. Colonne de gauche : Infos & Map */}
                <div className="flex-[2] space-y-8">
                    <div className="border-b pb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">À propos de ce logement</h2>
                        <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Où se situe le logement</h2>
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <PropertyLocation longitude={parseFloat(property.longitude)} latitude={parseFloat(property.latitude)} />
                        </div>
                    </div>
                </div>

                {/* 4. Colonne de droite : Widget Réservation (Sticky) */}
                <div className="flex-1">
                    <div className="sticky top-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-xl space-y-6">
                        <div className="flex justify-between items-baseline">
                            <div>
                                <span className="text-2xl font-bold">{property.price_per_night}€</span>
                                <span className="text-gray-500"> / nuit</span>
                            </div>
                        </div>

                        <div className="flex justify-center bg-gray-50 rounded-xl p-2 border border-gray-100">
                            <DayPicker mode="range" className="m-0" />
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-gray-600">
                                <span className="underline">{property.price_per_night}€ x 3 nuits</span>
                                <span>{property.price_per_night * 3}€</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span className="underline">Frais de service</span>
                                <span>{property.base_price}€</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{property.base_price + property.price_per_night * 3}€</span>
                            </div>
                        </div>

                        <Link 
                            to={"/"} 
                            className='block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-center py-4 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all'
                        >
                            Réserver maintenant
                        </Link>
                        
                        <p className="text-center text-xs text-gray-400">Aucun montant ne vous sera débité pour le moment</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PropertyLocation({ longitude, latitude }: { longitude: number, latitude: number }) {
    return <div className='h-96 w-full'>
        <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]} />
        </MapContainer>
    </div>
}