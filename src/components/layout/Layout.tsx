import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "../CookieConsent";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-white text-rock-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {pathname !== "/experiences" && <Footer />}
      <CookieConsent />
    </div>
  );
}
