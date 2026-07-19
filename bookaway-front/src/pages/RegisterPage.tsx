import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";
import useAuthStore from "../context/AuthStore";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon } from "@phosphor-icons/react";

export function RegisterPage() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/register", formData);
            if (res.status === 201) {
                const { email, password } = formData;
                const response = await api.post("/login", { email, password });

                const token = response.data.token;
                const userData = response.data.user;

                login(userData, token);

                navigate("/", { viewTransition: true });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || t("register.default-error"));
        }
    };

    return (
        <main className="relative flex items-center justify-center h-full bg-cover bg-center bg-no-repeat bg-hero">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <div className="card bg-base-100 p-8 shadow-2xl">
                <form onSubmit={handleRegister}>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{t("register.title")}</h2>

                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">{t("register.firstname-label")}</legend>
                                <input className="input" type="text"
                                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                    placeholder="Jean"
                                    name="first-name"
                                    autoComplete="name"
                                    required />
                            </fieldset>

                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">{t("register.lastname-label")}</legend>
                                <input className="input" type="text"
                                    autoComplete="family-name"
                                    name="last-name"
                                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                    placeholder="Dupont"
                                    required />
                            </fieldset>

                        </div>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">{t("register.email-label")}</legend>
                            <input className="input" type="email"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="jean.dupont@..."
                                autoComplete="email"
                                required />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">{t("register.password-label")}</legend>
                            <input className="input" type="password"
                                placeholder="********"
                                autoComplete="new-password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required />
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">{t("register.confirm-password-label")}</legend>
                            <input className="input" type="password"
                                placeholder="********"
                                autoComplete="new-password"
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                required />
                        </fieldset>


                        <button type="submit" className="btn btn-primary btn-lg">
                            <CheckCircleIcon />
                            S'inscrire
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
                        {t("register.already-account")}{" "}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline" viewTransition>
                            {t("register.login-link")}
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}