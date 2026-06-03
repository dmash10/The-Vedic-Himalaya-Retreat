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
  const { settings, loading: settingsLoading } = useSiteSettings();

  // Dynamic SEO Metadata and Favicon updater
  useEffect(() => {
    if (!settings) return;

    // 1. Dynamic Favicon updater
    if (settings.site_favicon) {
      let faviconLink = document.getElementById('dynamic-favicon') as HTMLLinkElement;
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.id = 'dynamic-favicon';
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = settings.site_favicon;
    }

    // 2. Dynamic Title updater
    const path = location.pathname;
    let pageTitle = '';
    
    if (path === '/') {
      pageTitle = settings.share_title || `${settings.hotel_name} | ${settings.tagline || 'Peace in the Pines'}`;
    } else {
      const cleanPath = path.replace('/', '').replace(/-/g, ' ');
      const capitalized = cleanPath.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      pageTitle = `${capitalized} | ${settings.hotel_name}`;
    }
    
    document.title = pageTitle;

    // 3. Dynamic Meta Description updater
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = settings.share_description || settings.tagline || 'Peace in the Pines';

    // 4. Dynamic Open Graph tags (og:title, og:description, og:image)
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = pageTitle;

    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = settings.share_description || settings.tagline || 'Peace in the Pines';

    if (settings.share_image) {
      let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.content = settings.share_image;
    }

    // 5. Dynamic Twitter tags
    let twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = pageTitle;

    let twitterDesc = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.name = 'twitter:description';
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.content = settings.share_description || settings.tagline || 'Peace in the Pines';

    if (settings.share_image) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.name = 'twitter:image';
        document.head.appendChild(twitterImage);
      }
      twitterImage.content = settings.share_image;
    }
  }, [location.pathname, settings]);

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
