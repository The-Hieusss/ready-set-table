import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://loqpswilpgznyodvpbes.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable__Z6ARmB2XZQqJc9-IWXPqQ_3iJ25kKy';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type UserRole = 'customer' | 'owner';

// Types derived from schema
export interface User {
  user_id: string; // Used to match Supabase auth id
  name: string;
  email: string;
  role: UserRole;
}

export interface Restaurant {
  restaurant_id: string;
  name: string;
  address: string;
  cuisine_type: string;
  owner_id: string;
  description?: string;
  phone?: string;
  image_url?: string;
  opening_hours?: string;
}

export interface Reservation {
  reservation_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  user_id: string;
  restaurant_id: string;
  status?: string;
}

export interface Review {
  review_id: string;
  rating: number;
  comment: string;
  review_date: string;
  user_id: string;
  restaurant_id: string;
}
