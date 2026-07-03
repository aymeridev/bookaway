import { Link } from "react-router";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, MessageSquare, Receipt, Loader2 } from "lucide-react";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import { Card } from "../components/Card";
import { useMyReservations } from "../hooks/apiHooks";
import { useTranslation } from "react-i18next";

export function MyReservationsPage() {
    const { data: bookingsData, isLoading } = useMyReservations();
    const bookings = bookingsData || [];

    if (isLoading) {
        return (
            <>
                <Banner title="Mes réservations" />
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="text-gray-500 font-medium">Chargement de vos réservations...</p>
                </div>
            </>
        );
    }
    const { t } = useTranslation();

    // Fonction pour générer un badge de statut dynamique
    const getStatusBadge = (startDateStr: string, endDateStr: string) => {
        const today = new Date();
        const start = parseISO(startDateStr);
        const end = parseISO(endDateStr);

        if (isAfter(start, today)) {
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-200">{t("state.forthcoming")}</span>;
        } else if (isBefore(end, today)) {
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">{t("state.finished")}</span>;
        } else {
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200 animate-pulse">{t("state.progress")}</span>;
        }
    };

    return (
        <>
            <Banner title={t("reservations.reservations")} />

            <main className="max-w-6xl mx-auto p-6">
                {bookings.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
                        <p className="text-gray-500 text-lg">Vous n'avez effectué aucune réservation pour le moment.</p>
                        <Button asChild>
                            <Link to="/">
                                Explorer les logements
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => {
                            const start = parseISO(booking.start_date);
                            const end = parseISO(booking.end_date);
                            const firstImage = booking.property.images?.[0]?.url;

                            return (
                                <Card
                                    key={booking.id}
                                    className="flex flex-col sm:flex-row overflow-hidden"
                                >
                                    <div className="sm:w-64 h-48 sm:h-auto relative shrink-0">
                                        <img
                                            src={firstImage}
                                            alt={booking.property.title}
                                            className="w-full h-full rounded-2xl object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <Link
                                                    to={`/property/${booking.property.id}`}
                                                    className="text-xl font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                                                >
                                                    {booking.property.title}
                                                </Link>
                                                {getStatusBadge(booking.start_date, booking.end_date)}
                                            </div>

                                            <div className="flex flex-col space-y-1.5 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span>
                                                        {t("reservations.from")} {format(start, "dd MMMM yyyy", { locale: fr })} {t("reservations.to")} {format(end, "dd MMMM yyyy", { locale: fr })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Receipt className="w-4 h-4 text-gray-400" />
                                                    <span>{t("reservations.total-amount")} : <strong className="text-gray-900">{booking.total_price}€</strong></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2 border-t border-gray-50">
                                            <Button variant="flat" asChild>
                                                <Link to={"/messages"} viewTransition={true}>
                                                    <MessageSquare />
                                                    Contacter l'hôte
                                                </Link>
                                            </Button>
                                            <Button asChild>
                                                <Link
                                                    to={`/reservation/${booking.id}`} viewTransition={true}
                                                >
                                                    Voir la reservation
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}