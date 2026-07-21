import api from "../api/axios";
import { Banner } from "../components/Banner";
import useAuthStore from "../context/AuthStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@phosphor-icons/react";
import { numberFormatter } from "../i18n/config";
import { useAddFunds, useCurrentUser } from "../services/users";

export function SettingsPage() {
    const { data: user } = useCurrentUser();
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { isPending, mutate } = useAddFunds();

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

            {user && <main className="p-8 space-y-8">
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

                <section className="card bg-base-200 shadow-lg">
                    <div className="card-body">
                        <h3 className="text-title-small">Porte-monnaie</h3>
                        <p>Montant actuel : <strong>{numberFormatter.format(user.balance / 100)}€</strong></p>
                        <span>Recharger le compte :</span>
                        {isPending ? <span className="loading"></span> : <ul className="flex gap-1">
                            <button onClick={() => {
                                mutate(100_00);
                            }} className="btn btn-primary">Recharger de 100€</button>
                        </ul>}
                    </div>
                </section>

                <section>

                    <button onClick={handleDelete} className="btn btn-error flex items-center gap-2">
                        <TrashIcon className="w-4 h-4" />
                        {t("disable-account")}
                    </button>
                </section>
            </main>}
        </>
    );
}