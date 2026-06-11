import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import { HomePage } from './pages/HomePage.tsx'
import { NavbarLayout } from './layouts/NavbarLayout.tsx'
import './i18n/config'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { SearchPage } from './pages/SearchPage.tsx'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage.tsx'
import type { Property, User } from './types.ts'
import { CreatePropertyPage } from './pages/CreatePropertyPage.tsx'
import { ProfilePage } from './pages/ProfilePage.tsx'
import { BookingsPage } from './pages/BookingsPage.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import toast, { Toaster } from 'react-hot-toast';
import { PropertyReservationPage } from './pages/PropertyReservationPage.tsx'
import { MyPropertiesPage } from './pages/MyPropertiesPage.tsx'
import { MyReservationsPage } from './pages/MyReservationPage.tsx'
import useAuthStore from './context/AuthStore.tsx'
import { EditPropertyPage } from './pages/EditPropertyPage.tsx'
import api from './api/axios.ts'
import { SettingsPage } from './pages/SettingsPage.tsx'
import { UserPage } from './pages/UserPage.tsx'
import { RateProperyPage } from './pages/RatePropertyPage.tsx'
import { MessagesPage } from './pages/MessagesPage.tsx'

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
        middleware: [authMiddleware],
        Component: BookingsPage
      },
      {
        path: "my-reservations",
        middleware: [authMiddleware],
        Component: MyReservationsPage,
        loader: async () => {
          return (await api.get('/my-reservations')).data;
        }
      },
      {
        path: "settings",
        middleware: [authMiddleware],
        Component: SettingsPage
      },
      {
        path: "/new-property",
        middleware: [authMiddleware],
        Component: CreatePropertyPage
      },
      {
        path: "my-properties",
        middleware: [authMiddleware],
        Component: MyPropertiesPage,
        loader: async () => {
          return (await api.get<Property[]>(`/my-properties`)).data;
        }
      },
      {
        path: "/property/:id",
        loader: async ({ params }) => {
          return (await api.get<Property>(`/properties/${params.id}`)).data;
        },
        Component: PropertyDetailsPage,
      },
      {
        path: "/property/:id/rate",
        loader: async ({ params }) => {
          return (await api.get<Property>(`/properties/${params.id}`)).data;
        },
        middleware: [authMiddleware],
        Component: RateProperyPage,
      },
      {
        path: "/property/:id/edit",
        loader: async ({ params }) => {
          return (await api.get<Property>(`/properties/${params.id}`)).data;
        },
        Component: EditPropertyPage,
      },
      {
        path: "messages",
        middleware: [authMiddleware],
        Component: MessagesPage,
        loader: async () => {
          return (await api.get('/conversations')).data;
        }
      },
      {
        path: "/user/:id",
        loader: async ({ params }) => {
          const user = (await api.get<User>(`/users/${params.id}`)).data;
          const properties = (await api.get<Property[]>(`/users/${params.id}/properties`)).data;
          return {
            user,
            properties
          };
        },
        Component: UserPage,
      },
      {
        path: "/reservation",
        Component: PropertyReservationPage,
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
        middleware: [authMiddleware],
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


export function authMiddleware() {
  const user = useAuthStore.getState().user;
  if (!user) {
    toast.error("Vous devez être connecté pour accéder à cette page");
    throw redirect("/login");
  }
}