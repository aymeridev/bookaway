import { useSearchParams } from "react-router";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function TripsPage() {
    const [searchParams] = useSearchParams();

    const travelers = searchParams.get("travelers");
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const dateDisplay = fromStr && toStr 
        ? `du ${format(parseISO(fromStr), "dd MMMM", { locale: fr })} au ${format(parseISO(toStr), "dd MMMM", { locale: fr })}`
        : "dates non définies";

    return (
        <main className="max-w-6xl mx-auto p-6">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Résultats de recherche</h1>
                <p className="text-gray-600 mt-2">
                    📍 Voyage pour <span className="font-semibold text-blue-600">{travelers} voyageur(s)</span> {dateDisplay}.
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-100 h-64 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Connexion à Laravel en cours...</p>
                </div>
            </section>
        </main>
    );
}