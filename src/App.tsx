import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ContentProvider, useContent } from "./contexts/ContentContext";
import { useSiteSettings } from "./hooks/useSiteSettings";
import { Layout } from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import { Toaster } from "sonner";
import { AnimatePresence } from "motion/react";

// Lazy-load Page Components
const Home = lazy(() => import("./pages/Home"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Dining = lazy(() => import("./pages/Dining"));
const Weddings = lazy(() => import("./pages/Weddings"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Nearby = lazy(() => import("./pages/Nearby"));
const About = lazy(() => import("./pages/About"));
const Booking = lazy(() => import("./pages/Booking"));
const Contact = lazy(() => import("./pages/Contact"));
const Experiences = lazy(() => import("./pages/Experiences"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfStay = lazy(() => import("./pages/TermsOfStay"));

// Lazy-load Admin Components
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminRooms = lazy(() => import("./pages/admin/AdminRooms"));
const AdminMenu = lazy(() => import("./pages/admin/AdminMenu"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

function RootLoader() {
  const location = useLocation();
  const { content, loading: contentLoading, getValue, appReady, setAppReady } = useContent();
  const { loading: settingsLoading } = useSiteSettings();

  const isHome = location.pathname === "/";
  const heroImage = isHome ? (getValue("home", "hero_image", "") || localStorage.getItem("cached_resort_hero_image") || "") : "";

  const [heroPreloaded, setHeroPreloaded] = useState(false);
  const [prevHeroImage, setPrevHeroImage] = useState(heroImage);

  if (heroImage !== prevHeroImage) {
    setPrevHeroImage(heroImage);
    setHeroPreloaded(false);
  }

  useEffect(() => {
    if (heroImage) {
      const img = new Image();
      img.src = heroImage;
      if (img.complete) {
        setHeroPreloaded(true);
      } else {
        const done = () => setHeroPreloaded(true);
        img.onload = done;
        img.onerror = done;
      }
    }
  }, [heroImage]);

  // Overall loading condition
  const isLoading = settingsLoading || (contentLoading && content.length === 0) || (isHome && heroImage && !heroPreloaded);

  // Sync to ContentContext
  useEffect(() => {
    setAppReady(!isLoading);
  }, [isLoading, setAppReady]);

  return (
    <AnimatePresence>
      {isLoading && (
        <PageLoader
          key="root-page-loader"
          preloadSrc={heroImage}
          isUrlLoading={contentLoading && content.length === 0}
          onPreloaded={() => setHeroPreloaded(true)}
        />
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Toaster richColors position="top-right" />
        <RootLoader />
        <Suspense fallback={null}>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="dining" element={<Dining />} />
              <Route path="weddings" element={<Weddings />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="nearby" element={<Nearby />} />
              <Route path="about" element={<About />} />
              <Route path="booking" element={<Booking />} />
              <Route path="contact" element={<Contact />} />
              <Route path="experiences" element={<Experiences />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-of-stay" element={<TermsOfStay />} />
              {/* Redirect old admin to the new CMS panel */}
              <Route path="admin" element={<Navigate to="/cms-panel" replace />} />
            </Route>

            {/* CMS / Admin Panel Routes */}
            <Route path="/cms-login" element={<AdminLogin />} />
            <Route
              path="/cms-panel"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="menu" element={<AdminMenu />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ContentProvider>
  );
}
