import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { Calendar, ChevronDown, Eye, LandPlot, LogIn, LogOut, Moon, Settings, Sun, User, MessageSquare, Menu, X } from "lucide-react";
import useAuthStore from "../context/AuthStore";
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useConversations } from "../hooks/apiHooks";

export function NavbarLayout() {
    const { t } = useTranslation();
    const location = useLocation();
    const navRef = useRef<HTMLElement>(null);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { data: conversations, refetch } = useConversations(isAuthenticated ? 30000 : undefined);

    useEffect(() => {
        if (isAuthenticated) {
            refetch();
        }
    }, [location, isAuthenticated, refetch]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const unreadCount = conversations
        ? conversations.reduce((acc, conv) => acc + (conv.unread_count || 0), 0)
        : 0;

    return (
        <div className="bg-base-100 text-base-content transition-colors duration-200 flex flex-col h-svh">
            <nav ref={navRef} className="relative flex mx-4 mt-4 rounded-full p-3 bg-primary border-primary-content border-2 text-primary-content items-center justify-between shadow-md">
                <div className="flex items-center gap-6">
                    <Link to={"/"} className="block" viewTransition>
                        <div
                            className="h-8 w-32 bg-center bg-contain bg-no-repeat cursor-pointer bg-logo"
                            aria-label="Retour à l'accueil"
                        ></div>
                    </Link>
                    {isAuthenticated && (
                        <ul className="hidden md:flex gap-1">
                            <ListNavLink to={"/my-reservations"}>
                                <Calendar />
                                {t("header.reservations")}
                            </ListNavLink>
                            <ListNavLink to={"/my-properties"}>
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
                        </ul>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <ProfileButton key={location.pathname} />
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors text-white"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </>
                    ) : (
                        <ListNavLink to={"/login"}>
                            <LogIn />
                            <span>{t('connexion')}</span>
                        </ListNavLink>
                    )}
                </div>

                {/* Mobile Dropdown Menu */}
                {isAuthenticated && isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-primary border-primary-content border-2 rounded-2xl p-4 text-primary-content shadow-xl flex flex-col gap-2 z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <ul className="flex flex-col gap-2 w-full">
                            <li>
                                <NavLink
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-3 px-4 rounded-lg font-semibold flex gap-3 items-center transition-colors w-full`}
                                    to={"/my-reservations"} viewTransition>
                                    <Calendar />
                                    {t("header.reservations")}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-3 px-4 rounded-lg font-semibold flex gap-3 items-center transition-colors w-full`}
                                    to={"/my-properties"} viewTransition>
                                    <LandPlot />
                                    {t("header.accommodation")}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-3 px-4 rounded-lg font-semibold flex gap-3 items-center transition-colors w-full`}
                                    to={"/messages"} viewTransition>
                                    <div className="relative flex items-center gap-3 w-full">
                                        <MessageSquare />
                                        <span className="flex-1 text-left">{t("header.messaging")}</span>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

function ProfileButton() {

    const { t } = useTranslation();
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();
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