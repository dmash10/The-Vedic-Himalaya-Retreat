import { Link } from 'react-router-dom';
import { useImageZones } from '@/hooks/useImageZones';
import { useRooms } from '@/hooks/useRooms';
import { useMenu } from '@/hooks/useMenu';
import {
  Image as ImageIcon, BedDouble, UtensilsCrossed, FileText,
  Settings, ArrowRight, Eye, Trees
} from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color, link }: any) => (
  <div className="bg-[#121E1B] border border-[#1C2E2A] p-5 rounded-xl flex flex-col justify-between">
    <div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-[#8E9F96] font-medium text-[10px] tracking-wider uppercase mb-1">{title}</p>
      <h3 className="text-xl font-heading font-bold text-[#F8FAFC]">{value}</h3>
      {subtext && <p className="text-xs text-[#8E9F96]/60 mt-0.5">{subtext}</p>}
    </div>
    {link && (
      <Link
        to={link}
        className="inline-flex items-center text-xs font-bold text-[#C4A665] mt-4 hover:underline gap-1.5 self-start cursor-pointer"
      >
        Manage <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    )}
  </div>
);

const QuickAction = ({ icon: Icon, label, desc, to, color }: any) => (
  <Link
    to={to}
    className="flex items-center p-4 bg-[#121E1B] border border-[#1C2E2A] hover:bg-[#1C2E2A]/50 transition-colors rounded-xl cursor-pointer"
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-4 shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-heading font-medium text-[#F8FAFC] text-sm">{label}</h4>
      <p className="text-xs text-[#8E9F96] truncate">{desc}</p>
    </div>
    <ArrowRight className="w-4 h-4 ml-2 text-[#8E9F96] shrink-0" />
  </Link>
);

export default function AdminDashboard() {
  const { zones } = useImageZones();
  const { rooms } = useRooms();
  const { menuItems } = useMenu();

  const totalImages = zones.reduce((acc, zone) => acc + (zone.zone_media?.length || 0), 0);
  const availableRooms = rooms.filter((r) => r.is_available).length;
  const totalRooms = rooms.length;
  const activeMenuItems = menuItems.filter((i) => i.is_visible).length;
  const totalMenuItems = menuItems.length;

  return (
    <div className="space-y-6 text-[#E2E8F0]">
      {/* Hero Welcome */}
      <div className="relative bg-[#121E1B] border border-[#1C2E2A] rounded-xl p-5 md:p-6 text-white overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Trees className="w-4.5 h-4.5 text-[#C4A665]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E9F96] font-bold">The Green Hills Resort</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-normal text-[#F8FAFC]">
              Welcome Back, <span className="text-[#C4A665]">Admin</span>
            </h1>
            <p className="text-[#8E9F96] text-xs max-w-lg mt-1">
              Manage your resort's content, images, suites, and settings from this centralized dark dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#1C2E2A] hover:bg-[#253D38] border border-[#1C2E2A] rounded-lg transition-colors text-xs font-bold text-[#E2E8F0] gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" /> View Live Site
            </a>
            <Link
              to="/cms-panel/settings"
              className="inline-flex items-center px-4 py-2 bg-[#C4A665] hover:bg-[#A88C52] text-black rounded-lg transition-colors text-xs font-bold gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4" /> Site Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Guest Suites"
          value={`${availableRooms} / ${totalRooms}`}
          subtext="Currently Available"
          icon={BedDouble}
          color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          link="/cms-panel/rooms"
        />
        <StatCard
          title="Menu Items"
          value={`${activeMenuItems} / ${totalMenuItems}`}
          subtext="Active on Menu"
          icon={UtensilsCrossed}
          color="bg-amber-500/10 text-amber-400 border border-amber-500/20"
          link="/cms-panel/menu"
        />
        <StatCard
          title="Gallery Media"
          value={totalImages}
          subtext="Total Images Loaded"
          icon={ImageIcon}
          color="bg-sky-500/10 text-sky-400 border border-sky-500/20"
          link="/cms-panel/pages"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-base font-heading font-medium text-[#F8FAFC]">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction
            icon={FileText}
            label="Edit Page Contents"
            desc="Modify home, dining, or about copy & images"
            to="/cms-panel/pages"
            color="bg-[#C4A665]/10 text-[#C4A665] border border-[#C4A665]/20"
          />
          <QuickAction
            icon={BedDouble}
            label="Manage Room Status"
            desc="Change suite prices & toggle availability"
            to="/cms-panel/rooms"
            color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          />
          <QuickAction
            icon={Settings}
            label="Global Settings"
            desc="Update phone numbers and Whatsapp default text"
            to="/cms-panel/settings"
            color="bg-purple-500/10 text-purple-400 border border-purple-500/20"
          />
        </div>
      </div>
    </div>
  );
}
