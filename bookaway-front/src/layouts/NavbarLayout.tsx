import { useTranslation } from "react-i18next";
import { Link, Outlet, useNavigate } from "react-router";
import { User, LogOut } from "lucide-react";

export function NavbarLayout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const isAuthenticated = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-svh">
            <nav className="flex p-4 bg-blue-500 items-center shadow-md">
                <Link to={"/"} className="block">
                    <div
                        className="h-8 w-32 bg-center bg-contain bg-no-repeat cursor-pointer bg-logo"
                        aria-label="Retour à l'accueil"
                    ></div>
                </Link>
                <ul className="flex-1 flex justify-end text-white font-semibold items-center gap-6">
                    {!isAuthenticated ? (
                        <li>
                            <Link to={"/login"} className="hover:text-blue-200 transition">
                                {t('connexion')}
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to={"/profil"} className="flex items-center gap-2 hover:text-blue-200 transition">
                                    <User size={20} />
                                    <span>{t('profil')}</span>
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 hover:text-blue-200 rounded-lg transition"
                                >
                                    {/* <LogOut size={18} /> */}
                                    <span>{t('deconnexion')}</span>
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}