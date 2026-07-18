import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { format, parseISO } from "date-fns";
import { fr as dfFr, enUS as dfEnUS } from "date-fns/locale";
import api from "../api/axios";
import { useBookingDetails } from "../hooks/apiHooks";
import { Banner } from "../components/Banner";
import { Card } from "../components/Card";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, CalendarIcon, ChatCircleIcon, CheckCircleIcon, HouseIcon, MapPinIcon, ReceiptIcon, SpinnerIcon, UsersIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react";

export function ReservationDetailsPage() {
    const { t, i18n } = useTranslation();
    const isFrench = i18n.language.startsWith("fr");
    const dfLocale = isFrench ? dfFr : dfEnUS;

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: booking, isLoading: loading, error: apiError, setData: setBooking } = useBookingDetails(id);
    const error = apiError ? t("booking-details.load-error") : null;
    const [address, setAddress] = useState(t("booking-details.loading-address"));
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        if (booking) {
            setAddress(booking.property?.address || t("booking-details.no-address"));
        }
    }, [booking, t]);

    const handleContactHost = async () => {
        if (!booking?.property) return;
        try {
            const res = await api.post("/conversations", {
                property_id: booking.property.id,
            });
            const conversationId = res.data.id;
            navigate(`/messages?conversation_id=${conversationId}`);
        } catch (err) {
            console.error("Error starting conversation:", err);
            toast.error(t("booking-details.contact-error"));
        }
    };

    const handleCancelReservation = async () => {
        if (!id || !cancellationReason.trim()) return;
        try {
            setIsCancelling(true);
            const res = await api.put(`/bookings/${id}`, {
                status: "cancelled",
                cancellation_reason: cancellationReason,
            });
            setBooking(res.data);
            setIsCancelModalOpen(false);
            setCancellationReason("");
            toast.success(t("booking-details.cancel-success"));
        } catch (err) {
            console.error("Error cancelling reservation:", err);
            toast.error(t("booking-details.cancel-error"));
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <SpinnerIcon className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">{t("booking-details.loading-text")}</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <main className="max-w-4xl mx-auto p-6 text-center space-y-6">
                <Banner title={t("booking-details.page-title")} />
                <Card className="flex flex-col items-center p-8 bg-red-50 border border-red-200 space-y-4">
                    <WarningIcon className="w-12 h-12 text-red-500" />
                    <p className="text-red-700 font-semibold">{error || t("booking-details.not-found")}</p>
                    <button className="btn btn-primary" onClick={() => navigate("/my-reservations")}>
                        <ArrowLeftIcon className="w-4 h-4" /> {t("booking-details.back-btn")}
                    </button>
                </Card>
            </main>
        );
    }

    const { property, start_date, end_date, total_price, number_persons, status, cancellation_reason } = booking;
    const start = parseISO(start_date);
    const end = parseISO(end_date);
    const firstImage = property.images?.[0]?.url;

    return (
        <>
            <Banner title={t("booking-details.page-title")} />

            <main className="max-w-6xl mx-auto p-6 space-y-8">
                <div className="flex justify-start">
                    <button className="btn btn-ghost" onClick={() => navigate("/my-reservations")}>
                        <ArrowLeftIcon />
                        {t("booking-details.back-btn")}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden bg-white border border-gray-100 flex flex-col md:flex-row gap-6 p-6">
                            {firstImage && (
                                <div className="md:w-72 h-48 md:h-auto shrink-0 relative">
                                    <img
                                        src={firstImage}
                                        alt={property.title}
                                        className="w-full h-full rounded-xl object-cover shadow-sm"
                                    />
                                </div>
                            )}

                            <div className="flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">
                                            {property.title}
                                        </h2>
                                        {status === "confirmed" ? (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-1 shrink-0">
                                                <CheckCircleIcon className="w-3.5 h-3.5" /> {t("booking-details.status-confirmed")}
                                            </span>
                                        ) : status === "cancelled" ? (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 shrink-0">
                                                <XCircleIcon className="w-3.5 h-3.5" /> {t("booking-details.status-cancelled")}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 flex items-center gap-1 shrink-0">
                                                {t("booking-details.status-pending")}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                                            <span>
                                                {t("booking-details.dates-range", {
                                                    start: format(start, "dd MMMM yyyy", { locale: dfLocale }),
                                                    end: format(end, "dd MMMM yyyy", { locale: dfLocale })
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <UsersIcon className="w-4 h-4 text-gray-400" />
                                            <span>
                                                {t("booking-details.guests-count", { count: number_persons })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ReceiptIcon className="w-4 h-4 text-gray-400" />
                                            <span>
                                                {t("booking-details.total-amount")}<strong className="text-gray-900">{total_price}€</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-3">
                                    <Link to={`/property/${property.id}`} className="btn btn-outline btn-sm flex items-center gap-2">
                                        <HouseIcon className="w-4 h-4" /> {t("booking-details.view-property")}
                                    </Link>
                                    {status !== "cancelled" && (
                                        <button
                                            onClick={() => setIsCancelModalOpen(true)}
                                            className="btn btn-error btn-sm ml-auto"
                                        >
                                            {t("booking-details.cancel-btn")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {status === "cancelled" && (
                            <Card className="bg-red-50/50 border border-red-200 p-6 space-y-3">
                                <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                                    <XCircleIcon className="w-5 h-5 text-red-600" /> {t("booking-details.status-cancelled")}
                                </h3>
                                <div className="bg-white border border-red-100 rounded-xl p-4 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-800 mb-1">{t("booking-details.reason-label")}</p>
                                    <p className="italic text-gray-600">
                                        "{cancellation_reason || t("booking-details.no-reason")}"
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-white border border-gray-100 p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <MapPinIcon className="w-5 h-5 text-blue-600" /> {t("booking-details.go-to-property-title")}
                            </h3>

                            <div className="space-y-1">
                                <p className="text-xs uppercase font-semibold text-gray-400">{t("booking-details.address-label")}</p>
                                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                    {address}
                                </p>
                            </div>

                            {property.latitude && property.longitude && (
                                <button onClick={() =>
                                    window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
                                        "_blank"
                                    )
                                }
                                    className="btn btn-outline w-full"
                                >
                                    {t("booking-details.view-maps")}
                                </button>
                            )}
                        </Card>

                        <Card className="bg-white border border-gray-100 p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <ChatCircleIcon className="w-5 h-5 text-blue-600" /> {t("booking-details.host-title")}
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {property.user?.name ? property.user.name.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {property.user?.name || t("booking-details.host-default")}
                                    </p>
                                    <p className="text-xs text-gray-400">{t("booking-details.host-role")}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleContactHost}
                                className="btn btn-primary w-full"
                            >
                                <ChatCircleIcon className="w-4 h-4" /> {t("booking-details.open-chat")}
                            </button>
                        </Card>
                    </div>
                </div>
            </main>

            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <Card className="max-w-md w-full bg-white p-6 rounded-2xl shadow-2xl relative border border-gray-100 flex flex-col space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">{t("booking-details.modal-title")}</h3>
                        <p className="text-sm text-gray-600">
                            {t("booking-details.modal-desc")}
                        </p>
                        <textarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder={t("booking-details.modal-placeholder")}
                            className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                            required
                        />
                        <div className="flex justify-end gap-3 pt-2">
                            <button

                                className="btn btn-primary btn-outline"
                                type="button"
                                onClick={() => {
                                    setIsCancelModalOpen(false);
                                    setCancellationReason("");
                                }}
                                disabled={isCancelling}
                            >
                                {t("booking-details.modal-keep")}
                            </button>
                            <button
                                className="btn btn-error"
                                type="button"
                                onClick={handleCancelReservation}
                                disabled={!cancellationReason.trim()}
                            >
                                {t("booking-details.modal-confirm")}
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}