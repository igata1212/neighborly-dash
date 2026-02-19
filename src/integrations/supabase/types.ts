export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          orderer_id: string
          product_name: string
          store_name: string
          reward: number
          deliverer_id: string | null
          status: string
          deadline: string | null
          delivery_preference: string
          urgency: string
          receipt_total: number | null
          product_photo_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          orderer_id: string
          product_name: string
          store_name: string
          reward: number
          deliverer_id?: string | null
          status?: string
          deadline?: string | null
          delivery_preference?: string
          urgency?: string
          receipt_total?: number | null
          product_photo_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          orderer_id?: string
          product_name?: string
          store_name?: string
          reward?: number
          deliverer_id?: string | null
          status?: string
          deadline?: string | null
          delivery_preference?: string
          urgency?: string
          receipt_total?: number | null
          product_photo_url?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          user_type: string
          name: string
          location: string | null
          rating: number
          total_earnings: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_type: string
          name: string
          location?: string | null
          rating?: number
          total_earnings?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_type?: string
          name?: string
          location?: string | null
          rating?: number
          total_earnings?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
