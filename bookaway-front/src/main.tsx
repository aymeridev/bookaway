import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { HomePage } from './pages/HomePage.tsx'
import { NavbarLayout } from './layouts/NavbarLayout.tsx'
import { TripsPage } from './pages/TripsPage.tsx'
import './i18n/config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route index element={<HomePage />} />
          <Route path="trips" element={<TripsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
