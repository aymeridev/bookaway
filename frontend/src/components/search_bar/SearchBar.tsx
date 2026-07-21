import { type DateRange } from "react-day-picker";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate, useSearchParams } from "react-router";
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { FormDestinationPart } from "./FormDestinationPart";
import { FormDatePart } from "./FormDatePart";
import { FormTravelersPart } from "./FormTravelersPart";

interface SearchBarProps {
    action?: string;
}

export function SearchBar({ action = "Lancer la recherche" }: SearchBarProps) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialTravelers = Number(
        searchParams.get("travelers") || 0
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

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
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
                onLocationSelect={(coords, _) => {
                    setCoords(coords);
                }}
                coords={coords}
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

            <FormTravelersPart travelers={travelers} setTravelers={setTravelers} />



            <button type="submit" className="bg-primary text-primary-content rounded-xl md:rounded-full p-4 font-semibold cursor-pointer w-full md:w-auto flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all duration-150">
                <MagnifyingGlassIcon alt="Rechercher" />
                <span>{action}</span>
            </button>
        </form>
    );
}


