import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";

export function SearchPage() {
    const { t } = useTranslation();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        api.get('/trips')
            .then(res => setTrips(res.data))
            .catch(err => console.error("Erreur Laravel:", err));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">{t("searchTrip")}</h2>
            <ul className="mt-4">
                {trips.map((trip: any) => (
                    <li key={trip.id} className="border-b p-2">
                        {trip.destination} - {trip.price}€
                    </li>
                ))}
            </ul>
        </div>
    );
}