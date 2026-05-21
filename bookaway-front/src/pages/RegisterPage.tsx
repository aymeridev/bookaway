import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";
import { Card } from "../components/Card";
import useAuthStore from "../context/AuthStore";
import Input from "../components/ui/Input";

export function RegisterPage() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
        owner: false // 1. Initialisation à false
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login)


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

                console.log(token)
                console.log(userData);

                login(userData, token);


                navigate("/", { viewTransition: true });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription.");
        }
    };

    return (
        <main className="relative flex items-center justify-center h-full bg-cover bg-center bg-no-repeat bg-hero">
            <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>

            <Card className="z-10">
                <form onSubmit={handleRegister}>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Créer un compte BookAway</h2>

                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

                    <div className="flex flex-col gap-3">
                        <Input
                            label="Prénom"
                            type="text"
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                            required
                        />

                        <Input
                            label="Nom"
                            type="text"
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />


                        <Input
                            type="password"
                            label="Confirmer le mot de passe"
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            required
                        />

                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                            <input
                                type="checkbox"
                                id="owner"
                                className="mt-1 w-5 h-5 cursor-pointer accent-green-600"
                                checked={formData.owner}
                                onChange={(e) => setFormData({ ...formData, owner: e.target.checked })}
                            />
                            <label htmlFor="owner" className="text-sm text-gray-700 cursor-pointer select-none">
                                <span className="font-bold block text-gray-800">Je suis un propriétaire</span>
                                Je souhaite mettre mes logements en ligne sur BookAway.
                            </label>
                        </div>

                        <button type="submit" className="bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition mt-4">
                            S'inscrire
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
                        Déjà un compte ?{" "}
                        <Link to="/login" className="text-blue-600 font-bold hover:underline" viewTransition>
                            Connectez-vous
                        </Link>
                    </div>
                </form>
            </Card>
        </main>
    );
}