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
  amenities: string[];
  image_ids: string[] | null;
  card_image_url: string | null;
  display_order: number;
}

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
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
      setRooms((prev) =>
        prev.map((room) => (room.id === id ? { ...room, ...updates } : room))
      );

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
      setRooms((prev) => [...prev, data]);
      return { success: true };
    } catch (error) {
      console.error('Error creating room:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    updateRoom,
    createRoom,
    refresh: fetchRooms,
  };
};
