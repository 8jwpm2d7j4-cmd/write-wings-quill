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
      achievements: {
        Row: {
          code: string
          description: string
          icon: string
          title: string
        }
        Insert: {
          code: string
          description: string
          icon?: string
          title: string
        }
        Update: {
          code?: string
          description?: string
          icon?: string
          title?: string
        }
        Relationships: []
      }
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
      bookmarks: {
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
        Relationships: []
      }
      chapter_revisions: {
        Row: {
          chapter_id: string
          content: string
          created_at: string
          id: string
          word_count: number
        }
        Insert: {
          chapter_id: string
          content: string
          created_at?: string
          id?: string
          word_count?: number
        }
        Update: {
          chapter_id?: string
          content?: string
          created_at?: string
          id?: string
          word_count?: number
        }
        Relationships: []
      }
      chapter_unlocks: {
        Row: {
          amount_cents: number
          chapter_id: string
          created_at: string
          environment: string
          id: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          chapter_id: string
          created_at?: string
          environment?: string
          id?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          chapter_id?: string
          created_at?: string
          environment?: string
          id?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          content: string
          created_at: string
          id: string
          is_paid: boolean
          manuscript_id: string
          order: number
          title: string
          unlock_price_cents: number | null
          updated_at: string
          word_count: number
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_paid?: boolean
          manuscript_id: string
          order?: number
          title?: string
          unlock_price_cents?: number | null
          updated_at?: string
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_paid?: boolean
          manuscript_id?: string
          order?: number
          title?: string
          unlock_price_cents?: number | null
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
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          body: string
          chapter_id: string | null
          created_at: string
          id: string
          manuscript_id: string
          user_id: string
        }
        Insert: {
          body: string
          chapter_id?: string | null
          created_at?: string
          id?: string
          manuscript_id: string
          user_id: string
        }
        Update: {
          body?: string
          chapter_id?: string | null
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
      content_reports: {
        Row: {
          comment_id: string | null
          created_at: string
          details: string | null
          id: string
          manuscript_id: string | null
          reason: string
          reporter_id: string
          status: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          manuscript_id?: string | null
          reason: string
          reporter_id: string
          status?: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          details?: string | null
          id?: string
          manuscript_id?: string | null
          reason?: string
          reporter_id?: string
          status?: string
        }
        Relationships: []
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
      daily_ai_usage: {
        Row: {
          count: number
          date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_word_log: {
        Row: {
          date: string
          user_id: string
          words: number
        }
        Insert: {
          date: string
          user_id: string
          words?: number
        }
        Update: {
          date?: string
          user_id?: string
          words?: number
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
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
          is_featured: boolean
          slug: string | null
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
          is_featured?: boolean
          slug?: string | null
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
          is_featured?: boolean
          slug?: string | null
          status?: Database["public"]["Enums"]["manuscript_status"]
          synopsis?: string | null
          title?: string
          updated_at?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "manuscripts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      notes: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          manuscript_id: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          manuscript_id: string
          title?: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          manuscript_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          kind: string
          manuscript_id: string | null
          message: string
          read: boolean
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          kind: string
          manuscript_id?: string | null
          message: string
          read?: boolean
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          manuscript_id?: string | null
          message?: string
          read?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          bonus_pro_until: string | null
          created_at: string
          daily_reminder_at: string | null
          email_notifications: boolean
          genres: string[] | null
          id: string
          onboarded: boolean
          pen_name: string
          referral_code: string | null
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          bonus_pro_until?: string | null
          created_at?: string
          daily_reminder_at?: string | null
          email_notifications?: boolean
          genres?: string[] | null
          id: string
          onboarded?: boolean
          pen_name: string
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          bonus_pro_until?: string | null
          created_at?: string
          daily_reminder_at?: string | null
          email_notifications?: boolean
          genres?: string[] | null
          id?: string
          onboarded?: boolean
          pen_name?: string
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reactions: {
        Row: {
          chapter_id: string
          created_at: string
          emoji: string
          id: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          emoji: string
          id?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          emoji?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          chapter_id: string | null
          manuscript_id: string
          scroll_pct: number
          updated_at: string
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          manuscript_id: string
          scroll_pct?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          manuscript_id?: string
          scroll_pct?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_streaks: {
        Row: {
          current_streak: number
          last_read_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_read_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_read_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          price_id: string
          product_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id: string
          product_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id?: string
          product_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tips: {
        Row: {
          amount_cents: number
          created_at: string
          environment: string
          from_user_id: string
          id: string
          manuscript_id: string | null
          stripe_session_id: string | null
          to_user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          environment?: string
          from_user_id: string
          id?: string
          manuscript_id?: string | null
          stripe_session_id?: string | null
          to_user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          environment?: string
          from_user_id?: string
          id?: string
          manuscript_id?: string | null
          stripe_session_id?: string | null
          to_user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          code: string
          earned_at: string
          user_id: string
        }
        Insert: {
          code: string
          earned_at?: string
          user_id: string
        }
        Update: {
          code?: string
          earned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_code_fkey"
            columns: ["code"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["code"]
          },
        ]
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
      award_achievement: {
        Args: { _code: string; _target_user?: string }
        Returns: boolean
      }
      bump_ai_usage: { Args: never; Returns: number }
      gen_referral_code: { Args: never; Returns: string }
      get_chapter_content: { Args: { _chapter_id: string }; Returns: string }
      get_my_profile_settings: {
        Args: never
        Returns: {
          avatar_url: string
          bio: string
          bonus_pro_until: string
          created_at: string
          daily_reminder_at: string
          email_notifications: boolean
          genres: string[]
          id: string
          onboarded: boolean
          pen_name: string
          referral_code: string
          referred_by: string
          updated_at: string
        }[]
      }
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
      my_invited_count: { Args: never; Returns: number }
      public_member_count: { Args: never; Returns: number }
      redeem_referral: { Args: { _code: string }; Returns: Json }
      send_notification: {
        Args: {
          _kind: string
          _manuscript_id?: string
          _message: string
          _user_id: string
        }
        Returns: undefined
      }
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
