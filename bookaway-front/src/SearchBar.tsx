import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { fr } from "react-day-picker/locale";
import { format, parseISO } from "date-fns";
import { fr as fnsFR } from "date-fns/locale";
import { useNavigate, useSearchParams } from "react-router";
import { Map, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import { useDebounce } from "./hooks/useDebounce";

export function SearchBar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Préremplissage depuis URL
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
            className="flex gap-4 items-center justify-center border shadow rounded-xl py-2 px-8 bg-gray-200 border-gray-400 text-gray-900 mb-8"
        >
            <FormDestinationPart
                value={destination}
                onChange={setDestination}
                onLocationSelect={setCoords}
            />

            <div className="select-none text-gray-400 font-extralight">
                |
            </div>

            <FormDatePart
                selected={selectedDate}
                onSelect={setSelectedDate}
            />

            <div className="select-none text-gray-400 font-extralight">
                |
            </div>

            <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <Users className="text-gray-600" />

                <div className="flex flex-col">
                    <span className="font-bold text-sm">
                        Voyageurs
                    </span>

                    <div className="flex gap-4 items-center justify-center">
                        <button
                            onClick={() => {
                                setTravelers(
                                    Math.max(travelers - 1, 1)
                                );
                            }}
                            className="p-1 text-gray-800 bg-gray-200 cursor-pointer rounded-full"
                            type="button"
                        >
                            <Minus />
                        </button>

                        <span>{travelers}</span>

                        <button
                            onClick={() => {
                                setTravelers(travelers + 1);
                            }}
                            className="p-1 text-gray-800 bg-gray-200 cursor-pointer rounded-full"
                            type="button"
                        >
                            <Plus />
                        </button>
                    </div>
                </div>
            </div>

            <button className="bg-blue-500 text-blue-50 rounded-full p-4 font-semibold cursor-pointer">
                <Search />
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

    const debouncedSearch = useDebounce(value, 500);
    const [isSelecting, setIsSelecting] = useState(true);

    useEffect(() => {
        async function load() {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    debouncedSearch
                )}&email=ulco@ulco.fr`
            );

            const data = await res.json();
            setResults(data);
        }

        if (debouncedSearch && !isSelecting) {
            load();
        }
    }, [debouncedSearch, isSelecting]);

    return (
        <div className="relative">
            <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                <Map className="text-gray-600" />

                <div className="flex flex-col">
                    <span className="font-bold text-sm">
                        Destination
                    </span>

                    <input
                        className="border-none focus:ring-0"
                        value={value}
                        onChange={(e) => {
                            setIsSelecting(false);
                            onChange(e.target.value);

                            if (e.target.value === "") {
                                onLocationSelect(null);
                            }
                        }}
                        type="text"
                        placeholder="Rechercher une destination"
                    />
                </div>
            </div>

            {results.length > 0 && (
                <div className="absolute bg-white rounded-xl min-w-lg shadow-2xl p-4 top-16 z-50">
                    <span className="text-sm text-gray-600">
                        Résultats de recherches
                    </span>

                    <ul className="flex w-full flex-col gap-1">
                        {results.map((result: any) => (
                            <li
                                key={result.place_id}
                                className="w-full"
                            >
                                <button
                                    onClick={() => {
                                        setIsSelecting(true);

                                        onLocationSelect({
                                            lat: result.lat,
                                            lon: result.lon,
                                        });

                                        onChange(result.name);
                                        setResults([]);
                                    }}
                                    className="cursor-pointer w-full flex items-center gap-1 hover:bg-gray-100 rounded-xl p-2"
                                    type="button"
                                >
                                    <div className="size-16 flex items-center justify-center text-red-600 bg-red-100 rounded-xl">
                                        <MapPin
                                            className="size-8"
                                            strokeWidth={1}
                                        />
                                    </div>

                                    <div className="flex flex-col items-start text-gray-900">
                                        <span className="font-medium">
                                            {result.name}
                                        </span>

                                        <span className="text-gray-700 text-xs text-left line-clamp-1">
                                            {
                                                result.display_name
                                            }
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
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
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setOpenCalendar(!openCalendar);
                }}
                className="flex items-start flex-col bg-gray-50 px-4 py-2 rounded-xl"
            >
                <span className="font-bold text-sm">
                    Dates
                </span>

                {selected?.from && selected.to ? (
                    <span>
                        {format(selected.from, "d MMM", {
                            locale: fnsFR,
                        })}{" "}
                        -{" "}
                        {format(selected.to, "d MMM", {
                            locale: fnsFR,
                        })}
                    </span>
                ) : (
                    <span>Quand ?</span>
                )}
            </button>

            {openCalendar && (
                <div className="absolute bg-white shadow-xl rounded-xl top-16 z-50">
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