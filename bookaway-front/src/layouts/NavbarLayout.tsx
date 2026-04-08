import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { Calendar, LandPlot, LogIn, LogOut, User } from "lucide-react";
import useAuthStore from "../context/AuthStore";

export function NavbarLayout() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-svh">
            <nav className="flex p-4 bg-blue-500 items-center shadow-md">
                <Link to={"/"} className="block" viewTransition>
                    <div
                        className="h-8 w-32 bg-center bg-contain bg-no-repeat cursor-pointer bg-logo"
                        aria-label="Retour à l'accueil"
                    ></div>
                </Link>
                <ul className="flex">
                    <ListNavLink
                        to={"/bookings"}>
                        <Calendar />
                        Mes réservations
                    </ListNavLink>
                    <ListNavLink
                        to={"/my-properties"}>
                        <LandPlot />
                        Mes logements
                    </ListNavLink>
                </ul>
                <ul className="flex-1 flex justify-end text-white font-semibold items-center gap-6">
                    {user ? (
                        <>
                            <li>
                                <Link to={"/profil"} className="flex items-center gap-2 transition" viewTransition>
                                    <User />
                                    <span>{t('profil')}</span>
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 hover:text-blue-200 rounded-lg"
                                >
                                    <LogOut />
                                    <span>{t('deconnexion')}</span>
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to={"/login"} className="flex items-center gap-2 transition" viewTransition>
                                <LogIn />
                                <span>{t('connexion')}</span>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div >
    );
}

function ListNavLink({ to, children }: { to: string, children: React.ReactNode }) {
    return <li>
        <NavLink
            className={({ isActive }) => `${isActive ? "bg-white text-blue-500" : "text-white"} p-2 rounded-lg font-semibold flex gap-2 items-center justify-center`}
            to={to} viewTransition>
            {children}
        </NavLink>
    </li>
}