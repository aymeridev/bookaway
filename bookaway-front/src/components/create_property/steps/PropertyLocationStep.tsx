import { useState, useEffect, useRef } from "react";
import { type PropertyFormStepProps } from "../form";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import toast from "react-hot-toast";
import { MagnifyingGlassIcon, MapPinIcon, SpinnerIcon } from "@phosphor-icons/react";

// Helper component to center and animate the Leaflet map when coordinates change
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center[0] && center[1]) {
            map.setView(center, 14, { animate: true });
        }
    }, [center, map]);
    return null;
}

export function PropertyLocationStep({ form, onNext }: PropertyFormStepProps) {
    const [location, setLocation] = useState<[string, string]>(["", ""]);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const latitude = Number.parseFloat(location[0]);
    const longitude = Number.parseFloat(location[1]);

    // Handle searching Nominatim API
    const handleSearch = async () => {
        if (!search.trim()) return;
        setIsLoadingResults(true);
        setIsOpen(false);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    search
                )}&email=ulco@ulco.fr`
            );
            const data = await res.json();
            setResults(data);
            if (data.length > 0) {
                setIsOpen(true);
            } else {
                toast.error("Aucun résultat trouvé pour cette adresse.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la recherche de l'adresse.");
        } finally {
            setIsLoadingResults(false);
        }
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div ref={containerRef} className="relative w-full flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Adresse du logement</span>
                <div className="flex gap-2">
                    <input
                        value={search}
                        type="search"
                        autoComplete="street-address"
                        placeholder="Rechercher une adresse..."
                        onFocus={() => {
                            if (results.length > 0) setIsOpen(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            } else if (e.key === "Escape") {
                                setIsOpen(false);
                            }
                        }}
                        onChange={(e: any) => {
                            setSearch(e.target.value);
                            setIsOpen(false); // Clear older results visibility when query is edited
                        }}
                        className="input w-full"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isLoadingResults || !search.trim()}
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer disabled:cursor-not-allowed px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center min-h-[42px] shrink-0 shadow-sm"
                    >
                        {isLoadingResults ? (
                            <SpinnerIcon className="w-5 h-5 animate-spin" />
                        ) : (
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Absolutely positioned dropdown suggestions list */}
                {isOpen && results.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl divide-y divide-gray-100">
                        {results.map((result: any) => {
                            const parts = result.display_name.split(",");
                            const title = parts[0];
                            const subtitle = parts.slice(1).join(",").trim();

                            return (
                                <li key={result.place_id}>
                                    <button
                                        className="w-full cursor-pointer hover:bg-slate-50 rounded-lg p-2.5 text-left transition-colors flex items-start gap-3 focus:bg-slate-50 focus:outline-none"
                                        type="button"
                                        onClick={() => {
                                            setLocation([result.lat, result.lon]);
                                            form.setValue("latitude", result.lat);
                                            form.setValue("longitude", result.lon);
                                            setIsOpen(false);
                                            setSearch(result.display_name);
                                        }}
                                    >
                                        <div className="mt-0.5 flex-shrink-0 text-slate-400 bg-slate-100 p-1.5 rounded-md">
                                            <MapPinIcon className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-slate-800 truncate">
                                                {title}
                                            </span>
                                            {subtitle && (
                                                <span className="text-xs text-slate-500 truncate">
                                                    {subtitle}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Map display and Continue button */}
            {latitude && longitude ? (
                <div className="flex flex-col gap-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
                    <div className="h-[30vh] rounded-xl overflow-hidden border border-gray-200 shadow-md z-0">
                        <MapContainer
                            center={[latitude, longitude]}
                            zoom={14}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <ChangeView center={[latitude, longitude]} />
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[latitude, longitude]} />
                        </MapContainer>
                    </div>
                    <button type="button" className="btn btn-primary w-full py-2.5" onClick={onNext}>
                        Continuer
                    </button>
                </div>
            ) : null}
        </>
    );
}