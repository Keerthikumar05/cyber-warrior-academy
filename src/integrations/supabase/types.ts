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
      battle_queue: {
        Row: {
          id: string
          joined_at: string
          skill_level: number
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          skill_level?: number
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          skill_level?: number
          user_id?: string
        }
        Relationships: []
      }
      battle_submissions: {
        Row: {
          battle_id: string
          code: string
          id: string
          passed: boolean
          submitted_at: string
          user_id: string
        }
        Insert: {
          battle_id: string
          code: string
          id?: string
          passed?: boolean
          submitted_at?: string
          user_id: string
        }
        Update: {
          battle_id?: string
          code?: string
          id?: string
          passed?: boolean
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_submissions_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battles"
            referencedColumns: ["id"]
          },
        ]
      }
      battles: {
        Row: {
          finished_at: string | null
          id: string
          player_a: string
          player_b: string
          problem_slug: string
          started_at: string
          status: string
          winner: string | null
        }
        Insert: {
          finished_at?: string | null
          id?: string
          player_a: string
          player_b: string
          problem_slug: string
          started_at?: string
          status?: string
          winner?: string | null
        }
        Update: {
          finished_at?: string | null
          id?: string
          player_a?: string
          player_b?: string
          problem_slug?: string
          started_at?: string
          status?: string
          winner?: string | null
        }
        Relationships: []
      }
      code_submissions: {
        Row: {
          code: string
          created_at: string
          id: string
          language: string
          mission_slug: string
          output: string | null
          passed: boolean
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          language: string
          mission_slug: string
          output?: string | null
          passed?: boolean
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          language?: string
          mission_slug?: string
          output?: string | null
          passed?: boolean
          user_id?: string
        }
        Relationships: []
      }
      daily_quests: {
        Row: {
          active: boolean
          coin_reward: number
          created_at: string
          description: string
          id: string
          quest_type: string
          slug: string
          target: number
          title: string
          xp_reward: number
        }
        Insert: {
          active?: boolean
          coin_reward?: number
          created_at?: string
          description: string
          id?: string
          quest_type: string
          slug: string
          target: number
          title: string
          xp_reward?: number
        }
        Update: {
          active?: boolean
          coin_reward?: number
          created_at?: string
          description?: string
          id?: string
          quest_type?: string
          slug?: string
          target?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          is_mentor_answer: boolean
          thread_id: string
          upvotes: number
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          is_mentor_answer?: boolean
          thread_id: string
          upvotes?: number
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          is_mentor_answer?: boolean
          thread_id?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          mission_slug: string | null
          pinned: boolean
          reply_count: number
          title: string
          updated_at: string
          upvotes: number
          world_slug: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          id?: string
          mission_slug?: string | null
          pinned?: boolean
          reply_count?: number
          title: string
          updated_at?: string
          upvotes?: number
          world_slug?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          mission_slug?: string | null
          pinned?: boolean
          reply_count?: number
          title?: string
          updated_at?: string
          upvotes?: number
          world_slug?: string | null
        }
        Relationships: []
      }
      forum_votes: {
        Row: {
          created_at: string
          id: string
          reply_id: string | null
          thread_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_votes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_members: {
        Row: {
          guild_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          guild_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          guild_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guild_members_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          member_count: number
          name: string
          owner_id: string
          tag: string
          total_xp: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          member_count?: number
          name: string
          owner_id: string
          tag: string
          total_xp?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          member_count?: number
          name?: string
          owner_id?: string
          tag?: string
          total_xp?: number
        }
        Relationships: []
      }
      mentor_messages: {
        Row: {
          content: string
          context: Json | null
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          context?: Json | null
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          context?: Json | null
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number
          created_at: string
          current_streak: number
          id: string
          last_active_date: string | null
          level: number
          streak_shields: number
          updated_at: string
          username: string | null
          xp: number
          xp_multiplier_until: string | null
          xp_multiplier_value: number
        }
        Insert: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_streak?: number
          id: string
          last_active_date?: string | null
          level?: number
          streak_shields?: number
          updated_at?: string
          username?: string | null
          xp?: number
          xp_multiplier_until?: string | null
          xp_multiplier_value?: number
        }
        Update: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_streak?: number
          id?: string
          last_active_date?: string | null
          level?: number
          streak_shields?: number
          updated_at?: string
          username?: string | null
          xp?: number
          xp_multiplier_until?: string | null
          xp_multiplier_value?: number
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_slug: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_slug: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_slug?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          attempts: number
          best_score: number
          completed: boolean
          completed_at: string | null
          id: string
          mission_slug: string
          step_index: number
          updated_at: string
          user_id: string
          world_slug: string
        }
        Insert: {
          attempts?: number
          best_score?: number
          completed?: boolean
          completed_at?: string | null
          id?: string
          mission_slug: string
          step_index?: number
          updated_at?: string
          user_id: string
          world_slug: string
        }
        Update: {
          attempts?: number
          best_score?: number
          completed?: boolean
          completed_at?: string | null
          id?: string
          mission_slug?: string
          step_index?: number
          updated_at?: string
          user_id?: string
          world_slug?: string
        }
        Relationships: []
      }
      user_quest_progress: {
        Row: {
          claimed: boolean
          completed: boolean
          id: string
          progress: number
          quest_date: string
          quest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed?: boolean
          completed?: boolean
          id?: string
          progress?: number
          quest_date?: string
          quest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed?: boolean
          completed?: boolean
          id?: string
          progress?: number
          quest_date?: string
          quest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "daily_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_xp_events: {
        Row: {
          amount: number
          created_at: string
          id: string
          mission_slug: string | null
          source: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          mission_slug?: string | null
          source: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          mission_slug?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard_alltime: {
        Row: {
          avatar_url: string | null
          level: number | null
          rank: number | null
          user_id: string | null
          username: string | null
          xp: number | null
        }
        Relationships: []
      }
      leaderboard_weekly: {
        Row: {
          avatar_url: string | null
          level: number | null
          rank: number | null
          user_id: string | null
          username: string | null
          weekly_xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_xp: {
        Args: { _amount: number; _mission?: string; _source: string }
        Returns: {
          leveled_up: boolean
          new_level: number
          new_xp: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "mentor" | "user"
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
      app_role: ["admin", "mentor", "user"],
    },
  },
} as const
