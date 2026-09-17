// Supabase Storage Configuration for Pearl University e-Library
export const SUPABASE_PROJECT_ID = 'wzljqkiofryabdscnumx'
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`
export const SUPABASE_BOOKS_BUCKET = 'books'
export const SUPABASE_STORAGE_BOOKS_URL = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BOOKS_BUCKET}`

/**
 * Generates the direct public CDN URL for a book stored in Supabase Storage.
 * @param relativePath Path relative to the bucket root (e.g. "faculty of computing/B.SC Computer Science/.../Book.pdf")
 */
export function getSupabaseBookUrl(relativePath: string): string {
  const cleanPath = relativePath.replace(/^\/+/, '')
  // Encode URI components per path segment to properly handle spaces, ampersands, and special characters
  const encodedPath = cleanPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `${SUPABASE_STORAGE_BOOKS_URL}/${encodedPath}`
}
