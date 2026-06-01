import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ContentProvider } from "./contexts/ContentContext";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Dining from "./pages/Dining";
import Weddings from "./pages/Weddings";
import Gallery from "./pages/Gallery";
import Nearby from "./pages/Nearby";
import About from "./pages/About";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Experiences from "./pages/Experiences";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfStay from "./pages/TermsOfStay";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPages from "./pages/admin/AdminPages";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "sonner";

export default function App() {
  return (
    <ContentProvider>
    <BrowserRouter>
      <Toaster richColors position="top-right" />
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
    </BrowserRouter>
    </ContentProvider>
  );
}
