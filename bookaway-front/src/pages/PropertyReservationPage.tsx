import { useLocation, Link, useNavigate } from "react-router";
import { format } from "date-fns";
import { fr as dfFr, enUS as dfEnUS } from "date-fns/locale";
import { useState } from "react";
import useAuthStore from "../context/AuthStore";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Card } from "../components/Card";
import { useTranslation } from "react-i18next";

export function PropertyReservationPage() {
    const { t, i18n } = useTranslation();
    const isFrench = i18n.language.startsWith("fr");
    const dfLocale = isFrench ? dfFr : dfEnUS;

    const location = useLocation();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const { property, dateRange, totals } = location.state || {};

    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!property || !dateRange || !dateRange.from || !dateRange.to || !totals) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-6 bg-white border rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t("property-reservation.no-booking-title")}</h2>
                <p className="text-gray-600 mb-6">{t("property-reservation.no-booking-text")}</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700">
                    {t("property-reservation.back-home")}
                </Link>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-6 bg-white border rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{t("property-reservation.login-required-title")}</h2>
                <p className="text-gray-600 mb-6">{t("property-reservation.login-required-text")}</p>
                <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700">
                    {t("property-reservation.login-btn")}
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
            const response = await fetch("http://localhost:8000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la réservation");
            }

            await response.json();
            alert(t("property-reservation.success-alert"));
            navigate("/");

        } catch (error: any) {
            alert(`${t("property-reservation.error-prefix")}${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link to={-1 as any} className="hover:underline flex items-center gap-1">
                    {t("property-reservation.edit-selection")}
                </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{t("property-reservation.page-title")}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 space-y-8">

                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800">{t("property-reservation.your-stay")}</h2>
                        <div className="flex justify-between items-center py-2">
                            <div>
                                <p className="font-medium text-gray-900">{t("property-reservation.dates-label")}</p>
                                <p className="text-sm text-gray-600">
                                    {t("property-reservation.dates-range", {
                                        start: format(fromDate, "dd MMMM yyyy", { locale: dfLocale }),
                                        end: format(toDate, "dd MMMM yyyy", { locale: dfLocale })
                                    })}
                                </p>
                            </div>
                            <Link to={-1 as any} className="text-sm font-semibold underline text-blue-600 hover:text-blue-800">
                                {t("property-reservation.edit-btn")}
                            </Link>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800">{t("property-reservation.payment")}</h2>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <Input
                                label={t("property-reservation.card-holder")}
                                required
                                autoComplete="cc-name"
                                value={cardHolderName}
                                onChange={(e) => setCardHolderName(e.target.value)}
                                placeholder="John Doe"
                            />

                            <Input
                                required
                                autoComplete="cc-number"
                                label={t("property-reservation.card-number")}
                                type="text"
                                inputMode="numeric"
                                pattern="[\d ]{13,19}"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="0000 0000 0000 0000"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label={t("property-reservation.expiration")}
                                    autoComplete="cc-exp"
                                    inputMode="numeric"
                                    maxLength={5}
                                    required
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    placeholder="MM/AA"
                                />
                                <Input
                                    required
                                    label={t("property-reservation.cvc")}
                                    autoComplete="cc-cvv"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{3,4}"
                                    maxLength={4}
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="123"
                                />
                            </div>

                            <Button
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                {t("property-reservation.confirm-button", { total: totals.grandTotal })}
                            </Button>
                        </form>
                    </Card>
                </div>

                <Card className="lg:col-span-5 sticky top-8">
                    <div className="flex gap-4 pb-6 border-b border-gray-100">
                        <div className="flex flex-col justify-center">
                            <h3 className="font-bold text-gray-900 line-clamp-2">{property.title}</h3>
                            <p className="text-xs text-gray-400 mt-1">{t("property-reservation.verified-property")}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">{t("property-reservation.price-details")}</h4>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>
                                {t("property-reservation.price-nights", { price: property.price_per_night, count: totals.numberOfNights })}
                            </span>
                            <span>{totals.nightsTotal}€</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>{t("property-reservation.service-fees")}</span>
                            <span>{totals.basePrice}€</span>
                        </div>
                        <hr className="border-gray-100" />
                        <div className="flex justify-between font-bold text-gray-900 text-lg">
                            <span>{t("property-reservation.total")}</span>
                            <span>{totals.grandTotal}€</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}