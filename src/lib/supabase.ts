import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  skills: string[]
  interests: string[]
  location: string
  phone: string
  joined_date: string
  profile_image: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  location_lat: number
  location_lng: number
  location_address: string
  category: string
  volunteers_needed: number
  date: string
  time: string
  organizer: string
  requirements: string[]
  image: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}