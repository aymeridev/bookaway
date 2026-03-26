import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { useState } from "react";
import { fr } from "react-day-picker/locale";
import { format } from "date-fns";
import { fr as fnsFR } from "date-fns/locale";
import { useNavigate } from "react-router";


export function HomePage() {
    return (
        <main className="relative flex h-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white bg-hero">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>
            <div className="relative z-10 flex gap-2 flex-col items-center">
                <h2 className="font-display text-3xl font-medium">Vos prochaines vacances commencent aujourd'hui</h2>
                <h3 className="text-2xl font-medium text-white/70 tracking-wide">avec BookAway</h3>
                <div className="h-0.5 bg-white/50 w-full"></div>
                <p className="text-lg">Rechercher mon séjour:</p>
                <SearchBar />
            </div>
        </main>
    );
}


function SearchBar() {
    const [travelers, setTravelers] = useState(1);
    const [selectedDate, setSelectedDate] = useState<DateRange>();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const params = new URLSearchParams({
            travelers: travelers.toString(),
            from: selectedDate?.from ? format(selectedDate.from, "yyyy-MM-dd") : "",
            to: selectedDate?.to ? format(selectedDate.to, "yyyy-MM-dd") : ""
        });

        navigate(`/trips?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 items-center justify-center border shadow rounded-xl py-2 px-8 bg-gray-200 border-gray-400 text-gray-900">
            <FormDatePart selected={selectedDate} onSelect={setSelectedDate} />
            <div>|</div>
            <div className="flex flex-col bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-bold text-sm">Nombre voyageurs</span>
                <input 
                    type="number" 
                    min={1} 
                    max={16}    
                    value={travelers} 
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="bg-transparent outline-none"
                />
            </div>
            <input type="submit" value={"Rechercher"} className="bg-blue-500 text-blue-50 rounded-full py-1 px-4 font-semibold cursor-pointer" />
        </form>
    )
}

function FormDatePart({ selected, onSelect }: { selected: DateRange | undefined, onSelect: (d: DateRange | undefined) => void }) {
    const [openCalendar, setOpenCalendar] = useState(false);

    return <>
        <div className="relative">
            <button type="button" onClick={() => {
                setOpenCalendar(!openCalendar);
            }} className="flex flex-col bg-gray-50 px-4 py-2 rounded-xl">
                <span className="font-bold text-sm">Date du voyage</span>
                {selected?.from && selected.to ?
                    <span>du {format(selected.from, "d MMM", { locale: fnsFR })} au {format(selected.to, "d MMM", { locale: fnsFR })}</span> :
                    <span>Selectionner une date...</span>}
            </button>
            {openCalendar &&
                <div className="absolute bg-white shadow-xl rounded-xl top-16 z-50"> {/* Ajout de z-50 pour passer devant le reste */}
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
                    />
                </div>
            }
        </div>
    </>
}