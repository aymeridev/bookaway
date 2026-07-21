import { Link } from "react-router";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Banner } from "../components/Banner";
import { useTranslation } from "react-i18next";
import { CalendarIcon, ChatCircleIcon, ReceiptIcon } from "@phosphor-icons/react";
import { useMyBookings } from "../services/bookings";

export function MyBookingsPage() {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language.startsWith("fr") ? fr : enUS;

    const { data: bookingsData, isPending } = useMyBookings();
    const bookings = bookingsData || [];

    if (isPending) {
        return (
            <>
                <Banner title={t("reservations.reservations")} />
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <div className="loading size-8"></div>
                    <span className="font-medium">{t("reservations.loading")}</span>
                </div>
            </>
        );
    }

    // Fonction pour générer un badge de statut dynamique
    const getStatusBadge = (status: string, startDateStr: string, endDateStr: string) => {
        if (status === "cancelled") {
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">{t("state.cancelled")}</span>;
        }
        if (status === "pending") {
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">{t("state.pending")}</span>;
        }

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
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <p className="text-base-content/70 text-lg">{t("reservations.no-reservations")}</p>

                            <Link className="btn btn-wide m-auto btn-primary" to="/">
                                {t("reservations.explore-properties")}
                            </Link>

                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {bookings.map((booking) => {
                            const start = parseISO(booking.start_date);
                            const end = parseISO(booking.end_date);
                            const firstImage = booking.property.images?.[0]?.url;

                            return (
                                <div
                                    key={booking.id}
                                    className="card bg-base-200 shadow-lg"
                                >
                                    <figure>
                                        <img
                                            src={firstImage}
                                            alt={booking.property.title}
                                            className="w-full h-full rounded-2xl object-cover"
                                        />
                                    </figure>
                                    <div className="card-body">
                                        <div className="sm:w-64 h-48 sm:h-auto relative shrink-0" />

                                        <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between gap-4">
                                                    <Link
                                                        to={`/property/${booking.property.id}`}
                                                        className="text-xl font-bold text-gray-900 hover:text-blue-600 transition line-clamp-1"
                                                        viewTransition
                                                        style={{ '--tag': `property-title-${booking.property.id}` } as React.CSSProperties}
                                                    >
                                                        {booking.property.title}
                                                    </Link>
                                                    {getStatusBadge(booking.status, booking.start_date, booking.end_date)}
                                                </div>

                                                <div className="flex flex-col space-y-1.5 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                                                        <span>
                                                            {t("reservations.from")} {format(start, "dd MMMM yyyy", { locale: currentLocale })} {t("reservations.to")} {format(end, "dd MMMM yyyy", { locale: currentLocale })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <ReceiptIcon className="w-4 h-4 text-gray-400" />
                                                        <span>{t("reservations.total-amount")} : <strong className="text-gray-900">{booking.total_price}€</strong></span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="card-actions justify-end">
                                            <Link className="btn btn-soft" to={"/messages"} viewTransition={true}>
                                                <ChatCircleIcon />
                                                {t("reservations.contact-host")}
                                            </Link>
                                            <Link
                                                className="btn btn-primary btn-soft"
                                                to={`/reservation/${booking.id}`} viewTransition={true}
                                            >
                                                {t("reservations.view-booking")}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main >
        </>
    );
}