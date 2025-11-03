import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las tablas de la base de datos
export interface Group {
    id: string
    name: string
    host_name: string
    access_code: string
    host_participates: boolean
    created_at: string
}export interface Member {
    id: string
    group_id: string
    name: string
    contact: string
    created_at: string
}

export interface DrawResult {
    id: string
    group_id: string
    giver_id: string
    receiver_id: string
    created_at: string
}

export interface GiftIdea {
    id: string
    member_id: string
    group_id: string
    title: string
    image_url?: string
    created_at: string
}