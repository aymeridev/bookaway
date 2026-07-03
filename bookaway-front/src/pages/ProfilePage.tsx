import useAuthStore from "../context/AuthStore";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Banner } from "../components/Banner";
import { useUserProfile } from "../hooks/apiHooks";
import { useTranslation } from "react-i18next";
import { Mail, Calendar, MapPin, Ticket, Building, ArrowRight, User } from "lucide-react";
import { Link } from "react-router";

export function ProfilePage() {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language.startsWith("fr") ? fr : enUS;

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const { data: profileData, isLoading: isProfileLoading } = useUserProfile(user?.id);
    const bookings = profileData?.bookings || [];

    if ((isAuthenticated && !user) || isProfileLoading) {
        return <p>{t("profile-page.loading")}</p>;
    }

    if (!isAuthenticated) {
        return <p>{t("profile-page.unauthenticated")}</p>;
    }

    return <>
        <Banner title={t("profile-page.banner-title")} />
        <div className="max-w-4xl mx-auto p-8">

            {user && <Card>
                <h2 className="text-xl font-semibold mb-4 border-b border-b-gray-230 pb-2">{t("profile-page.personal-info")}</h2>
                <div className="space-y-2">
                    <p><span className="font-bold">{t("profile-page.name")}</span> {user.name}</p>
                    <p><span className="font-bold">{t("profile-page.email")}</span> {user.email}</p>
                    <p>
                        <span className="font-bold">
                            {t("profile-page.member-since", {
                                date: format(new Date(user.created_at), "PPP", { locale: currentLocale })
                            })}
                        </span>
                    </p>
                </div>
            </Card>}

            <h2 className="text-2xl font-bold mb-4 mt-8">{t("profile-page.my-bookings")}</h2>
            <div className="grid gap-4">
                {bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                        <div key={booking.id} className="bg-gray-50 p-4 rounded-xl border flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-blue-600">{booking.property?.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {t("profile-page.from")} {format(new Date(booking.start_date), "dd/MM/yyyy")} {t("profile-page.to")} {format(new Date(booking.end_date), "dd/MM/yyyy")}
                                </p>
                            </div>
                        </div>
                    </div>

            {/* Right Column: Bookings list */}
            <div className="lg:col-span-2">
                <div className="bg-white dark:bg-base-200 border border-base-300 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-base-300 dark:border-gray-800">
                        <Ticket className="size-6 text-primary" />
                        Mes Réservations
                    </h2>

                    <div className="grid gap-6">
                        {bookings.length > 0 ? (
                            bookings.map((booking: any) => {
                                // Status design configuration
                                let statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50";
                                let statusText = "En attente";
                                if (booking.status === "confirmed") {
                                    statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
                                    statusText = "Confirmée";
                                } else if (booking.status === "cancelled") {
                                    statusColor = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
                                    statusText = "Annulée";
                                }

                                const propertyImg = booking.property?.images?.[0]?.url;

                                return (
                                    <div key={booking.id} className="group bg-base-100 dark:bg-base-200/50 border border-base-300 dark:border-gray-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center hover:shadow-lg transition-all duration-300">

                                        {/* Property Image thumbnail */}
                                        <div className="relative size-full md:size-24 rounded-xl overflow-hidden shrink-0 bg-base-200 border border-base-300 dark:border-gray-800">
                                            {propertyImg ? (
                                                <img src={propertyImg} alt={booking.property?.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="size-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                                    <Building className="size-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Booking Details */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusColor}`}>
                                                    {statusText}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                                {booking.property?.title}
                                            </h3>

                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                <Calendar className="size-3.5" />
                                                Du {new Date(booking.start_date).toLocaleDateString('fr-FR')} au {new Date(booking.end_date).toLocaleDateString('fr-FR')}
                                            </p>

                                            {booking.property?.address && (
                                                <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1.5 truncate">
                                                    <MapPin className="size-3.5" />
                                                    {booking.property.address}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action and Price */}
                                        <div className="w-full md:w-auto flex md:flex-col justify-between items-center md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-base-300 dark:border-gray-800">
                                            <div className="text-right">
                                                <span className="block font-black text-xl text-primary">{booking.total_price} €</span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Prix total</span>
                                            </div>

                                            <Link to={`/reservation/${booking.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors p-2 bg-primary/5 hover:bg-primary/10 rounded-lg">
                                                Détails
                                                <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </Link>
                                        </div>

                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-base-300 dark:border-gray-800 rounded-2xl p-8">
                                <div className="size-16 rounded-full bg-gray-50 dark:bg-base-300 flex items-center justify-center text-gray-400 mb-4">
                                    <Ticket className="size-8" />
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 font-semibold mb-1">Aucune réservation</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                    Vous n'avez pas encore effectué de réservation sur Bookaway.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                ))
                ) : (
                <p className="text-gray-500 italic">{t("profile-page.no-bookings")}</p>
                )}
            </div>
        </>
        );
}