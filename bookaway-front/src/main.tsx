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

let router = createBrowserRouter([
  {
    Component: NavbarLayout,
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
          return res.json();
        },
        Component: SearchPage,
      },
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
