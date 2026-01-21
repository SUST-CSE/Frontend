/**
 * Strips HTML tags from a string to return plain text.
 * Useful for creating clean excerpts from rich text content.
 */
export const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Basic regex for SSR safety
    return html.replace(/<[^>]*>?/gm, '').trim();
  }
  
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};
