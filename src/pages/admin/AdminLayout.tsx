import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BedDouble, UtensilsCrossed,
  FileText, Settings, Menu, X, LogOut, Trees, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard', href: '/cms-panel', icon: LayoutDashboard, exact: true },
  { label: 'Page Editor', href: '/cms-panel/pages', icon: FileText },
  { label: 'Rooms', href: '/cms-panel/rooms', icon: BedDouble },
  { label: 'Restaurant', href: '/cms-panel/menu', icon: UtensilsCrossed },
  { label: 'Settings', href: '/cms-panel/settings', icon: Settings },
];

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await signOut();
    navigate('/cms-login');
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return location.pathname === item.href;
    return location.pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-[#060B0A] flex font-sans text-[#E2E8F0] selection:bg-[#C4A665]/20 selection:text-[#C4A665]">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-[260px] flex-col bg-[#0D1412] border-r border-[#1C2E2A] text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1C2E2A] bg-[#0A0F0E]">
          <div className="w-9 h-9 rounded-lg bg-[#C4A665]/10 border border-[#C4A665]/20 flex items-center justify-center shrink-0">
            <Trees className="w-5 h-5 text-[#C4A665]" />
          </div>
          <div>
            <span className="font-heading text-base tracking-tight block leading-tight text-[#F8FAFC]">Green Hills</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#8E9F96] font-bold">CMS Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative ${
                  active
                    ? 'bg-[#1C2E2A] text-[#C4A665] border border-[#C4A665]/10'
                    : 'text-[#8E9F96] hover:text-[#E2E8F0] hover:bg-[#1C2E2A]/30 border border-transparent'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-[#C4A665] rounded-r" />
                )}
                <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-[#C4A665]' : 'text-[#8E9F96] group-hover:text-[#E2E8F0]'}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {active && <ChevronRight className="ml-auto w-3.5 h-3.5 text-[#C4A665]/40" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[#1C2E2A]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#8E9F96] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors cursor-pointer"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* ===== MOBILE SLIDE-OUT DRAWER ===== */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/70" onClick={toggleSidebar} />
          {/* Drawer Content */}
          <aside className="fixed inset-y-0 left-0 w-[270px] bg-[#0D1412] border-r border-[#1C2E2A] flex flex-col z-55">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C2E2A] bg-[#0A0F0E]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C4A665]/10 border border-[#C4A665]/20 flex items-center justify-center">
                  <Trees className="w-4.5 h-4.5 text-[#C4A665]" />
                </div>
                <span className="font-heading text-sm text-[#F8FAFC]">Green Hills CMS</span>
              </div>
              <button onClick={toggleSidebar} className="text-[#8E9F96] hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'bg-[#1C2E2A] text-[#C4A665] border border-[#C4A665]/10'
                        : 'text-[#8E9F96] hover:text-[#E2E8F0] hover:bg-[#1C2E2A]/30 border border-transparent'
                    }`}
                  >
                    <item.icon className={`h-[18px] w-[18px] ${active ? 'text-[#C4A665]' : 'text-[#8E9F96]'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="px-3 py-4 border-t border-[#1C2E2A]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#8E9F96] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-colors cursor-pointer"
              >
                <LogOut className="h-[18px] w-[18px]" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        {/* Mobile Top Header */}
        <header className="lg:hidden bg-[#0D1412] border-b border-[#1C2E2A] h-14 flex items-center px-4 sticky top-0 z-40">
          <button onClick={toggleSidebar} className="text-[#8E9F96] p-1 -ml-1">
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-heading text-[#F8FAFC] text-base">CMS Panel</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 bg-[#060B0A]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D1412]/95 border-t border-[#1C2E2A] px-1 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-1">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors min-w-[64px] ${
                  active ? 'text-[#C4A665]' : 'text-[#8E9F96]'
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? 'text-[#C4A665]' : 'text-[#8E9F96]'}`} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[9px] mt-1 font-bold tracking-wider uppercase">
                  {item.label.replace(' Editor', '')}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
