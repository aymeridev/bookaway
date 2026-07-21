import { type DateRange } from "react-day-picker";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useNavigate, useSearchParams } from "react-router";
import { CaretDownIcon, LineVerticalIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { FormDestinationPart } from "./FormDestinationPart";
import { FormDatePart } from "./FormDatePart";
import { FormTravelersPart } from "./FormTravelersPart";
import { FormAmenitiesPart } from "./FormAmenitiesPart";

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

    const [showMore, setShowMore] = useState(false);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex rounded-[3em] flex-col border shadow-xl p-4 md:pt-2 px-4 md:px-4 bg-base-200 border-base-300 text-base-content mb-8 w-full max-w-4xl mx-auto relative" style={{ '--tag': 'search-bar' } as React.CSSProperties}
        >
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-center">
                <FormDestinationPart
                    value={destination}
                    onChange={setDestination}
                    onLocationSelect={(coords, _) => {
                        setCoords(coords);
                    }}
                    coords={coords}
                />

                <LineVerticalIcon aria-hidden="true" className="hidden md:block text-base-content/50" />

                <FormDatePart
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                />

                <LineVerticalIcon aria-hidden="true" className="hidden md:block text-base-content/50" />

                <FormTravelersPart travelers={travelers} setTravelers={setTravelers} />



                <button type="submit" className="bg-primary text-primary-content rounded-xl md:rounded-full p-4 font-semibold cursor-pointer w-full md:w-auto flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-95 transition-all duration-150">
                    <MagnifyingGlassIcon alt="Rechercher" />
                    <span>{action}</span>
                </button>
            </div>

            {showMore && <div className="p-4 bg-base-300 rounded-[2em]">
                <FormAmenitiesPart />
                <div className="flex gap-8">
                    <label className="gap-2 flex">
                        <input type="checkbox" className="checkbox" />
                        Hôtels
                    </label>
                    <label className="gap-2 flex">
                        <input type="checkbox" className="checkbox" />
                        Hôtels
                    </label>
                    <label className="gap-2 flex">
                        <input type="checkbox" className="checkbox" />
                        Hôtels
                    </label>
                </div>
            </div>}

            {/* <button onClick={() => {
                setShowMore(!showMore);
            }} type="button" className="btn btn-neutral left-[50%] -translate-x-[50%] btn-wide absolute btn-lg -bottom-6 rounded-full">
                <CaretDownIcon className={`transition-transform ${showMore && "rotate-180"}`} />
                {showMore ? "Réduire" : "Plus de paramètres"}
            </button> */}
        </form >
    );
}


