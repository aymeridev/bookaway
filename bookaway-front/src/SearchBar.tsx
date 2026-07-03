import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { fr } from "react-day-picker/locale";
import { format, parseISO } from "date-fns";
import { fr as fnsFR } from "date-fns/locale";
import { useNavigate, useSearchParams } from "react-router";
import { Map, MapPin, Minus, Plus, Search, Users, Loader2 } from "lucide-react";
import { useDebounce } from "./hooks/useDebounce";
import { Card } from "./components/Card";
import api from "./api/axios";

export function SearchBar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialTravelers = Number(
        searchParams.get("travelers") || 1
    );

    const initialFrom = searchParams.get("from");
    const initialTo = searchParams.get("to");

    const initialDestination =
        searchParams.get("destination") || "";

    const initialLat = searchParams.get("lat");
    const initialLon = searchParams.get("lon");

    const [travelers, setTravelers] =
        useState(initialTravelers);

    const [selectedDate, setSelectedDate] =
        useState<DateRange | undefined>(
            initialFrom && initialTo
                ? {
                    from: parseISO(initialFrom),
                    to: parseISO(initialTo),
                }
                : undefined
        );

    const [coords, setCoords] = useState<{
        lat: string;
        lon: string;
    } | null>(
        initialLat && initialLon
            ? {
                lat: initialLat,
                lon: initialLon,
            }
            : null
    );

    const [destination, setDestination] =
        useState(initialDestination);

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();

        const params = new URLSearchParams({
            travelers: travelers.toString(),
            from: selectedDate?.from
                ? format(selectedDate.from, "yyyy-MM-dd")
                : "",
            to: selectedDate?.to
                ? format(selectedDate.to, "yyyy-MM-dd")
                : "",
            lat: coords?.lat || "",
            lon: coords?.lon || "",
            destination,
        });

        navigate(`/search?${params.toString()}`, {
            viewTransition: true,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-center border shadow-xl rounded-3xl md:rounded-full py-4 md:py-2 px-6 md:px-8 bg-base-200 border-base-300 text-base-content mb-8 w-full max-w-4xl mx-auto"
        >
            <FormDestinationPart
                value={destination}
                onChange={setDestination}
                onLocationSelect={setCoords}
            />

            <div aria-hidden="true" className="hidden md:block select-none text-base-content/50 font-extralight">
                |
            </div>

            <FormDatePart
                selected={selectedDate}
                onSelect={setSelectedDate}
            />

            <div aria-hidden="true" className="hidden md:block select-none text-base-content/50 font-extralight">
                |
            </div>

            <div className="flex items-center justify-between md:justify-center gap-4 bg-base-100 px-4 py-2.5 md:py-2 rounded-xl w-full md:w-auto">
                <div className="flex items-center gap-2">
                    <Users className="text-base-content shrink-0" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm whitespace-nowrap">
                            Voyageurs
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 items-center justify-center">
                    <button
                        onClick={() => {
                            setTravelers(
                                Math.max(travelers - 1, 1)
                            );
                        }}
                        className="p-1 bg-base-200 text-base-content cursor-pointer rounded-full hover:bg-base-300 transition-all"
                        type="button"
                    >
                        <Minus className="size-4" />
                    </button>

                    <span className="font-semibold text-sm w-4 text-center">{travelers}</span>

                    <button
                        onClick={() => {
                            setTravelers(travelers + 1);
                        }}
                        className="p-1 bg-base-200 text-base-content cursor-pointer rounded-full hover:bg-base-300 transition-all"
                        type="button"
                    >
                        <Plus className="size-4" />
                    </button>
                </div>
            </div>

            <button className="bg-primary text-primary-content rounded-xl md:rounded-full p-4 font-semibold cursor-pointer w-full md:w-auto flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all duration-150">
                <Search className="size-5" />
                <span className="md:hidden">Rechercher</span>
            </button>
        </form>
    );
}

interface FormDestinationProps {
    value: string;
    onChange: (value: string) => void;
    onLocationSelect: (
        coords: { lat: string; lon: string } | null
    ) => void;
}

