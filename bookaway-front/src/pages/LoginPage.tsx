import { useState } from "react";
import api from "../api/axios"; // Ton instance axios créée précédemment
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/Card";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/login", { email, password });

            const token = response.data.token;
            const userData = response.data.user;

            login(token, userData);

            navigate("/");
        } catch (err: any) {
            setError("Identifiants incorrects. Veuillez réessayer.");
        }
    };

    return (
        <main className="relative flex items-center justify-center h-full bg-cover bg-center bg-no-repeat bg-hero">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <Card className="z-10">
                <form onSubmit={handleLogin}>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Connexion à BookAway</h2>

                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">Email</label>
                            <input
                                type="email"
                                className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-600">Mot de passe</label>
                            <input
                                type="password"
                                className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition mt-2">
                            Se connecter
                        </button>
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Pas encore de compte ?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Inscrivez-vous gratuitement
                            </Link>
                        </div>
                    </div>
                </form>
            </Card>
        </main>
    );
}