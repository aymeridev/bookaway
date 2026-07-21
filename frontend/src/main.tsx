import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import { HomePage } from './pages/HomePage.tsx'
import { NavbarLayout } from './layouts/NavbarLayout.tsx'
import './i18n/config'
import { LoginPage } from './pages/account/LoginPage.tsx'
import { RegisterPage } from './pages/account/RegisterPage.tsx'
import { PropertiesSearchResultsPage } from './pages/PropertiesSearchResultsPage.tsx'
import { PropertyDetailsPage } from './pages/PropertyDetailsPage.tsx'
import { CreatePropertyPage } from './pages/manage/CreatePropertyPage.tsx'
import { ProfilePage } from './pages/account/ProfilePage.tsx'
import { BookingsPage } from './pages/BookingsPage.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import toast, { Toaster } from 'react-hot-toast';
import { PropertyReservationPage } from './pages/PropertyReservationPage.tsx'
import { MyPropertiesPage } from './pages/MyPropertiesPage.tsx'
import { MyBookingsPage } from './pages/MyBookingsPage.tsx'
import useAuthStore from './context/AuthStore.tsx'
import { EditPropertyPage } from './pages/manage/EditPropertyPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'
import { UserPage } from './pages/UserPage.tsx'
import { MessagesPage } from './pages/MessagesPage.tsx'
import { ReservationDetailsPage } from './pages/ReservationDetailsPage.tsx'
import { IconContext } from '@phosphor-icons/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.ts'
import { fetchPropertiesCount } from './services/properties.ts'


const router = createBrowserRouter([
  {
    Component: NavbarLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        Component: HomePage,
        loader: async () => {
          const data = await queryClient.ensureQueryData({ queryKey: ['properties-count'], queryFn: fetchPropertiesCount });

          return data;
        }
      },
      {
        path: "/search",
        Component: PropertiesSearchResultsPage,
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
        path: "my-bookings",
        middleware: [authMiddleware],
        Component: MyBookingsPage,
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
        path: "/property/:propertyId",
        Component: PropertyDetailsPage,
      },
      {
        path: "/property/:propertyId/:unitId",
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
    <QueryClientProvider client={queryClient}>

      <IconContext.Provider value={{
        size: 24,
      }}>
        <RouterProvider router={router} />
        <Toaster />
      </IconContext.Provider>
    </QueryClientProvider>
  </StrictMode>,
)


export function authMiddleware() {
  const user = useAuthStore.getState().user;
  if (!user) {
    toast.error("Vous devez être connecté pour accéder à cette page");
    throw redirect("/login");
  }
}