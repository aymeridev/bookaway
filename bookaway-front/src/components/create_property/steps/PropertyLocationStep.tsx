import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { type PropertyFormStepProps } from "../form";
import Input from "../../ui/Input";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import Button from "../../ui/Button";

export function PropertyLocationStep({ form, onNext }: PropertyFormStepProps) {
    const [location, setLocation] = useState<[string, string]>(["", ""]);
    const [search, setSearch] = useState("");
    const latitude = Number.parseFloat(location[0])
    const longitude = Number.parseFloat(location[1])
    const [results, setResults] = useState([]);
    return (
        <>
            <label className="block">
                <span className="text-gray-700">Adresse du logement</span>
                <div className="flex gap-1">
                    <Input
                        value={search}
                        type="search"
                        autoComplete="street-address"
                        onChange={(e) => {
                            setSearch((e.target as any).value);
                        }} className="mt-1 block w-full" />
                    {search.length > 0 &&
                        <button onClick={async () => {

                            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&email=ulco@ulco.fr`);

                            const data = await res.json();
                            console.log(data);
                            setResults(data);

                        }} type="button" className="bg-blue-500 cursor-pointer p-2 text-white rounded">
                            <Search />
                        </button>
                    }
                </div>
            </label>
            {results.length > 0 && <ul className="flex flex-col shadow gap-1">
                {results.map((result: any) => (
                    <li key={result.place_id}>
                        <button className="cursor-pointer hover:bg-gray-700 hover:text-gray-100 rounded font-medium flex items-center justify-center" type="button" onClick={() => {
                            setLocation([result.lat, result.lon]);
                            form.setValue("latitude", result.lat);
                            form.setValue("longitude", result.lon);
                            setResults([]);
                            setSearch(result.display_name);
                        }}>
                            <MapPin />
                            {result.display_name}
                        </button>
                    </li>
                ))}
            </ul>}
            {(latitude && longitude) &&
                <div
                    className="h-[30vh]"
                >
                    <MapContainer
                        center={[latitude, longitude]}
                        zoom={14}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[latitude, longitude]} />
                    </MapContainer>
                    <Button type="button" onClick={onNext}>Continuer</Button>
                </div>
            }
        </>
    )
}