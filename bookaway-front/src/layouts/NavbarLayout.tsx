import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { Calendar, ChevronDown, Eye, LandPlot, LogIn, LogOut, Moon, Settings, Sun, User, MessageSquare } from "lucide-react";
import useAuthStore from "../context/AuthStore";
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import api from "../api/axios";

interface ConversationNotification {
    id: number;
    unread_count: number;
}

export function NavbarLayout() {
    const { t } = useTranslation();


    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [unreadCount, setUnreadCount] = useState<number>(0);
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchNotifications = async () => {
            try {
                const res = await api.get('/conversations');
                const conversations: ConversationNotification[] = res.data;
                // Calcule la somme de tous les unread_count
                const total = conversations.reduce((acc, conv) => acc + (conv.unread_count || 0), 0);
                setUnreadCount(total);
            } catch (error) {
                console.error("Impossible de charger les notifications de messages", error);
            }
        };

        fetchNotifications();

        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);

    }, [isAuthenticated, location]);

    return (
        <div className="bg-base-100 text-base-content transition-colors duration-200 flex flex-col h-svh">
            <nav className="flex mx-4 mt-4 rounded-full p-3 bg-primary border-primary-content border-2 text-primary-content items-center shadow-md">
                <Link to={"/"} className="block" viewTransition>
                    <div
                        className="h-8 w-32 bg-center bg-contain bg-no-repeat cursor-pointer bg-logo"
                        aria-label="Retour à l'accueil"
                    ></div>
                </Link>
                <ul className="flex gap-1">
                    {isAuthenticated ? (
                        <>
                            <ListNavLink
                                to={"/my-reservations"}>
                                <Calendar />
                                {t("header.reservations")}
                            </ListNavLink>
                            <ListNavLink
                                to={"/my-properties"}>
                                <LandPlot />
                                {t("header.accommodation")}
                            </ListNavLink>
                            <ListNavLink to={"/messages"}>
                                <div className="relative flex items-center gap-2">
                                    <MessageSquare />
                                    <span>{t("header.messaging")}</span>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                            </ListNavLink>
                        </>
                    ) : (<></>)}
                </ul>
                <ul className="flex-1 flex justify-end text-white font-semibold items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            <ProfileButton />
                        </>
                    ) : (
                        <ListNavLink to={"/login"}>
                            <LogIn />
                            <span>{t('connexion')}</span>
                        </ListNavLink>

                    )}
                </ul>
            </nav>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div >
    );
}

function ProfileButton() {

    const { t } = useTranslation();
    let [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const menuRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (!showDetails) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowDetails(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDetails]);

    useEffect(() => {
        setShowDetails(false);
    }, [location]);

    const handleLogout = () => {
        setShowDetails(false);
        localStorage.removeItem("token");
        navigate("/login");
        logout();
    };

    const { isDark, toggleTheme } = useDarkMode();

    return (
        <>
            <li ref={menuRef} className="relative">
                <button onClick={() => {
                    setShowDetails(!showDetails);
                }} className="flex border border-transparent hover:bg-blue-100 p-2 rounded-lg">
                    <div aria-hidden="true" className="rounded-full size-8" style={{ backgroundImage: `url("https://api.dicebear.com/10.x/thumbs/svg?seed=${user?.id}")` }}></div>
                    <ChevronDown className={showDetails ? "rotate-180" : ""} />
                </button>
                {showDetails && <div className="bg-base-200 text-base-content rounded-xl shadow-xl absolute top-10 right-0 min-w-xs z-20">
                    <ul className="flex flex-col">
                        <li>
                            <Link className="p-2 flex items-center justify-center" to={"/profile"} viewTransition>
                                <User />
                                <span className="flex-1">{t('profil.my-profil')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="p-2 flex items-center justify-center" to={`/user/${user?.id}`} viewTransition>
                                <Eye />
                                <span className="flex-1">{t('profil.public-profil')}</span>
                            </Link>
                        </li>

                        <li>
                            <Link className="p-2 flex items-center justify-center" to={"/settings"} viewTransition>
                                <Settings />
                                <span className="flex-1">{t('profil.settings')}</span>
                            </Link>
                        </li>
                        <li>
                            <button onClick={toggleTheme} className="p-2 cursor-pointer flex items-center justify-center">
                                {isDark ? <Sun /> : <Moon />}
                                <span className="flex-1">Mode {isDark ? "clair" : "sombre"}</span>
                            </button>
                        </li>
                        <li>
                            <button className="p-2 flex items-center justify-center" onClick={handleLogout}>
                                <LogOut />
                                <span className="flex-1">{t('deconnexion')}</span>
                            </button>
                        </li>
                    </ul>
                </div>}
            </li>
            <li>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-blue-200 rounded-lg"
                >

                </button>
            </li>
        </>
    )
}

function ListNavLink({ to, children }: { to: string, children: React.ReactNode }) {
    return <li>
        <NavLink
            className={({ isActive }) => `${isActive ? "bg-primary text-primary-content" : "text-white hover:bg-blue-600 active:bg-blue-700"} py-2 px-4 rounded-lg font-semibold flex gap-2 items-center justify-center transition-colors`}
            to={to} viewTransition>
            {children}
        </NavLink>
    </li>
}