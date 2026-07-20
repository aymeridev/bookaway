import { useState } from "react";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router";
import { Card } from "../../components/Card";
import useAuthStore from "../../context/AuthStore";
import { useTranslation } from "react-i18next";
import { SignInIcon } from "@phosphor-icons/react";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login)
    const { t } = useTranslation();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/login", { email, password });

            const token = response.data.token;
            const userData = response.data.user;

            login(userData, token);

            navigate("/", { viewTransition: true });
        } catch {
            setError(t("login-page.error-invalid"));
        }
    };

    return (
        <main className="relative flex items-center justify-center h-full bg-cover bg-center bg-no-repeat bg-hero">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <div className="card bg-base-200 z-10">
                <div className="card-body">
                    <div className="alert alert-warning">
                        <span>Compte de test :</span>
                        <ul>
                            <li>Email : jean.dupont@bookaway.com</li>
                            <li>Mot de passe : <code>password</code></li>
                        </ul>
                        <button onClick={() => {
                            setEmail("jean.dupont@bookaway.com");
                            setPassword("password");
                        }} className="btn btn-soft btn-neutral">Utiliser</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{t("login-page.title")}</h2>

                        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

                        <div className="flex flex-col gap-4">
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="name">{t("login-page.label-email")}</label>
                                <input type="email"
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label" htmlFor="name">{t("login-page.label-password")}</label>
                                <input type="password"
                                    value={password}
                                    className="input"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </fieldset>


                            <button className="btn btn-primary">
                                <SignInIcon />
                                {t("login-page.button-submit")}
                            </button>
                            <div className="mt-6 text-center text-sm text-gray-600">
                                {t("login-page.no-account")}{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-600 font-bold hover:underline"
                                    viewTransition
                                >
                                    {t("login-page.register-link")}
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main >
    );
}