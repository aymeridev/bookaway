import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Banner } from "../components/Banner";

export function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <>
            <Banner title={isRouteErrorResponse(error) ? (error.statusText || error.status) : (error as any).message} description="Erreur" />
            <div className="py-8"></div>
            <Link to={"/"} className="bg-blue-500 text-white rounded-lg p-4 font-semibold" viewTransition>Retourner à l'accueil</Link>
        </>
    )
}