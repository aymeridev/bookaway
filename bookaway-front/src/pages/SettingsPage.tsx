import { Trash2 } from "lucide-react";
import api from "../api/axios";
import { Banner } from "../components/Banner";
import Button from "../components/ui/Button";
import useAuthStore from "../context/AuthStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export function SettingsPage() {

    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

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

    return (
        <>
            <Banner title="Paramètres" />
            <main className="p-8">
                <h2 className="text-title-medium">Profil</h2>
                <p>Nom: {user?.name}</p>
                <p>Email: {user?.email}</p>
                <h2 className="text-title-medium">Autres actions</h2>
                <Button onClick={handleDelete} variant="danger">
                    <Trash2 />
                    Désactiver le compte
                </Button>
            </main>
        </>
    )
}