function FormDestinationPart({
    value,
    onChange,
    onLocationSelect,
}: FormDestinationProps) {
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

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
        onLocationSelect({
            lat: result.lat,
            lon: result.lon,
        });
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

        const maxIndex = results.length - 1;

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
                    handleSelect(results[activeIndex]);
                } else if (results.length > 0) {
                    handleSelect(results[0]);
                }
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
        <div className="relative w-full md:w-auto md:flex-1" ref={containerRef}>
            <div className="flex items-center justify-start gap-2 bg-base-100 text-base-content px-4 py-2.5 md:py-2 rounded-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-base-200 transition-all duration-200 w-full">
                <Map className="text-gray-600 shrink-0" />

                <div className="flex flex-col min-w-0 w-full">
                    <span className="font-bold text-sm">
                        Destination
                    </span>

                    <input
                        className="border-none bg-transparent focus:ring-0 w-full text-sm p-0 min-w-0"
                        value={value}
                        onChange={(e) => {
                            setIsSelecting(false);
                            onChange(e.target.value);
                            setIsOpen(true);

                            if (e.target.value === "") {
                                onLocationSelect(null);
                                setResults([]);
                                setHasSearched(false);
                            }
                        }}
                        onFocus={() => {
                            setIsOpen(true);
                            setActiveIndex(-1);
                        }}
                        onKeyDown={handleKeyDown}
                        type="text"
                        placeholder="Rechercher une destination"
                    />
                </div>
            </div>

            {isOpen && (isLoading || results.length > 0 || (hasSearched && results.length === 0)) && (
                <Card className="absolute text-base-content w-full md:min-w-[28rem] top-16 z-50 p-3 shadow-2xl border border-base-300 bg-base-200/95 backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 left-0 right-0">
                    <div className="flex items-center justify-between px-2 mb-2 pb-1 border-b border-base-300">
                        <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                            {isLoading ? "Recherche en cours..." : "Résultats de recherche"}
                        </span>
                        {isLoading && (
                            <Loader2 className="size-4 animate-spin text-primary" />
                        )}
                    </div>

                    {isLoading && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-6 gap-2 text-base-content/60">
                            <Loader2 className="size-8 animate-spin text-primary" />
                            <span className="text-sm font-medium">Recherche de la destination...</span>
                        </div>
                    )}

                    {!isLoading && hasSearched && results.length === 0 && (
                        <div className="text-center py-6 text-base-content/60 text-sm font-medium">
                            Aucun résultat trouvé pour "{value}"
                        </div>
                    )}

                    {results.length > 0 && (
                        <ul className="flex w-full flex-col gap-1 max-h-80 overflow-y-auto custom-scrollbar">
                            {results.map((result: any, index: number) => (
                                <li
                                    key={result.place_id}
                                    className="w-full"
                                >
                                    <button
                                        onClick={() => handleSelect(result)}
                                        className={`cursor-pointer w-full flex items-center gap-3 rounded-xl p-2.5 text-left transition-all duration-150 outline-none ${
                                            index === activeIndex
                                                ? "bg-base-300 text-base-content"
                                                : "hover:bg-base-300 text-base-content/90 hover:text-base-content"
                                        }`}
                                        type="button"
                                    >
                                        <div className="size-10 flex shrink-0 items-center justify-center text-error bg-error-content rounded-xl shadow-sm">
                                            <MapPin
                                                className="size-5"
                                                strokeWidth={1.5}
                                            />
                                        </div>

                                        <div className="flex flex-col items-start min-w-0">
                                            <span className="font-medium text-sm truncate w-full">
                                                {result.name}
                                            </span>

                                            <span className="text-base-content/60 text-xs truncate w-full">
                                                {result.display_name}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            )}
        </div>
    );
}

function FormDatePart({
    selected,
    onSelect,
}: {
    selected: DateRange | undefined;
    onSelect: (d: DateRange | undefined) => void;
}) {
    const [openCalendar, setOpenCalendar] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpenCalendar(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full md:w-auto" ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setOpenCalendar(!openCalendar);
                }}
                className="flex items-start flex-col bg-base-100 px-4 py-2.5 md:py-2 rounded-xl w-full text-left"
            >
                <span className="font-bold text-sm">
                    Dates
                </span>

                {selected?.from && selected.to ? (
                    <span className="text-sm">
                        {format(selected.from, "d MMM", {
                            locale: fnsFR,
                        })}{" "}
                        -{" "}
                        {format(selected.to, "d MMM", {
                            locale: fnsFR,
                        })}
                    </span>
                ) : (
                    <span className="text-sm text-base-content/60">Quand ?</span>
                )}
            </button>

            {openCalendar && (
                <div className="absolute bg-white shadow-xl rounded-xl top-16 z-50 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 max-w-[95vw] sm:max-w-md overflow-x-auto">
                    <DayPicker
                        animate
                        captionLayout="dropdown"
                        mode="range"
                        navLayout="around"
                        resetOnSelect
                        showOutsideDays
                        showWeekNumber
                        timeZone="Europe/Paris"
                        selected={selected}
                        onSelect={onSelect}
                        locale={fr}
                        disabled={{ before: new Date() }}
                    />
                </div>
            )}
        </div>
    );
}