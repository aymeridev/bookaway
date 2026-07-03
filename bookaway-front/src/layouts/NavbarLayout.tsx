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

    const noBannerRoutes = [
        "/search",
        "/messages",
        "/reservation",
    ];
    const isNoBannerRoute = noBannerRoutes.includes(location.pathname) || 
        (location.pathname.startsWith("/property/") && !location.pathname.endsWith("/edit")) ||
        location.pathname.startsWith("/user/");

    return (
        <div className="bg-base-100 text-base-content transition-colors duration-200 flex flex-col h-svh relative">
            <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
                <nav ref={navRef} className="pointer-events-auto flex mx-4 mt-4 rounded-full p-3 bg-primary border-primary-content border-2 text-primary-content items-center justify-between shadow-md">
                    <div className="flex items-center gap-6">
                        <Link to={"/"} className="block" viewTransition>
                            <div
                                className="h-8 w-32 bg-center bg-contain bg-no-repeat cursor-pointer bg-logo"
                                aria-label="Retour à l'accueil"
                            ></div>
                        </Link>
                        {isAuthenticated && (
                            <ul className="hidden md:flex gap-1 list-none p-0 m-0">
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

                    <ul className="flex items-center gap-3 list-none p-0 m-0">
                        {isAuthenticated ? (
                            <>
                                <ProfileButton key={location.pathname} />
                                <li className="list-none md:hidden">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="flex items-center justify-center p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all text-white cursor-pointer"
                                        aria-label="Toggle menu"
                                    >
                                        {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <ListNavLink to={"/login"}>
                                <LogIn />
                                <span>{t('connexion')}</span>
                            </ListNavLink>
                        )}
                    </ul>

                    {/* Mobile Dropdown Menu */}
                    {isAuthenticated && isMobileMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-primary border-primary-content border-2 rounded-2xl p-4 text-primary-content shadow-xl flex flex-col gap-2 z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <ul className="flex flex-col gap-2 w-full list-none p-0 m-0">
                                <li className="list-none">
                                    <NavLink
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-3 px-4 rounded-xl font-semibold flex gap-3 items-center transition-all duration-200 w-full`}
                                        to={"/my-reservations"} viewTransition>
                                        <Calendar />
                                        {t("header.reservations")}
                                    </NavLink>
                                </li>
                                <li className="list-none">
                                    <NavLink
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-3 px-4 rounded-xl font-semibold flex gap-3 items-center transition-all duration-200 w-full`}
                                        to={"/my-properties"} viewTransition>
                                        <LandPlot />
                                        {t("header.accommodation")}
                                    </NavLink>
                                </li>
                                <li className="list-none">
                                    <NavLink
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-3 px-4 rounded-xl font-semibold flex gap-3 items-center transition-all duration-200 w-full`}
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
            </div>
            <main className={`flex-1 overflow-y-auto ${isNoBannerRoute ? "pt-24" : "pt-0"}`}>
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
        <li ref={menuRef} className="relative list-none">
            <button 
                onClick={() => setShowDetails(!showDetails)} 
                className={`flex items-center gap-1.5 p-1.5 rounded-xl border border-transparent transition-all cursor-pointer ${
                    showDetails 
                        ? "bg-white/20 text-white border-white/10" 
                        : "hover:bg-white/10 text-white"
                }`}
            >
                <div 
                    aria-hidden="true" 
                    className="rounded-full size-8 border border-white/20 overflow-hidden bg-white/10 shrink-0"
                >
                    <img 
                        src={`https://api.dicebear.com/10.x/thumbs/svg?seed=${user?.id}`} 
                        alt={user?.name || "Profil"} 
                        className="size-full object-cover"
                    />
                </div>
                <ChevronDown className={`size-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
            </button>
            {showDetails && (
                <div className="bg-white dark:bg-base-200 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl absolute top-12 right-0 min-w-[240px] z-50 border border-gray-100 dark:border-gray-800 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800/80 mb-1.5">
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Connecté en tant que</p>
                        <p className="text-sm font-bold truncate text-gray-900 dark:text-white mt-0.5">{user?.name}</p>
                    </div>
                    <ul className="flex flex-col gap-1 list-none p-0 m-0">
                        <li className="list-none">
                            <Link 
                                className="p-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full" 
                                to={"/profile"} 
                                onClick={() => setShowDetails(false)}
                                viewTransition
                            >
                                <User className="size-4" />
                                <span>{t('profil.my-profil')}</span>
                            </Link>
                        </li>
                        <li className="list-none">
                            <Link 
                                className="p-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full" 
                                to={`/user/${user?.id}`} 
                                onClick={() => setShowDetails(false)}
                                viewTransition
                            >
                                <Eye className="size-4" />
                                <span>{t('profil.public-profil')}</span>
                            </Link>
                        </li>
                        <li className="list-none">
                            <Link 
                                className="p-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full" 
                                to={"/settings"} 
                                onClick={() => setShowDetails(false)}
                                viewTransition
                            >
                                <Settings className="size-4" />
                                <span>{t('profil.settings')}</span>
                            </Link>
                        </li>
                        <li className="list-none">
                            <button 
                                onClick={() => {
                                    toggleTheme();
                                    setShowDetails(false);
                                }} 
                                className="p-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-full text-left cursor-pointer"
                            >
                                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                <span>Mode {isDark ? "clair" : "sombre"}</span>
                            </button>
                        </li>
                        <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-1" />
                        <li className="list-none">
                            <button 
                                className="p-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full text-left cursor-pointer" 
                                onClick={handleLogout}
                            >
                                <LogOut className="size-4" />
                                <span>{t('deconnexion')}</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </li>
    );
}

function ListNavLink({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <li className="list-none">
            <NavLink
                className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-2 px-4 rounded-xl font-semibold flex gap-2 items-center justify-center transition-all duration-200`}
                to={to} viewTransition>
                {children}
            </NavLink>
        </li>
    );
}