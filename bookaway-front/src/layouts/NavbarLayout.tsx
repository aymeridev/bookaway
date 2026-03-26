import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";

export function NavbarLayout() {
    const { t } = useTranslation();
    return <>
        <nav className="flex p-4 bg-blue-500">
            <div className="h-8 w-32 bg-center bg-contain bg-no-repeat" style={{
                backgroundImage: "url('bookaway_logo.png')"
            }}></div>
            <ul className="flex-1 flex justify-end text-white font-semibold">
                <li>
                    <Link to={"/"}>
                        {t('home')}
                    </Link>
                </li>
            </ul>
        </nav>
        <Outlet />
    </>
}