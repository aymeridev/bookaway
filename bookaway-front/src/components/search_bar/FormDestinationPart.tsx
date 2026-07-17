import { useEffect, useRef, useState } from "react";
import { Map, MapPin, Loader2 } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { Card } from "../Card";
import api from "../../api/axios";
import { useTranslation } from "react-i18next";

interface FormDestinationProps {
    value: string;
    onChange: (value: string) => void;
    onLocationSelect: (
        coords: { lat: string; lon: string } | null,
        isDefault?: boolean
    ) => void;
    coords: { lat: string; lon: string } | null;
}

const DEFAULT_LOCATIONS = [
    { place_id: "default-paris", name: "Paris", lat: "48.8566", lon: "2.3522", display_name: "Île-de-France, France", isDefault: true },
    { place_id: "default-lille", name: "Lille", lat: "50.6292", lon: "3.0573", display_name: "Hauts-de-France, France", isDefault: true },
    { place_id: "default-lyon", name: "Lyon", lat: "45.7640", lon: "4.8357", display_name: "Auvergne-Rhône-Alpes, France", isDefault: true },
    { place_id: "default-marseille", name: "Marseille", lat: "43.2965", lon: "5.3698", display_name: "Provence-Alpes-Côte d'Azur, France", isDefault: true },
    { place_id: "default-toulouse", name: "Toulouse", lat: "43.6047", lon: "1.4442", display_name: "Occitanie, France", isDefault: true },
] as const;

const getCleanDestination = (val: string) => {
    return val.replace(/\s*\(\d+\s*km\)$/i, "");
};


export
    function FormDestinationPart({
        value,
        onChange,
        onLocationSelect,
        coords,
    }: FormDestinationProps) {
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const { t } = useTranslation();

    const debouncedSearch = useDebounce(value, 250);
    const [isSelecting, setIsSelecting] = useState(true);

    const cache = useRef<Record<string, any[]>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const trimmed = debouncedSearch.trim();
        if (!trimmed) {
            setResults([]);
            setIsLoading(false);
            setHasSearched(false);
            setActiveIndex(-1);
            return;
        }

        if (isSelecting) {
            return;
        }

        const cacheKey = trimmed.toLowerCase();
        if (cache.current[cacheKey]) {
            setResults(cache.current[cacheKey]);
            setHasSearched(true);
            setIsLoading(false);
            setActiveIndex(-1);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        async function load() {
            setIsLoading(true);
            try {
                const res = await api.get("/geocode", {
                    params: { q: trimmed },
                    signal,
                });

                const data = res.data;
                cache.current[cacheKey] = data;

                if (!signal.aborted) {
                    setResults(data);
                    setHasSearched(true);
                    setActiveIndex(-1);
                }
            } catch (error: any) {
                if (error.name !== "CanceledError" && error.name !== "AbortError") {
                    console.error("Geocoding fetch error:", error);
                }
            } finally {
                if (!signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        load();

        return () => {
            controller.abort();
        };
    }, [debouncedSearch, isSelecting]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (result: any) => {
        setIsSelecting(true);
        onLocationSelect(
            {
                lat: result.lat,
                lon: result.lon,
            },
            result.isDefault
        );
        onChange(result.name);
        setResults([]);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                setIsOpen(true);
            }
            return;
        }

        const currentList = value === "" ? DEFAULT_LOCATIONS : results;
        const maxIndex = currentList.length - 1;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
                break;
            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex <= maxIndex) {
                    handleSelect(currentList[activeIndex]);
                } else if (currentList.length > 0) {
                    handleSelect(currentList[0]);
                }
                e.currentTarget.blur();
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                e.currentTarget.blur();
                break;
            default:
                break;
        }
    };

    return (
        <div onClick={() => {
            setIsOpen(true);
        }} className="relative w-full md:w-auto md:flex-1" ref={containerRef}>
            <div className="flex items-center justify-start gap-2 bg-base-100 text-base-content px-4 py-2.5 md:py-2 rounded-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-base-200 transition-all duration-200 w-full">
                <Map className="text-gray-600 shrink-0" />

                <div className="flex flex-col min-w-0 w-full">
                    <span className="font-bold text-sm">
                        {t("search-bar.destination-label")}
                    </span>

                    <input
                        className="input input-ghost"
                        value={
                            isSelecting && coords && value
                                ? getCleanDestination(value)
                                : value
                        }
                        onChange={(e) => {
                            setIsSelecting(false);
                            let val = getCleanDestination(e.target.value);

                            onChange(val);
                            setIsOpen(true);

                            if (val === "") {
                                onLocationSelect(null);
                                setResults([]);
                                setHasSearched(false);
                            }
                            setIsOpen(true);
                            setActiveIndex(-1);
                        }}
                        onKeyDown={handleKeyDown}
                        type="text"
                        autoCorrect="off"
                        placeholder={t("search-bar.destination-placeholder")}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute w-full md:min-w-md card bg-base-200 shadow-2xl top-18 z-50 left-0 right-0">
                    {isLoading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 gap-2 text-base-content/60">
                            <Loader2 className="size-8 animate-spin text-primary" />
                            <span className="text-sm font-medium">{t("search-bar.searching-box")}</span>
                        </div>
                    )}

                    {!isLoading && hasSearched && results.length === 0 && value !== "" && (
                        <div className="text-center py-6 text-base-content/60 text-sm font-medium">
                            {t("search-bar.no-results", { value })}
                        </div>
                    )}

                    {((value === "" && !isLoading) || results.length > 0) && (
                        <ul className="menu w-full">
                            {(value === "" ? DEFAULT_LOCATIONS : results).map((result: any) => (
                                <li
                                    key={result.place_id}
                                    className="w-full"
                                >
                                    <button
                                        className="w-full"
                                        onClick={() => handleSelect(result)}
                                        type="button"
                                    >
                                        <div className="size-10 flex shrink-0 items-center justify-center text-error bg-error-content rounded-xl shadow-sm">
                                            <MapPin />
                                        </div>

                                        <div className="flex flex-col items-start min-w-0">
                                            <span className="font-medium text-sm truncate w-full">
                                                {result.name}
                                            </span>

                                            <span className="opacity-80 text-xs truncate w-full">
                                                {result.display_name}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}