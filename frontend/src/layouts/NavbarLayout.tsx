import { useTranslation } from "react-i18next";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router";
import useAuthStore from "../context/AuthStore";
import { useEffect, useRef, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { BuildingsIcon, CalendarIcon, CaretDownIcon, ChatCircleIcon, EyeIcon, GearFineIcon, ListIcon, MoonIcon, SignInIcon, SignOutIcon, SunIcon, UserIcon, XIcon } from "@phosphor-icons/react";

export function NavbarLayout() {
    const { t } = useTranslation();
    const location = useLocation();
    const navRef = useRef<HTMLElement>(null);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    useEffect(() => {
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


    return (
        <div className="flex flex-col h-svh relative">
            <nav ref={navRef} className="navbar shadow-sm bg-primary">
                <div className="flex items-center gap-6">
                    <Link to={"/"} className="block h-8 w-32 bg-center bg-contain bg-no-repeat cursor-pointer bg-logo"
                        aria-label="Retour à l'accueil" viewTransition />
                </div>
                <div className="flex-1"></div>

                {isAuthenticated && (
                    <ul className="menu menu-horizontal">
                        <ListNavLink to={"/my-bookings"}>
                            <CalendarIcon />
                            {t("header.reservations")}
                        </ListNavLink>
                        <ListNavLink to={"/my-properties"}>
                            <BuildingsIcon />
                            {t("header.accommodation")}
                        </ListNavLink>
                        <ListNavLink to={"/messages"}>
                            <ChatCircleIcon />
                            Messagerie
                        </ListNavLink>
                    </ul>
                )}
                <div className="flex-1"></div>



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
                                    {isMobileMenuOpen ? <XIcon /> : <ListIcon />}
                                </button>
                            </li>
                        </>
                    ) : (
                        <ListNavLink to={"/login"}>
                            <SignInIcon />
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
                                    to={"/my-bookings"} viewTransition>
                                    <CalendarIcon />
                                    {t("header.reservations")}
                                </NavLink>
                            </li>
                            <li className="list-none">
                                <NavLink
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-3 px-4 rounded-xl font-semibold flex gap-3 items-center transition-all duration-200 w-full`}
                                    to={"/my-properties"} viewTransition>
                                    <BuildingsIcon />
                                    {t("header.accommodation")}
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="footer bg-neutral text-neutral-content p-10">
                <aside>
                    <ul>
                        <li>BookAway</li>
                    </ul>
                </aside>
            </footer>
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
                className={`flex items-center gap-1.5 p-1.5 rounded-xl border border-transparent transition-all cursor-pointer ${showDetails
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
                <CaretDownIcon className={`size-4 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`} />
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
                                <UserIcon className="size-4" />
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
                                <EyeIcon className="size-4" />
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
                                <GearFineIcon className="size-4" />
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
                                {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                                <span>Mode {isDark ? "clair" : "sombre"}</span>
                            </button>
                        </li>
                        <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-1" />
                        <li className="list-none">
                            <button
                                className="p-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full text-left cursor-pointer"
                                onClick={handleLogout}
                            >
                                <SignOutIcon className="size-4" />
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
        <li >
            <NavLink
                className={({ isActive }) => `${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10 active:bg-white/20"} py-2 px-4 rounded-xl font-semibold flex gap-2 items-center justify-center transition-all duration-200`}
                to={to} viewTransition>
                {children}
            </NavLink>
        </li>
    );
}