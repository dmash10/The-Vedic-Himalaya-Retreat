import { useState, useEffect } from 'react';
import { useSiteSettings, SiteSettings } from '@/hooks/useSiteSettings';
import {
  Save, Phone, Globe, MessageSquare, Bell,
  Loader2, ShieldCheck, AlertTriangle, MapPin, Mail, Tag
} from 'lucide-react';
import { toast } from 'sonner';

// Premium aligned input component for settings
interface SettingInputProps {
  label: string;
  icon: any;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
}

function SettingInput({
  label,
  icon: Icon,
  value,
  type = 'text',
  onChange,
  required = false,
  placeholder = ''
}: SettingInputProps) {
  return (
    <div className="relative group/input flex-1 w-full">
      <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C4A665]/40 group-focus-within/input:text-[#C4A665] transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all font-medium placeholder-white/10"
        />
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { settings, loading, saveSettings } = useSiteSettings();
  const [localSettings, setLocalSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync local state when hook returns loaded data
  useEffect(() => {
    if (settings) {
      setLocalSettings({ ...settings });
    }
  }, [settings]);

  const handleChange = (key: keyof SiteSettings, value: any) => {
    if (!localSettings) return;
    setLocalSettings((prev) => prev ? { ...prev, [key]: value } : null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSettings) return;

    setSaving(true);
    const result = await saveSettings(localSettings);
    setSaving(false);

    if (result.success) {
      toast.success('Site settings saved successfully');
    } else {
      toast.error(result.error || 'Failed to save settings');
    }
  };

  if (loading || !localSettings) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#C4A665]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#E2E8F0] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="border-l-4 border-[#C4A665] pl-5 py-0.5">
          <h1 className="text-2xl md:text-3xl font-heading font-medium text-[#F8FAFC]">SITE SETTINGS</h1>
          <p className="text-[#8E9F96] text-xs mt-1">Configure global details, phone numbers, and website modes.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="self-start sm:self-center py-2 px-5 rounded-lg text-xs font-bold bg-[#C4A665] hover:bg-[#FAF9F5] text-black transition-colors flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Branding Info */}
        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
          <h2 className="text-xs font-bold text-[#F8FAFC] p-4 bg-[#0D1412]/50 border-b border-[#1C2E2A] flex items-center gap-2 uppercase tracking-wider">
            <Globe className="h-4.5 w-4.5 text-[#C4A665]" />
            Branding Information
          </h2>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingInput
              label="Hotel/Resort Name"
              icon={Globe}
              value={localSettings.hotel_name}
              onChange={(val) => handleChange('hotel_name', val)}
              placeholder="The Green Hills Resort"
              required
            />
            <SettingInput
              label="Tagline"
              icon={Tag}
              value={localSettings.tagline}
              onChange={(val) => handleChange('tagline', val)}
              placeholder="Peace in the Pines"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
          <h2 className="text-xs font-bold text-[#F8FAFC] p-4 bg-[#0D1412]/50 border-b border-[#1C2E2A] flex items-center gap-2 uppercase tracking-wider">
            <Phone className="h-4.5 w-4.5 text-[#C4A665]" />
            Contact Information
          </h2>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SettingInput
                label="Primary Phone"
                icon={Phone}
                value={localSettings.primary_phone}
                onChange={(val) => handleChange('primary_phone', val)}
                placeholder="+91 XXXXXXXXXX"
                required
              />
              <SettingInput
                label="Secondary Phone"
                icon={Phone}
                value={localSettings.secondary_phone}
                onChange={(val) => handleChange('secondary_phone', val)}
                placeholder="+91 XXXXXXXXXX"
              />
              <SettingInput
                label="Tertiary Phone"
                icon={Phone}
                value={localSettings.tertiary_phone}
                onChange={(val) => handleChange('tertiary_phone', val)}
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <SettingInput
              label="Email Address"
              icon={Mail}
              type="email"
              value={localSettings.email}
              onChange={(val) => handleChange('email', val)}
              placeholder="info@thegreenhillsresort.com"
              required
            />
          </div>
        </div>

        {/* WhatsApp Inquiries */}
        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
          <h2 className="text-xs font-bold text-[#F8FAFC] p-4 bg-[#0D1412]/50 border-b border-[#1C2E2A] flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="h-4.5 w-4.5 text-emerald-400" />
            WhatsApp Inquiries
          </h2>
          <div className="p-5 space-y-4">
            <div>
              <SettingInput
                label="WhatsApp Number (e.g. 919999999999)"
                icon={MessageSquare}
                value={localSettings.whatsapp_number}
                onChange={(val) => handleChange('whatsapp_number', val)}
                placeholder="91XXXXXXXXXX"
                required
              />
              <p className="text-[10px] text-[#8E9F96]/50 mt-1 italic">Include country code but omit "+" and leading zeroes.</p>
            </div>
            <div className="relative">
              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Default Text Message Template</label>
              <textarea
                value={localSettings.whatsapp_default_message}
                onChange={(e) => handleChange('whatsapp_default_message', e.target.value)}
                rows={3}
                placeholder="Hi, I want to book a room at The Green Hills Resort..."
                className="w-full px-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all resize-none leading-relaxed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
          <h2 className="text-xs font-bold text-[#F8FAFC] p-4 bg-[#0D1412]/50 border-b border-[#1C2E2A] flex items-center gap-2 uppercase tracking-wider">
            <MapPin className="h-4.5 w-4.5 text-red-400" />
            Location & Maps
          </h2>
          <div className="p-5 space-y-4">
            <div className="relative">
              <label className="block text-[9px] font-bold text-[#C4A665] uppercase tracking-[0.2em] mb-1.5">Physical Address</label>
              <textarea
                value={localSettings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                placeholder="Village Dewar, Guptkashi, Uttarakhand"
                className="w-full px-4 py-2.5 bg-white/5 border border-[#1C2E2A] rounded-lg text-xs text-[#E2E8F0] focus:outline-none focus:border-[#C4A665] transition-all resize-none leading-relaxed font-medium"
                required
              />
            </div>
            <SettingInput
              label="Google Maps Link"
              icon={MapPin}
              value={localSettings.google_maps_url}
              onChange={(val) => handleChange('google_maps_url', val)}
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
          <div className="p-4 bg-[#0D1412]/50 border-b border-[#1C2E2A] flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#F8FAFC] flex items-center gap-2 uppercase tracking-wider">
              <Bell className="h-4.5 w-4.5 text-[#C4A665]" />
              Announcement Banner
            </h2>
            <button
              type="button"
              onClick={() => handleChange('announcement_enabled', !localSettings.announcement_enabled)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${
                localSettings.announcement_enabled ? 'bg-emerald-500' : 'bg-[#1C2E2A]'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                localSettings.announcement_enabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="p-5">
            {localSettings.announcement_enabled ? (
              <SettingInput
                label="Banner Text Alert"
                icon={Bell}
                value={localSettings.announcement_text}
                onChange={(val) => handleChange('announcement_text', val)}
                placeholder="🎉 Special monsoon offer: Get 15% discount on deluxe rooms!"
              />
            ) : (
              <p className="text-xs text-[#8E9F96]/60 italic">Banner alert is disabled. Toggle switch to write alerts.</p>
            )}
          </div>
        </div>

        {/* Website Controls */}
        <div className="bg-[#0D1412] border border-[#1C2E2A] rounded-2xl overflow-hidden shadow-none">
          <h2 className="text-xs font-bold text-[#F8FAFC] p-4 bg-[#0D1412]/50 border-b border-[#1C2E2A] flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
            Website Controls
          </h2>
          <div className="px-5 divide-y divide-[#1C2E2A]/50">
            {/* Booking Enabled toggle */}
            <div className="flex items-center justify-between py-4">
              <div>
                <span className="text-xs font-semibold text-[#F8FAFC] block">Enable Booking Inquiries</span>
                <span className="text-[10px] text-[#8E9F96]">Toggle checkouts and inquiries via WhatsApp.</span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('booking_enabled', !localSettings.booking_enabled)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${
                  localSettings.booking_enabled ? 'bg-emerald-500' : 'bg-[#1C2E2A]'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  localSettings.booking_enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Show Prices toggle */}
            <div className="flex items-center justify-between py-4">
              <div>
                <span className="text-xs font-semibold text-[#F8FAFC] block">Display Room Rates</span>
                <span className="text-[10px] text-[#8E9F96]">Show or hide room pricing listings.</span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('show_prices', !localSettings.show_prices)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${
                  localSettings.show_prices ? 'bg-emerald-500' : 'bg-[#1C2E2A]'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  localSettings.show_prices ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Maintenance Mode toggle */}
            <div className="flex items-center justify-between py-4">
              <div>
                <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Maintenance Mode
                </span>
                <span className="text-[10px] text-[#8E9F96]">Lock visitor access and display a temporary page.</span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('maintenance_mode', !localSettings.maintenance_mode)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 cursor-pointer ${
                  localSettings.maintenance_mode ? 'bg-red-500' : 'bg-[#1C2E2A]'
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  localSettings.maintenance_mode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto py-2.5 px-8 rounded-lg text-xs font-bold bg-[#C4A665] hover:bg-[#FAF9F5] text-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
