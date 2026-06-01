// Re-export everything from the context-based implementation.
// This file is kept for backward compatibility — all pages that import
// `useContent` from '@/hooks/useContent' will now use the shared context.
export { useContent } from '@/contexts/ContentContext';
export type { ContentItem } from '@/contexts/ContentContext';
