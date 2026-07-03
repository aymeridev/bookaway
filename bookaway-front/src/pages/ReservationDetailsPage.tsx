import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Calendar,
    MapPin,
    MessageSquare,
    Home,
    ArrowLeft,
    AlertTriangle,
    Loader2,
    CheckCircle2,
    XCircle,
    Receipt,
    Users
} from "lucide-react";
import api from "../api/axios";
import { useBookingDetails } from "../hooks/apiHooks";
import { Banner } from "../components/Banner";
import { Card } from "../components/Card";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";



export function ReservationDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: booking, isLoading: loading, error: apiError, setData: setBooking } = useBookingDetails(id);
    const error = apiError ? "Impossible de charger les détails de la réservation." : null;
    const [address, setAddress] = useState("Chargement de l'adresse...");
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        if (booking) {
            setAddress(booking.property?.address || "Adresse non spécifiée");
        }
    }, [booking]);

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
            toast.error("Impossible de contacter l'hôte.");
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
            toast.success("Réservation annulée avec succès.");
        } catch (err) {
            console.error("Error cancelling reservation:", err);
            toast.error("Une erreur est survenue lors de l'annulation.");
        } finally {
            setIsCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 font-medium">Chargement de votre réservation...</p>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <main className="max-w-4xl mx-auto p-6 text-center space-y-6">
                <Banner title="Détails de la réservation" />
                <Card className="flex flex-col items-center p-8 bg-red-50 border border-red-200 space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                    <p className="text-red-700 font-semibold">{error || "Réservation introuvable."}</p>
                    <Button onClick={() => navigate("/my-reservations")}>
                        <ArrowLeft className="w-4 h-4" /> Retour à mes réservations
                    </Button>
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
            <Banner title="Détails de la réservation" />

            <main className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Back button */}
                <div className="flex justify-start">
                    <Button variant="flat" onClick={() => navigate("/my-reservations")} className="group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Retour à mes réservations
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle Column (2 cols wide on desktop) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Property Details Card */}
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
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmé
                                            </span>
                                        ) : status === "cancelled" ? (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 shrink-0">
                                                <XCircle className="w-3.5 h-3.5" /> Annulé
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 flex items-center gap-1 shrink-0">
                                                En attente
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>
                                                Du {format(start, "dd MMMM yyyy", { locale: fr })} au {format(end, "dd MMMM yyyy", { locale: fr })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span>
                                                {number_persons} voyageurs
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Receipt className="w-4 h-4 text-gray-400" />
                                            <span>
                                                Montant total : <strong className="text-gray-900">{total_price}€</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-3">
                                    <Button variant="outline" asChild size="sm">
                                        <Link to={`/property/${property.id}`} className="flex items-center gap-2">
                                            <Home className="w-4 h-4" /> Voir le logement
                                        </Link>
                                    </Button>
                                    {status !== "cancelled" && (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => setIsCancelModalOpen(true)}
                                            className="ml-auto"
                                        >
                                            Annuler la réservation
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Cancellation Info Card (only if cancelled) */}
                        {status === "cancelled" && (
                            <Card className="bg-red-50/50 border border-red-200 p-6 space-y-3">
                                <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-600" /> Réservation annulée
                                </h3>
                                <div className="bg-white border border-red-100 rounded-xl p-4 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-800 mb-1">Motif d'annulation :</p>
                                    <p className="italic text-gray-600">
                                        "{cancellation_reason || "Aucun motif précisé."}"
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Column (1 col wide on desktop) */}
                    <div className="space-y-6">
                        {/* Se rendre au logement Card */}
                        <Card className="bg-white border border-gray-100 p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <MapPin className="w-5 h-5 text-blue-600" /> Se rendre au logement
                            </h3>

                            <div className="space-y-1">
                                <p className="text-xs uppercase font-semibold text-gray-400">Adresse</p>
                                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                    {address}
                                </p>
                            </div>

                            {property.latitude && property.longitude && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`,
                                            "_blank"
                                        )
                                    }
                                    className="w-full"
                                >
                                    Voir sur Google Maps
                                </Button>
                            )}
                        </Card>

                        {/* Hôte Card */}
                        <Card className="bg-white border border-gray-100 p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <MessageSquare className="w-5 h-5 text-blue-600" /> Hôte du logement
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {property.user?.name ? property.user.name.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {property.user?.name || "Hôte particulier"}
                                    </p>
                                    <p className="text-xs text-gray-400">Propriétaire</p>
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                onClick={handleContactHost}
                                className="w-full"
                            >
                                <MessageSquare className="w-4 h-4" /> Ouvrir la conversation
                            </Button>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Cancel Reservation Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <Card className="max-w-md w-full bg-white p-6 rounded-2xl shadow-2xl relative border border-gray-100 flex flex-col space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Annuler la réservation</h3>
                        <p className="text-sm text-gray-600">
                            Veuillez indiquer le motif de l'annulation de votre séjour. Ce motif sera enregistré et transmis à l'hôte.
                        </p>
                        <textarea
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            placeholder="Ex: Contretemps professionnel, problème de transport..."
                            className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                            required
                        />
                        <div className="flex justify-end gap-3 pt-2">
                            <Button
                                variant="flat"
                                type="button"
                                onClick={() => {
                                    setIsCancelModalOpen(false);
                                    setCancellationReason("");
                                }}
                                disabled={isCancelling}
                            >
                                Conserver
                            </Button>
                            <Button
                                variant="danger"
                                type="button"
                                onClick={handleCancelReservation}
                                isLoading={isCancelling}
                                disabled={!cancellationReason.trim()}
                            >
                                Confirmer l'annulation
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}