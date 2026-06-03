import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SiteSettings {
  id?: string;
  hotel_name: string;
  tagline: string;
  primary_phone: string;
  secondary_phone: string;
  tertiary_phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  google_maps_url: string;
  whatsapp_default_message: string;
  booking_enabled: boolean;
  show_prices: boolean;
  maintenance_mode: boolean;
  announcement_text: string;
  announcement_enabled: boolean;
  share_title?: string;
  share_description?: string;
  share_image?: string;
  site_favicon?: string;
}

const defaultSettings: SiteSettings = {
  hotel_name: 'The Vedic Himalaya Retreat',
  tagline: 'Peace in the Pines',
  primary_phone: '+91 81265 73560',
  secondary_phone: '+91 63981 41605',
  tertiary_phone: '',
  whatsapp_number: '918126573560',
  email: 'stay@vedichimalaya.com',
  address: 'Village Dewar, Guptkashi, Kedarnath Route',
  google_maps_url: '',
  whatsapp_default_message: 'Hi, I want to book a room at The Vedic Himalaya Retreat',
  booking_enabled: true,
  show_prices: true,
  maintenance_mode: false,
  announcement_text: '',
  announcement_enabled: false,
  share_title: '',
  share_description: '',
  share_image: '',
  site_favicon: '',
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (!error && data) {
        setSettings({ ...defaultSettings, ...data });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: SiteSettings) => {
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .single();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update(updatedSettings)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([updatedSettings]);
        if (error) throw error;
      }

      setSettings(updatedSettings);
      return { success: true };
    } catch (error: any) {
      console.error('Error saving settings:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, saveSettings, refresh: fetchSettings };
};
