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
import { SettingsPage } from './pages/SettingsPage.tsx'
import { UserPage } from './pages/UserPage.tsx'
import { MessagesPage } from './pages/MessagesPage.tsx'
import { ReservationDetailsPage } from './pages/ReservationDetailsPage.tsx'
import { IconContext } from '@phosphor-icons/react'



const router = createBrowserRouter([
  {
    Component: NavbarLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: HomePage,
        loader: () => {
          console.log("test");
        }
      },
      {
        path: "/search",
        Component: SearchPage,
      },
      {
        path: "bookings",
        middleware: [authMiddleware],
        Component: BookingsPage
      },
      {
        path: "reservation/:id",
        middleware: [authMiddleware],
        Component: ReservationDetailsPage
      },
      {
        path: "my-reservations",
        middleware: [authMiddleware],
        Component: MyReservationsPage,
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
      },
      {
        path: "/property/:id",
        Component: PropertyDetailsPage,
      },
      {
        path: "/property/:id/edit",
        Component: EditPropertyPage,
      },
      {
        path: "messages",
        middleware: [authMiddleware],
        Component: MessagesPage,
      },
      {
        path: "/user/:id",
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
    <IconContext.Provider value={{
      size: 24,
    }}>
      <RouterProvider router={router} />
      <Toaster />
    </IconContext.Provider>
  </StrictMode>,
)


export function authMiddleware() {
  const user = useAuthStore.getState().user;
  if (!user) {
    toast.error("Vous devez être connecté pour accéder à cette page");
    throw redirect("/login");
  }
}