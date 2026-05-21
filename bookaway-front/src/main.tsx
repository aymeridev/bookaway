import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { HomePage } from './pages/HomePage.tsx'
import { NavbarLayout } from './layouts/NavbarLayout.tsx'
import './i18n/config'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { SearchPage } from './pages/SearchPage.tsx'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage.tsx'
import type { Property } from './types.ts'
import { CreatePropertyPage } from './pages/CreatePropertyPage.tsx'
import { ProfilePage } from './pages/ProfilePage.tsx'
import { BookingsPage } from './pages/BookingsPage.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import { Toaster } from 'react-hot-toast';

let router = createBrowserRouter([
  {
    Component: NavbarLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "/search",
        loader: async ({ request }) => {
          const url = new URL(request.url);

          // On récupère tous les paramètres de recherche
          const params = new URLSearchParams({
            lat: url.searchParams.get("lat") || "",
            lon: url.searchParams.get("lon") || "",
            travelers: url.searchParams.get("travelers") || "",
            from: url.searchParams.get("from") || "",
            to: url.searchParams.get("to") || "",
          });

          // On envoie ces paramètres à l'API Laravel
          // Exemple d'URL générée : /api/properties?lat=45.2&lon=2.3&travelers=2...
          const res = await fetch(`/api/properties?${params.toString()}`);

          if (!res.ok) throw new Error("Erreur lors de la récupération des logements");

          return res.json() as Promise<Property[]>;
        },
        Component: SearchPage,
      },
      {
        path: "bookings",
        Component: BookingsPage
      },
      {
        path: "/new-property",
        Component: CreatePropertyPage
      },
      {
        path: "/property/:id",
        loader: async ({ params }) => {

          const res = await fetch(`/api/properties/${params.id}`);
          const property = await res.json();
          return property as Property;
        },
        Component: PropertyDetailsPage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/profile",
        Component: ProfilePage,
      },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
