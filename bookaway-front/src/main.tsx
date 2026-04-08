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
import { CreateProperyPage } from './pages/CreatePropertyPage.tsx'
import { ProfilePage } from './pages/ProfilePage.tsx'
import { BookingsPage } from './pages/BookingsPage.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'

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

          const res = await fetch(`/api/properties`);
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
        Component: CreateProperyPage
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
  </StrictMode>,
)
