import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  max_guests: number;
  fake_price: number | null;
  real_price: number | null;
  is_available: boolean;
  is_visible: boolean;
  amenities?: string[];
  images?: string[];
  card_image_url: string | null;
  display_order?: number;
}

// Module-level cache to prevent loader flickering on page navigation
let cachedRooms: Room[] | null = null;

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(cachedRooms || []);
  const [loading, setLoading] = useState(cachedRooms === null);

  const fetchRooms = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      const roomsData = data || [];
      cachedRooms = roomsData;
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Optimistic update
      setRooms((prev) => {
        const next = prev.map((room) => (room.id === id ? { ...room, ...updates } : room));
        cachedRooms = next;
        return next;
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating room:', error);
      return { success: false, error };
    }
  };

  const createRoom = async (roomData: Omit<Room, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) throw error;
      setRooms((prev) => {
        const next = [...prev, data];
        cachedRooms = next;
        return next;
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating room:', error);
      return { success: false, error };
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRooms((prev) => {
        const next = prev.filter((room) => room.id !== id);
        cachedRooms = next;
        return next;
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting room:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (cachedRooms) {
      // Silently refresh in the background if we already have cache
      fetchRooms(true);
    } else {
      fetchRooms(false);
    }
  }, []);

  return {
    rooms,
    loading,
    updateRoom,
    createRoom,
    deleteRoom,
    refresh: () => fetchRooms(false),
  };
};
