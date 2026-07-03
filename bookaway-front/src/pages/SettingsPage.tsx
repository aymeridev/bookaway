import { Trash2 } from "lucide-react";
import api from "../api/axios";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
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
        if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
            api.delete("/users/" + user?.id).then(() => {
                logout();
                navigate('/');
                toast.success("Compte désactivé avec succès");
            }).catch(() => {
                toast.error("Erreur lors de la désactivation du compte");
            })
        }
    }   

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
                    <p>Email : {user?.email}</p>
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
                    <h2 className="text-title-medium text-red-500">
                        {t("danger-zone")}
                    </h2>

                    <Button onClick={handleDelete} variant="danger">
                        <Trash2 />
                        {t("disable-account")}
                    </Button>
                </section>

            </main>
        </>
    )
}