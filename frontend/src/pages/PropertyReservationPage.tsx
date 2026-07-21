import { useLocation, Link, useNavigate } from "react-router";
import { differenceInDays, format } from "date-fns";
import { fr as dfFr, enUS as dfEnUS } from "date-fns/locale";
import { useState } from "react";
import { Card } from "../components/Card";
import { useTranslation } from "react-i18next";
import type { Property, Unit } from "../types";
import { CreditCardIcon } from "@phosphor-icons/react";
import { numberFormatter } from "../i18n/config";
import { useCurrentUser } from "../services/users";

export function PropertyReservationPage() {
    const { t, i18n } = useTranslation();
    const isFrench = i18n.language.startsWith("fr");
    const dfLocale = isFrench ? dfFr : dfEnUS;

    const location = useLocation();
    const navigate = useNavigate();
    const { data: user } = useCurrentUser();

    const { property, dateRange, unit }: { property: Property, dateRange: any, unit: Unit } = location.state || {};

    const numberOfNights = dateRange?.from && dateRange?.to
        ? differenceInDays(dateRange.to, dateRange.from)
        : 0;

    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!property || !dateRange || !dateRange.from || !dateRange.to || !numberOfNights) {
        return (
            <div className="card bg-base-200 shadow max-w-md m-auto">
                <div className="card-body">
                    <h2 className="text-title-small">{t("property-reservation.no-booking-title")}</h2>
                    <p className="text-base-content/80">{t("property-reservation.no-booking-text")}</p>
                </div>
                <div className="card-actions p-2 m-auto">
                    <Link to="/" className="btn btn-primary">
                        {t("property-reservation.back-home")}
                    </Link>
                </div>
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
            travelers: 1,
            start_date: format(fromDate, "yyyy-MM-dd"),
            end_date: format(toDate, "yyyy-MM-dd"),
            total_price: unit.price_per_night * numberOfNights + unit.base_fee,
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
                        <h2 className="text-title-small">
                            <CreditCardIcon />
                            Paiement via porte-feuille
                        </h2>

                        <p>Montant disponible : {numberFormatter.format(1000)}€</p>

                        <form action="">
                            <button className="btn btn-primary">Utiliser mon porte feuille</button>
                        </form>
                    </Card>

                    <Card>
                        <h2 className="text-title-small">
                            <CreditCardIcon />
                            Paiement par Carte Bancaire
                        </h2>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="name">{t("property-reservation.card-holder")}</label>
                                <input type="text" autoComplete="cc-name"
                                    id="name" className="input" value={cardHolderName}
                                    onChange={(e) => setCardHolderName(e.target.value)} placeholder="John Doe" required />
                            </fieldset>
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="name">{t("property-reservation.card-number")}</label>
                                <input required
                                    autoComplete="cc-number"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[\d ]{13,19}"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)} className="input" />
                            </fieldset>


                            <div className="grid grid-cols-2 gap-4">
                                <fieldset className="fieldset">
                                    <label className="label" htmlFor="name">{t("property-reservation.expiration")}</label>
                                    <input autoComplete="cc-exp"
                                        inputMode="numeric"
                                        maxLength={5}
                                        required
                                        value={expirationDate}
                                        onChange={(e) => setExpirationDate(e.target.value)}
                                        placeholder="MM/AA"
                                        className="input" />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <label className="label" htmlFor="name">{t("property-reservation.cvc")}</label>
                                    <input required
                                        autoComplete="cc-cvv"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]{3,4}"
                                        maxLength={4}
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        placeholder="123"
                                        className="input w-16" />
                                </fieldset>
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="btn btn-primary"
                            >
                                {t("property-reservation.confirm-button", { total: unit.price_per_night * numberOfNights + unit.base_fee })}
                            </button>
                        </form>
                    </Card>
                </div>

                <div className="card bg-base-200 shadow-lg lg:col-span-5 sticky top-8">
                    <figure>
                        <img src={property.images[0].url} alt="" />
                    </figure>
                    <div className="card-body">
                        <h3 className="text-title-small">{property.title}</h3>


                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800">{t("property-reservation.price-details")}</h4>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>
                                    {t("property-reservation.price-nights", { price: unit.price_per_night, count: numberOfNights })}
                                </span>
                                <span>{unit.price_per_night * numberOfNights}€</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>{t("property-reservation.service-fees")}</span>
                                <span>{unit.base_fee}€</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-bold text-gray-900 text-lg">
                                <span>{t("property-reservation.total")}</span>
                                <span>{numberFormatter.format(unit.price_per_night * numberOfNights + unit.base_fee)}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}