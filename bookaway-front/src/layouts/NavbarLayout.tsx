import { Link } from "react-router";

export function NavbarLayout() {
    return <nav>
        <p>Accueil</p>
        <ul>
            <li>
                <Link to={"/"}>
                    Accueil
                </Link>
            </li>
        </ul>
    </nav>
}