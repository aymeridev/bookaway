import "react-day-picker/style.css";
import { SearchBar } from "../SearchBar";


export function HomePage() {
    return (
        <main className="relative flex h-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white bg-hero">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>
            <div className="relative z-10 flex gap-2 flex-col items-center -mt-[110px]">
                <h2 className="font-display text-3xl font-medium">Vos prochaines vacances commencent aujourd'hui</h2>
                <h3 className="text-2xl font-medium text-white/70 tracking-wide">avec BookAway</h3>
                <div className="h-0.5 bg-white/50 w-full"></div>
                <p className="text-lg">Rechercher mon séjour:</p>
                <SearchBar />
            </div>
        </main>
    );
}

