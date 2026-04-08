import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/register", formData);
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription.");
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen py-10">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-lg border w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Créer un compte BookAway</h2>
                
                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

                <div className="flex flex-col gap-3">
                    {/* ... tes autres champs (firstname, lastname, email, password) restent identiques ... */}
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Prénom</label>
                        <input 
                            type="text" 
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Nom</label>
                        <input 
                            type="text" 
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <input 
                            type="email" 
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Mot de passe</label>
                        <input 
                            type="password" 
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-600">Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            className="border p-2 rounded-lg outline-blue-500 text-gray-900"
                            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                        <input 
                            type="checkbox" 
                            id="owner"
                            className="mt-1 w-5 h-5 cursor-pointer accent-green-600"
                            checked={formData.owner}
                            onChange={(e) => setFormData({...formData, owner: e.target.checked})}
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
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">
                        Connectez-vous
                    </Link>
                </div>
            </form>
        </main>
    );
}