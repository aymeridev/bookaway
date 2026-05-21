import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/Card";
import useAuthStore from "../context/AuthStore";
import { LogIn } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/login", { email, password });

            const token = response.data.token;
            const userData = response.data.user;

            login(userData, token);

            navigate("/", { viewTransition: true });
        } catch (err: any) {
            setError("Identifiants incorrects. Veuillez réessayer.");
        }
    };

    return (
        <main className="relative flex items-center justify-center h-full bg-cover bg-center bg-no-repeat bg-hero">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <Card className="z-10">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Connexion à BookAway</h2>

                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

                    <div className="flex flex-col gap-4">
                        <Input
                            label="Adresse e-mail"
                            type="email"
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            label="Mot de passe"
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button>
                            <LogIn />
                            Se connecter
                        </Button>
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
        </main >
    );
}