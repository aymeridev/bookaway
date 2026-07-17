import { Trash2 } from "lucide-react";
import api from "../api/axios";
import { Banner } from "../components/Banner";
import useAuthStore from "../context/AuthStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function SettingsPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleDelete = () => {
        if (confirm(t("settings-page.delete-confirm"))) {
            api.delete("/users/" + user?.id)
                .then(() => {
                    logout();
                    navigate('/');
                    toast.success(t("settings-page.delete-success"));
                })
                .catch(() => {
                    toast.error(t("settings-page.delete-error"));
                });
        }
    };

    const changeLanguage = (lang: "fr" | "en") => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <>
            <Banner title={t("settings")} />

            <main className="p-8 space-y-8">
                <section>
                    <h2 className="text-title-medium">{t("profil.my-profil")}</h2>
                    <p>{t("profil.name")} : {user?.name}</p>
                    <p>Email: {user?.email}</p>
                </section>

                <section>
                    <h2 className="text-title-medium">{t("language")}</h2>

                    <select
                        className="select select-bordered mt-2"
                        value={i18n.language}
                        onChange={(e) => changeLanguage(e.target.value as "fr" | "en")}
                    >
                        <option value="fr">🇫🇷 Français</option>
                        <option value="en">🇬🇧 English</option>
                    </select>
                </section>

                <section>

                    <button onClick={handleDelete} className="btn btn-error flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        {t("disable-account")}
                    </button>
                </section>
            </main>
        </>
    );
}