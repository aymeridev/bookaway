import useAuthStore from "../../context/AuthStore";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Banner } from "../../components/Banner";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ArrowRightIcon, BuildingIcon, CalendarIcon, MailboxIcon, MapPinIcon, TicketIcon, UserIcon } from "@phosphor-icons/react";
import { useCurrentUser } from "../../services/users";

export function ProfilePage() {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language.startsWith("fr") ? fr : enUS;

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { data: user, isPending } = useCurrentUser();
    const bookings = user?.bookings || [];

    if ((isAuthenticated && !user) || isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{t("profile-page.loading")}</p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="max-w-md mx-auto text-center py-20 px-4">
                <div className="size-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="size-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t("profile-page.unauthenticated")}</h2>
                <Link to="/login" className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all">
                    Se connecter
                </Link>
            </div>
        );
    }

    return (
        <>
            <Banner
                title={t("profile-page.banner-title")}
                description={t("profile-page.banner-description")}
            />
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Personal info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-base-200 border border-base-300 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
                            {/* Decorative top background gradient */}
                            <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-r from-blue-500 via-indigo-500 to-primary/80 opacity-90" />

                            {/* Avatar */}
                            <div className="relative z-10 mt-6 mb-4">
                                <div className="size-28 rounded-full border-4 border-white dark:border-base-200 shadow-xl overflow-hidden bg-base-100 flex items-center justify-center">
                                    <img
                                        src={`https://api.dicebear.com/10.x/thumbs/svg?seed=${user.id}`}
                                        alt={user.name}
                                        className="size-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                                {user.name}
                            </h2>

                            <div className="w-full border-b border-base-300 dark:border-gray-800 mb-6" />

                            {/* Detailed information list */}
                            <div className="w-full space-y-4 text-left">
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                                        <MailboxIcon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                            {t("profile-page.email-label")}
                                        </p>
                                        <p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                                        <CalendarIcon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                            {t("profile-page.personal-info")}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {user.created_at
                                                ? format(new Date(user.created_at), "PPP", { locale: currentLocale })
                                                : "N/A"
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 shrink-0">
                                        <TicketIcon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                            {t("profile-page.bookings-label")}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {bookings.length} {bookings.length > 1 ? t("profile-page.bookings-label").toLowerCase() : t("profile-page.bookings-label").toLowerCase().replace(/s$/, '')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bookings list */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-base-200 border border-base-300 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-base-300 dark:border-gray-800">
                                <TicketIcon className="size-6 text-primary" />
                                {t("profile-page.my-bookings")}
                            </h2>

                            <div className="grid gap-6">
                                {bookings.length > 0 ? (
                                    bookings.map((booking: any) => {
                                        // Status design configuration
                                        let statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/50";
                                        let statusText = t("state.pending");
                                        if (booking.status === "confirmed") {
                                            statusColor = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
                                            statusText = t("state.confirmed");
                                        } else if (booking.status === "cancelled") {
                                            statusColor = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
                                            statusText = t("state.cancelled");
                                        }

                                        const propertyImg = booking.property?.images?.[0]?.url;

                                        return (
                                            <div key={booking.id} className="group bg-base-100 dark:bg-base-200/50 border border-base-300 dark:border-gray-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center transition-all duration-300">

                                                {/* Property Image thumbnail */}
                                                <div className="relative size-full md:size-24 rounded-xl overflow-hidden shrink-0 bg-base-200 border border-base-300 dark:border-gray-800">
                                                    {propertyImg ? (
                                                        <img src={propertyImg} alt={booking.property?.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="size-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                                                            <BuildingIcon className="size-8" />
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
                                                        <CalendarIcon className="size-3.5" />
                                                        {t("profile-page.from")} {new Date(booking.start_date).toLocaleDateString(i18n.language)} {t("profile-page.to")} {new Date(booking.end_date).toLocaleDateString(i18n.language)}
                                                    </p>

                                                    {booking.property?.address && (
                                                        <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1.5 truncate">
                                                            <MapPinIcon className="size-3.5" />
                                                            {booking.property.address}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action and Price */}
                                                <div className="w-full md:w-auto flex md:flex-col justify-between items-center md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-base-300 dark:border-gray-800">
                                                    <div className="text-right">
                                                        <span className="block font-black text-xl text-primary">{booking.total_price} €</span>
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{t("profile-page.total-price")}</span>
                                                    </div>

                                                    <Link to={`/reservation/${booking.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors p-2 bg-primary/5 hover:bg-primary/10 rounded-lg">
                                                        {t("profile-page.details")}
                                                        <ArrowRightIcon className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                    </Link>
                                                </div>

                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-base-300 dark:border-gray-800 rounded-2xl p-8">
                                        <div className="size-16 rounded-full bg-gray-50 dark:bg-base-300 flex items-center justify-center text-gray-400 mb-4">
                                            <TicketIcon className="size-8" />
                                        </div>
                                        <p className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
                                            {t("profile-page.no-bookings")}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                            {t("profile-page.no-bookings-detail")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}