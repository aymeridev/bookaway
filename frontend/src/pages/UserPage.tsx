import { useParams, useNavigate } from "react-router";
import { useUserProperties } from "../hooks/apiHooks";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { fr as dfFr, enUS as dfEnUS } from "date-fns/locale";
import { PropertyCard } from "../components/property/PropertyCard";
import { ArrowLeftIcon, BuildingIcon, CalendarIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useUser } from "../services/users";

export function UserPage() {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading: isUserLoading } = useUser(id!);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const isFrench = i18n.language.startsWith("fr");
    const dfLocale = isFrench ? dfFr : dfEnUS;

    if (isUserLoading || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <SpinnerIcon className="w-12 h-12 animate-spin text-primary" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    {t("user-page.loading")}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost"
                >
                    <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
                    {t("user-page.back")}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Detail Card (Left Column) */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-base-200 border border-base-300 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col items-center text-center relative overflow-hidden transition-all duration-300">
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
                                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                                    <CalendarIcon className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                        {t("user-page.member-since")}
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                        {user.created_at ? format(new Date(user.created_at), "PPP", { locale: dfLocale }) : t("user-page.not-available")}
                                    </p>
                                </div>
                            </div>

                            {user.properties.length > 0 && (
                                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                                        <BuildingIcon className="size-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                            {t("user-page.label-listings")}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            {t("user-page.listings-count", { count: user.properties.length })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Listings Grid (Right Column) */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-base-200 border border-base-300 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-xl h-full flex flex-col">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-base-300 dark:border-gray-800">
                            <BuildingIcon className="size-6 text-primary" />
                            {t("user-page.user-listings", { name: user.name })}
                        </h2>

                        {user.properties.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                                {user.properties.map((property) => (
                                    <PropertyCard key={property.id} property={property} numberOfNights={0} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-base-300 dark:border-gray-800 rounded-2xl p-8 my-auto">
                                <div className="size-16 rounded-full bg-gray-50 dark:bg-base-300 flex items-center justify-center text-gray-400 mb-4">
                                    <BuildingIcon className="size-8" />
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
                                    {t("user-page.no-listings-title")}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                    {t("user-page.no-listings-desc", { name: user.name })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}