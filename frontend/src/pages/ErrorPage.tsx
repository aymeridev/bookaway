import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Banner } from "../components/Banner";

export function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <>
            <Banner title="Une erreur est survenue" description={isRouteErrorResponse(error) ? (error.statusText || error.status) : (error as any).message} />
            <Link to={"/"} className="btn btn-primary btn-xl" viewTransition>Retourner à l'accueil</Link>
        </>
    )
}