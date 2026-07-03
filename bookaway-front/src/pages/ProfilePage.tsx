import { Card } from "../components/Card";
import useAuthStore from "../context/AuthStore";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Banner } from "../components/Banner";
import { useUserProfile } from "../hooks/apiHooks";
import { useTranslation } from "react-i18next";

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
                            <div className="text-right">
                                <span className="block font-bold">{booking.total_price} €</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">{t("profile-page.no-bookings")}</p>
                )}
            </div>
        </div>
    </>;
}