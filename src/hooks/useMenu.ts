import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: number | null;
  is_visible: boolean;
  image_url: string | null;
  created_at?: string;
}

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      setMenuItems((prev) => [...prev, data]);
      return { success: true };
    } catch (error) {
      console.error('Error adding menu item:', error);
      return { success: false, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating menu item:', error);
      return { success: false, error };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return {
    menuItems,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refresh: fetchMenu,
  };
};
