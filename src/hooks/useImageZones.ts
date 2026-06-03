import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

// Helper function to compress images and guarantee that the result is strictly under 400KB.
const compressImageUnder400KB = async (file: File): Promise<File> => {
  let targetSizeMB = 0.38; // Under 390KB
  let initialQuality = 0.8;
  let maxWidthOrHeight = 1920;

  // Try standard compression first
  const firstOptions = {
    maxSizeMB: targetSizeMB,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/webp' as const,
    initialQuality: initialQuality,
    maxIteration: 15,
  };
  
  let resultBlob = await imageCompression(file, firstOptions);
  
  // If the compressed size is still greater than 400KB (409,600 bytes), run progressive compression passes
  let attempts = 0;
  while (resultBlob.size > 395 * 1024 && attempts < 4) {
    attempts++;
    maxWidthOrHeight = Math.round(maxWidthOrHeight * 0.85);
    initialQuality = Math.max(0.3, initialQuality - 0.15);
    targetSizeMB = targetSizeMB * 0.8;
    
    console.log(`Re-compressing image: attempt ${attempts}, size was ${(resultBlob.size / 1024).toFixed(1)} KB. Trying max size: ${targetSizeMB.toFixed(2)} MB, dimensions: ${maxWidthOrHeight}px, quality: ${initialQuality.toFixed(2)}`);
    
    const retryOptions = {
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
      fileType: 'image/webp' as const,
      initialQuality: initialQuality,
      maxIteration: 10,
    };
    
    resultBlob = await imageCompression(new File([resultBlob], file.name, { type: 'image/webp' }), retryOptions);
  }
  
  if (resultBlob.size > 400 * 1024) {
    console.log(`Final emergency compression pass: size was ${(resultBlob.size / 1024).toFixed(1)} KB`);
    const emergencyOptions = {
      maxSizeMB: 0.25,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      fileType: 'image/webp' as const,
      initialQuality: 0.4,
    };
    resultBlob = await imageCompression(new File([resultBlob], file.name, { type: 'image/webp' }), emergencyOptions);
  }
  
  console.log(`Final compressed image size: ${(resultBlob.size / 1024).toFixed(1)} KB`);
  return new File(
    [resultBlob],
    file.name.replace(/\.[^/.]+$/, '.webp'),
    { type: 'image/webp', lastModified: Date.now() }
  );
};


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
        fileToUpload = await compressImageUnder400KB(file);
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

  const uploadImageDirect = async (file: File) => {
    try {
      setUploading(true);

      let fileToUpload = await compressImageUnder400KB(file);

      const timestamp = Date.now();
      const fileName = `the-green-hills-resort/uploads/${timestamp}.webp`;

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

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error('Error in uploadImageDirect:', error);
      toast.error('Failed to upload image from PC');
      return { success: false, error };
    } finally {
      setUploading(false);
    }
  };

  return {
    zones,
    loading,
    uploading,
    addMedia,
    addMediaLink,
    uploadImageDirect,
    removeMedia,
    toggleZone,
    setPrimaryMedia,
    refresh: () => fetchZones(true),
  };
};
