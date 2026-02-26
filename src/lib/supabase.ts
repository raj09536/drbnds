import { createClient as createBrowserClient } from '../utils/supabase/client'

// Convenient client-side supabase instance
export const supabase = createBrowserClient()
