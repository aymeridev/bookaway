import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from './types';
import { Link } from "react-router";

interface PropertiesMapProps {
    properties: Property[];
    onMarkerClick: (property: Property) => void;
}

export function PropertiesMap({ properties, onMarkerClick }: PropertiesMapProps) {
    // On centre sur la première propriété si elle existe, sinon Paris
    const center: [number, number] = properties.length > 0
        ? [parseFloat(properties[0].latitude), parseFloat(properties[0].longitude)]
        : [48.8566, 2.3522];

    return (
        <div className='h-[50vh] sticky top-0 w-full rounded-2xl overflow-hidden shadow-inner border border-gray-200'>
            <MapContainer
                center={center}
                zoom={10}
                style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {properties.map((property) => (
                    <Marker
                        key={property.id}
                        eventHandlers={{
                            click: (_) => onMarkerClick(property)
                        }}
                        position={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                    />
                ))}
            </MapContainer>
        </div>
    );
}

// Un composant dédié pour l'affichage dans la bulle de la carte
function PropertyMiniCard({ property }: { property: Property }) {
    return (
        <Link to={`/property/${property.id}`} className="block no-underline text-inherit group">
            <div className="flex flex-col gap-2">
                <img
                    className="w-full h-32 object-cover rounded-lg"
                    src={`https://loremflickr.com/300/200/house?lock=${property.id}`}
                    alt={property.title}
                />
                <div className="px-1">
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {property.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                        {property.description}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                        <span className="font-extrabold text-blue-600">
                            {property.price_per_night}€ <span className="text-[10px] text-gray-400 font-normal">/ nuit</span>
                        </span>
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-bold uppercase text-gray-600">
                            Voir
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}