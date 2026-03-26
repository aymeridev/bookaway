import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from './types';
import { PropertyCard } from './pages/SearchPage';

export function PropertiesMap({ properties }: { properties: Property[] }) {
    const position: [number, number] = [48.8566, 2.3522];
    return <>
        <h2>Carte</h2>
        <div className='h-200 w-full'>
            <MapContainer
                center={position}
                zoom={6}
                style={{ height: "100%", width: "100%" }}>

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {properties.map((property) => (
                    <Marker key={property.id} position={[parseFloat(property.latitude), parseFloat(property.longitude)]}>
                        <Popup>
                            <PropertyCard property={property} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    </>
}