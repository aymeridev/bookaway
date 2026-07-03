import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card } from "../components/Card";
import useAuthStore from "../context/AuthStore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Banner } from "../components/Banner";

export function ProfilePage() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const response = await api.get(`/users/${user?.id}`);
                setBookings(response.data.bookings || []);
            } catch (err) {
                console.error("Erreur profil", err);
            }
        };

        if (user?.id) {
            fetchMyProfile();
        }
    }, [user?.id]);

    if (isAuthenticated && !user) {
        return <p>Chargement des données utilisateur...</p>;
    }

    if (!isAuthenticated) {
        return <p>Veuillez vous connecter pour accéder à cette page.</p>;
    }

    return <>
        <Banner title="Mon Profil" />
        <div className="max-w-4xl mx-auto p-8">

            {user && <Card>
                <h2 className="text-xl font-semibold mb-4 border-b border-b-gray-230 pb-2">Informations personnelles</h2>
                <div className="space-y-2">
                    <p><span className="font-bold">Nom :</span> {user.name}</p>
                    <p><span className="font-bold">Email :</span> {user.email}</p>
                    <p>
                        <span className="font-bold">
                            Membre depuis {format(user.created_at, "PPP", {
                                locale: fr
                            })}
                        </span>
                    </p>
                </div>
            </Card>}

            <h2 className="text-2xl font-bold mb-4">Mes Réservations</h2>
            <div className="grid gap-4">
                {bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                        <div key={booking.id} className="bg-gray-50 p-4 rounded-xl border flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-blue-600">{booking.property?.title}</h3>
                                <p className="text-sm text-gray-600">
                                    Du {new Date(booking.start_date).toLocaleDateString('fr-FR')} au {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold">{booking.total_price} €</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">Vous n'avez pas encore de réservations.</p>
                )}
            </div>
        </div>
    </>;
}