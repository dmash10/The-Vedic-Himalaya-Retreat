import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface ContentItem {
  id: string;
  section: string;
  key: string;
  value: string;
}

interface ContentContextType {
  content: ContentItem[];
  loading: boolean;
  updateContent: (section: string, key: string, value: string) => Promise<{ success: boolean; error?: any }>;
  updateMultipleContent: (items: { section: string; key: string; value: string }[]) => Promise<{ success: boolean; error?: any }>;
  getValue: (section: string, key: string, fallback?: string) => string;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
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
  }, []);

  const updateContent = useCallback(async (section: string, key: string, value: string) => {
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
  }, [fetchContent]);

  const updateMultipleContent = useCallback(async (items: { section: string; key: string; value: string }[]) => {
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
  }, [fetchContent]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const getValue = useCallback((section: string, key: string, fallback: string = '') => {
    const item = content.find(
      (c) => c.section === section && c.key === key
    );
    return item ? item.value : fallback;
  }, [content]);

  return (
    <ContentContext.Provider value={{
      content,
      loading,
      updateContent,
      updateMultipleContent,
      getValue,
      refresh: fetchContent,
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
