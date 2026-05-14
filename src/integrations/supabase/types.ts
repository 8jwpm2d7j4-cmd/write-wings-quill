export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      beta_invites: {
        Row: {
          created_at: string
          id: string
          manuscript_id: string
          token: string
        }
        Insert: {
          created_at?: string
          id?: string
          manuscript_id: string
          token?: string
        }
        Update: {
          created_at?: string
          id?: string
          manuscript_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "beta_invites_manuscript_id_fkey"
            columns: ["manuscript_id"]
            isOneToOne: false
            referencedRelation: "manuscripts"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          content: string
          created_at: string
          id: string
          manuscript_id: string
          order: number
          title: string
          updated_at: string
          word_count: number
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          manuscript_id: string
          order?: number
          title?: string
          updated_at?: string
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          manuscript_id?: string
          order?: number
          title?: string
          updated_at?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "chapters_manuscript_id_fkey"
            columns: ["manuscript_id"]
            isOneToOne: false
            referencedRelation: "manuscripts"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          body: string
          created_at: string
          id: string
          manuscript_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          manuscript_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          manuscript_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_manuscript_id_fkey"
            columns: ["manuscript_id"]
            isOneToOne: false
            referencedRelation: "manuscripts"
            referencedColumns: ["id"]
          },
        ]
      }
      contest_entries: {
        Row: {
          contest_id: string
          id: string
          manuscript_id: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          contest_id: string
          id?: string
          manuscript_id: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          contest_id?: string
          id?: string
          manuscript_id?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_entries_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          max_words: number
          members_only: boolean
          min_words: number
          prize: string
          starts_at: string
          theme: string
          title: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          max_words?: number
          members_only?: boolean
          min_words?: number
          prize?: string
          starts_at?: string
          theme: string
          title: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          max_words?: number
          members_only?: boolean
          min_words?: number
          prize?: string
          starts_at?: string
          theme?: string
          title?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          manuscript_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          manuscript_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          manuscript_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_manuscript_id_fkey"
            columns: ["manuscript_id"]
            isOneToOne: false
            referencedRelation: "manuscripts"
            referencedColumns: ["id"]
          },
        ]
      }
      manuscripts: {
        Row: {
          author_id: string
          cover_url: string | null
          created_at: string
          genre: string | null
          id: string
          status: Database["public"]["Enums"]["manuscript_status"]
          synopsis: string | null
          title: string
          updated_at: string
          word_count: number
        }
        Insert: {
          author_id: string
          cover_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          status?: Database["public"]["Enums"]["manuscript_status"]
          synopsis?: string | null
          title?: string
          updated_at?: string
          word_count?: number
        }
        Update: {
          author_id?: string
          cover_url?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          status?: Database["public"]["Enums"]["manuscript_status"]
          synopsis?: string | null
          title?: string
          updated_at?: string
          word_count?: number
        }
        Relationships: []
      }
      memberships: {
        Row: {
          active: boolean
          provider: string | null
          provider_customer_id: string | null
          renews_at: string | null
          started_at: string
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          provider?: string | null
          provider_customer_id?: string | null
          renews_at?: string | null
          started_at?: string
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          provider?: string | null
          provider_customer_id?: string | null
          renews_at?: string | null
          started_at?: string
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          pen_name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          pen_name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          pen_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      writing_goals: {
        Row: {
          current_streak: number
          daily_target: number
          last_logged_date: string | null
          longest_streak: number
          total_words: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          daily_target?: number
          last_logged_date?: string | null
          longest_streak?: number
          total_words?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          daily_target?: number
          last_logged_date?: string | null
          longest_streak?: number
          total_words?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      manuscript_status: "draft" | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      manuscript_status: ["draft", "published"],
    },
  },
} as const
