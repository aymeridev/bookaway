import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";

export function NavbarLayout() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col h-svh">
            <nav className="flex p-4 bg-blue-500 items-center">
                {/* On entoure le logo avec un Link */}
                <Link to={"/"} className="block">
                    <div 
                        className="h-8 w-32 bg-center bg-contain bg-no-repeat cursor-pointer" 
                        style={{ backgroundImage: "url('bookaway_logo.png')" }}
                        aria-label="Retour à l'accueil"
                    ></div>
                </Link>

                <ul className="flex-1 flex justify-end text-white font-semibold">
                    <li>
                        <Link to={"/connexion"}>
                            {t('connexion')}
                        </Link>
                    </li>
                </ul>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}