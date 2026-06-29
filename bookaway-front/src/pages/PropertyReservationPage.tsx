import { useLocation, Link, useNavigate } from "react-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import useAuthStore from "../context/AuthStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Card } from "../components/Card";

export function PropertyReservationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    // Récupération des données passées dans le State
    const { property, dateRange, totals } = location.state || {};

    // États pour le formulaire de carte bancaire
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!property || !dateRange || !totals) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-6 bg-white border rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation en cours</h2>
                <p className="text-gray-600 mb-6">Veuillez sélectionner un logement et des dates valides avant d'accéder au récapitulatif.</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700">
                    Retour à l'accueil
                </Link>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-6 bg-white border rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Connexion requise</h2>
                <p className="text-gray-600 mb-6">Vous devez être connecté pour effectuer une réservation.</p>
                <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700">
                    Se connecter
                </Link>
            </div>
        );
    }

    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            user_id: user.id,
            property_id: property.id,
            number_persons: 1,
            start_date: format(fromDate, "yyyy-MM-dd"),
            end_date: format(toDate, "yyyy-MM-dd"),
            total_price: totals.grandTotal,

            card_holder_name: cardHolderName,
            card_number: cardNumber,
            expiration_date: expirationDate,
            cvv: cvv
        };

        try {
            // Remplace l'URL par l'adresse de ton API Laravel locale ou distante
            const response = await fetch("http://localhost:8000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    // "Authorization": `Bearer ${token}` // Si ton API est protégée par Sanctum / Passport
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la réservation");
            }

            await response.json();
            alert("Paiement et réservation enregistrés avec succès !");
            navigate("/"); // Redirection vers l'accueil

        } catch (error: any) {
            alert(`Échec : ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link to={-1 as any} className="hover:underline flex items-center gap-1">
                    ← Modifier la sélection
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Demande de réservation</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 space-y-8">

                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800">Votre séjour</h2>
                        <div className="flex justify-between items-center py-2">
                            <div>
                                <p className="font-medium text-gray-900">Dates</p>
                                <p className="text-sm text-gray-600">
                                    Du {format(fromDate, "dd MMMM yyyy", { locale: fr })} au {format(toDate, "dd MMMM yyyy", { locale: fr })}
                                </p>
                            </div>
                            <Link to={-1 as any} className="text-sm font-semibold underline text-blue-600 hover:text-blue-800">
                                Modifier
                            </Link>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800">Paiement</h2>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <Input
                                label="Nom sur la carte"
                                required
                                type="text"
                                value={cardHolderName}
                                onChange={(e) => setCardHolderName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full p-3 border rounded-xl outline-none focus:border-indigo-500 transition"
                            />

                            <Input
                                required
                                label="Numéro de carte"
                                type="text"
                                maxLength={16}
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="0000 0000 0000 0000"
                                className="w-full p-3 border rounded-xl outline-none focus:border-indigo-500 transition"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Expiration"
                                    required
                                    type="text"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    placeholder="MM/AA"
                                    className="w-full p-3 border rounded-xl outline-none focus:border-indigo-500 transition"
                                />
                                <Input
                                    required
                                    label="Code CVC"
                                    type="text"
                                    maxLength={3}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="123"
                                    className="w-full p-3 border rounded-xl outline-none focus:border-indigo-500 transition"
                                />
                            </div>

                            <Button
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                className={`w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4 font-bold rounded-xl hover:shadow-lg hover:opacity-95 transition-all cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Confirmer et payer {totals.grandTotal}€
                            </Button>
                        </form>
                    </Card>
                </div>


                <Card className="lg:col-span-5 sticky top-8">
                    <div className="flex gap-4 pb-6 border-b border-gray-100">

                        <div className="flex flex-col justify-center">
                            <h3 className="font-bold text-gray-900 line-clamp-2">{property.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">Hébergement vérifié</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Détails du prix</h4>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>{property.price_per_night}€ x {totals.numberOfNights} nuits</span>
                            <span>{totals.nightsTotal}€</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Frais de service</span>
                            <span>{totals.basePrice}€</span>
                        </div>
                        <hr className="border-gray-100" />
                        <div className="flex justify-between font-bold text-gray-900 text-lg">
                            <span>Total (EUR)</span>
                            <span>{totals.grandTotal}€</span>
                        </div>
                    </div>
                </Card>
            </div >
        </div >
    );
}