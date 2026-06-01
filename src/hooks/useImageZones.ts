import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

export interface ZoneMedia {
  id: string;
  zone_id: string;
  url: string;
  type: string;
  order_index: number;
  category: string | null;
}

export interface ImageZone {
  id: string;
  zone_key: string;
  display_name: string;
  description: string | null;
  page: string | null;
  order_index: number | null;
  is_enabled: boolean;
  fallback_url: string | null;
  zone_media: ZoneMedia[];
}

// Module-level cache
let zonesCache: ImageZone[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useImageZones = () => {
  const [zones, setZones] = useState<ImageZone[]>(zonesCache || []);
  const [loading, setLoading] = useState(!zonesCache);
  const [uploading, setUploading] = useState(false);

  const fetchZones = useCallback(
    async (forceRefresh = false) => {
      try {
        const now = Date.now();
        if (
          !forceRefresh &&
          zonesCache &&
          now - cacheTimestamp < CACHE_DURATION
        ) {
          if (zones.length === 0) {
            setZones(zonesCache);
            setLoading(false);
          }
          return;
        }

        if (zones.length === 0 && !zonesCache) setLoading(true);

        const { data, error } = await supabase
          .from('image_zones')
          .select('*, zone_media(*)')
          .order('page')
          .order('order_index');

        if (error) throw error;

        const processedData =
          data?.map((zone: any) => ({
            ...zone,
            zone_media: zone.zone_media.sort(
              (a: ZoneMedia, b: ZoneMedia) =>
                (a.order_index || 0) - (b.order_index || 0)
            ),
          })) || [];

        zonesCache = processedData;
        cacheTimestamp = Date.now();
        setZones(processedData);
      } catch (error) {
        console.error('Error fetching image zones:', error);
        if (zones.length === 0) toast.error('Failed to load image settings');
      } finally {
        setLoading(false);
      }
    },
    [zones.length]
  );

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const addMedia = async (
    zoneId: string,
    file: File,
    type: 'image' | 'video' = 'image',
    category: string | null = null
  ) => {
    try {
      setUploading(true);

      let fileToUpload = file;
      if (type === 'image') {
        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: 'image/webp' as const,
        };
        const compressedBlob = await imageCompression(file, options);
        fileToUpload = new File(
          [compressedBlob],
          file.name.replace(/\.[^/.]+$/, '.webp'),
          { type: 'image/webp', lastModified: Date.now() }
        );
      }

      const timestamp = Date.now();
      const ext = type === 'image' ? 'webp' : file.name.split('.').pop();
      const fileName = `the-green-hills-resort/zones/${zoneId}/${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('site-images').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('zone_media').insert({
        zone_id: zoneId,
        url: publicUrl,
        type: type,
        order_index: 999,
        category: category,
      });

      if (dbError) throw dbError;

      toast.success('Media uploaded as WebP successfully');
      await fetchZones(true);
      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Error adding media:', error);
      toast.error(`Failed to upload ${type}`);
      return { success: false, error };
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async (mediaId: string, url: string) => {
    try {
      const { error: dbError } = await supabase
        .from('zone_media')
        .delete()
        .eq('id', mediaId);

      if (dbError) throw dbError;

      try {
        const path = url.split('/site-images/')[1];
        if (path) {
          await supabase.storage.from('site-images').remove([path]);
        }
      } catch (e) {
        console.warn('Failed to cleanup storage file:', e);
      }

      toast.success('Media removed');

      const updatedZones = zones.map((z) => ({
        ...z,
        zone_media: z.zone_media.filter((m) => m.id !== mediaId),
      }));
      zonesCache = updatedZones;
      setZones(updatedZones);
    } catch (error) {
      console.error('Error removing media:', error);
      toast.error('Failed to delete media');
    }
  };

  const toggleZone = async (zoneId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('image_zones')
        .update({ is_enabled: !currentStatus })
        .eq('id', zoneId);

      if (error) throw error;

      const updatedZones = zones.map((z) =>
        z.id === zoneId ? { ...z, is_enabled: !currentStatus } : z
      );
      zonesCache = updatedZones;
      setZones(updatedZones);
      toast.success(`Zone ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling zone:', error);
      toast.error('Failed to update status');
    }
  };

  const setPrimaryMedia = async (zoneId: string, mediaId: string) => {
    try {
      const { error: primaryError } = await supabase
        .from('zone_media')
        .update({ order_index: 0 })
        .eq('id', mediaId);

      if (primaryError) throw primaryError;

      const zone = zones.find((z) => z.id === zoneId);
      if (zone) {
        const otherMedia = zone.zone_media.filter((m) => m.id !== mediaId);
        for (let i = 0; i < otherMedia.length; i++) {
          await supabase
            .from('zone_media')
            .update({ order_index: i + 1 })
            .eq('id', otherMedia[i].id);
        }
      }

      toast.success('Primary image updated');
      await fetchZones(true);
    } catch (error) {
      console.error('Error setting primary media:', error);
      toast.error('Failed to set primary image');
    }
  };

  const addMediaLink = async (
    zoneId: string,
    url: string,
    category: string | null = null
  ) => {
    try {
      const { error: dbError } = await supabase.from('zone_media').insert({
        zone_id: zoneId,
        url: url,
        type: 'image',
        order_index: 999,
        category: category,
      });

      if (dbError) throw dbError;

      toast.success('Image link added successfully');
      await fetchZones(true);
      return { success: true };
    } catch (error) {
      console.error('Error adding media link:', error);
      toast.error('Failed to add image link');
      return { success: false, error };
    }
  };

  return {
    zones,
    loading,
    uploading,
    addMedia,
    addMediaLink,
    removeMedia,
    toggleZone,
    setPrimaryMedia,
    refresh: () => fetchZones(true),
  };
};
