import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in .env file
// For demo purposes, we use a mock client if env vars are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dnnfjvvepshllqwrbzba.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_j6GpC4hzWcvqag-lgY_V-w_2fyHozMT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      donors: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          amount: number;
          currency: string;
          payment_method: string;
          donation_type: string;
          message: string | null;
          status: string;
          program: string | null;
        };
        Insert: Omit<Database['public']['Tables']['donors']['Row'], 'id' | 'created_at'>;
      };
      volunteers: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          age: number;
          skills: string[];
          availability: string;
          motivation: string;
          program: string;
          status: string;
          location: string;
        };
        Insert: Omit<Database['public']['Tables']['volunteers']['Row'], 'id' | 'created_at'>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          status: string;
        };
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'created_at'>;
      };
      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>;
      };
      events: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          date: string;
          location: string;
          image: string;
          category: string;
          seats_available: number;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>;
      };
      event_registrations: {
        Row: {
          id: string;
          created_at: string;
          event_id: string;
          name: string;
          email: string;
          phone: string;
          attendees: number;
        };
        Insert: Omit<Database['public']['Tables']['event_registrations']['Row'], 'id' | 'created_at'>;
      };
      programs: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          category: string;
          image: string;
          location: string;
          beneficiaries: number;
          status: string;
          start_date: string;
          end_date: string | null;
        };
        Insert: Omit<Database['public']['Tables']['programs']['Row'], 'id' | 'created_at'>;
      };
      blog_posts: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          content: string;
          excerpt: string;
          image: string;
          category: string;
          author: string;
          published: boolean;
          tags: string[];
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at'>;
      };
      admin_users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string;
          role: string;
          last_login: string | null;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>;
      };
    };
  };
};
