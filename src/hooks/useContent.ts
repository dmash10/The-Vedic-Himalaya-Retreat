import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
}

export const useContent = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resort_content')
        .select('*');

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: string, key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('resort_content')
        .upsert([{ section, key, value }], { onConflict: 'section,key' });
      if (error) throw error;

      await fetchContent();
      return { success: true };
    } catch (error) {
      console.error('Error updating content:', error);
      return { success: false, error };
    }
  };

  const updateMultipleContent = async (items: { section: string; key: string; value: string }[]) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('resort_content')
        .upsert(items, { onConflict: 'section,key' });
      if (error) throw error;

      await fetchContent();
      return { success: true };
    } catch (error) {
      console.error('Error updating multiple content:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getValue = (section: string, key: string, fallback: string = '') => {
    const item = content.find(
      (c) => c.section === section && c.key === key
    );
    return item ? item.value : fallback;
  };

  return {
    content,
    loading,
    updateContent,
    updateMultipleContent,
    getValue,
    refresh: fetchContent,
  };
};
