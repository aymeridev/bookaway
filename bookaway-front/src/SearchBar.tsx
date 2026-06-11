import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { fr } from "react-day-picker/locale";
import { format, parseISO } from "date-fns";
import { fr as fnsFR } from "date-fns/locale";
import { useNavigate, useSearchParams } from "react-router";
import { Map, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import { useDebounce } from "./hooks/useDebounce";
import { Card } from "./components/Card";

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
            className="flex gap-4 items-center justify-center border shadow rounded-full py-2 px-8 bg-base-200 border-base-300 text-base-content mb-8"
        >
            <FormDestinationPart
                value={destination}
                onChange={setDestination}
                onLocationSelect={setCoords}
            />

            <div aria-hidden="true" className="select-none text-base-content/50 font-extralight">
                |
            </div>

            <FormDatePart
                selected={selectedDate}
                onSelect={setSelectedDate}
            />

            <div aria-hidden="true" className="select-none text-base-content/50 font-extralight">
                |
            </div>

            <div className="flex items-center justify-center gap-2 bg-base-100 px-4 py-2 rounded-xl">
                <Users className="text-base-content" />

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
                            className="p-1 bg-base-100 text-base-content cursor-pointer rounded-full"
                            type="button"
                        >
                            <Minus />
                        </button>

                        <span>{travelers}</span>

                        <button
                            onClick={() => {
                                setTravelers(travelers + 1);
                            }}
                            className="p-1 bg-base-100 text-base-content cursor-pointer rounded-full"
                            type="button"
                        >
                            <Plus />
                        </button>
                    </div>
                </div>
            </div>

            <button className="bg-primary text-primary-content rounded-full p-4 font-semibold cursor-pointer">
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
            <div className="flex items-center justify-center gap-2 bg-base-100 text-base-content px-4 py-2 rounded-xl">
                <Map className="text-gray-600" />

                <div className="flex flex-col">
                    <span className="font-bold text-sm">
                        Destination
                    </span>

                    <input
                        className="border-none bg-transparent focus:ring-0"
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
                <Card className="absolute text-base-content min-w-lg top-16 z-50">
                    <span className="text-sm ">
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
                                    className="cursor-pointer w-full flex items-center gap-1 hover:bg-base-100 rounded-xl p-2"
                                    type="button"
                                >
                                    <div className="size-16 flex items-center justify-center text-error bg-error-content rounded-xl">
                                        <MapPin
                                            className="size-8"
                                            strokeWidth={1}
                                        />
                                    </div>

                                    <div className="flex flex-col items-start text-base-content">
                                        <span className="font-medium">
                                            {result.name}
                                        </span>

                                        <span className="text-base-content/70 text-xs text-left line-clamp-1">
                                            {
                                                result.display_name
                                            }
                                        </span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
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
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => {
                    setOpenCalendar(!openCalendar);
                }}
                className="flex items-start flex-col bg-base-100  px-4 py-2 rounded-xl"
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