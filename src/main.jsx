// Check saved preference first
const savedTheme = localStorage.getItem("theme");
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
const root = document.documentElement;

if (savedTheme === "dark" || (!savedTheme && prefersDarkMode)) {
  root.classList.add("dark");
  root.setAttribute("data-theme", "dark");
} else {
  root.classList.remove("dark");
  root.setAttribute("data-theme", "light");
}


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './Router/router.jsx';
import AuthProvider from './Router/AuthProvider.jsx';
import { LoadScript } from '@react-google-maps/api';
import RideStatusProvider from './Components/RideStatusProvider.jsx';
import { NotificationProvider } from './Components/NotificationContext.jsx';
import { ActiveRideProvider } from './contexts/ActiveRideContext.jsx';
import ReviewPrompt from './Components/ReviewPrompt.jsx';
import { Toaster } from 'react-hot-toast';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
   <AuthProvider>
     <RideStatusProvider> {/* Wrap with RideStatusProvider */}
      <ActiveRideProvider>
            {/* Toast notifications */}
            <Toaster position="bottom-center" reverseOrder={false} />
            <ReviewPrompt endPoint={import.meta.env.VITE_ENDPOINT} />
      <RouterProvider router={router}> </RouterProvider></ActiveRideProvider>
      </RideStatusProvider>
     </AuthProvider></NotificationProvider>
  </StrictMode>,
)
