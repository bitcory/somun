import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhcxumczxhtjtkhdbmre.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY3h1bWN6eGh0anRraGRibXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTQ1NTMsImV4cCI6MjA4MTM5MDU1M30.ahh-VCFiBUhj-UoLkDWXtr6X19Yi0VI0NGNIZG1CiN8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbPost {
  id: string;
  category: string;
  nickname: string;
  password: string;
  title: string;
  content: string;
  images: string[] | null;
  views: number;
  likes: number;
  comment_count: number;
  created_at: string;
}

export interface DbComment {
  id: string;
  post_id: string;
  nickname: string;
  content: string;
  created_at: string;
}

export interface DbLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}
