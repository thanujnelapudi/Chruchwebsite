import { MemberProvider } from "@/integrations";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ScrollToTop } from "@/lib/scroll-to-top";
import ErrorPage from "@/integrations/errorHandlers/ErrorPage";
import HomePage from "@/components/pages/HomePage";
import AboutPage from "@/components/pages/AboutPage";
import WatchLivePage from "@/components/pages/WatchLivePage";
import ResourcesPage from "@/components/pages/ResourcesPage";
import SongsPage from "@/components/pages/SongsPage";
import EventsPage from "@/components/pages/EventsPage";
import EventDetailPage from "@/components/pages/EventDetailPage";
import ServiceSchedulePage from "@/components/pages/ServiceSchedulePage";
import PrayerRequestsPage from "@/components/pages/PrayerRequestsPage";
import GalleryPage from "@/components/pages/GalleryPage";
import ContactPage from "@/components/pages/ContactPage";

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "about", element: <AboutPage /> },
        { path: "watch-live", element: <WatchLivePage /> },
        // "resources" now silently serves the Sermons page
        { path: "resources", element: <ResourcesPage /> },
        { path: "songs", element: <SongsPage /> },
        { path: "events", element: <EventsPage /> },
        { path: "events/:id", element: <EventDetailPage /> },
        { path: "service-schedule", element: <ServiceSchedulePage /> },
        { path: "prayer-requests", element: <PrayerRequestsPage /> },
        { path: "gallery", element: <GalleryPage /> },
        { path: "contact", element: <ContactPage /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_NAME,
  }
);

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
