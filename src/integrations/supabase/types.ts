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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_name: string
          entity_type: string
          id: string
          workspace_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_name?: string
          entity_type: string
          id?: string
          workspace_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_name?: string
          entity_type?: string
          id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          community_id: string
          created_at: string
          enabled: boolean
          id: string
          name: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_community_id_workspace_id_fkey"
            columns: ["community_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id", "workspace_id"]
          },
        ]
      }
      channels: {
        Row: {
          community_id: string
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_community_id_workspace_id_fkey"
            columns: ["community_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id", "workspace_id"]
          },
        ]
      }
      communities: {
        Row: {
          automation_mode: string
          created_at: string
          currency: string
          daily_offer_limit: number
          description: string
          id: string
          language: string
          name: string
          niche: string
          slug: string
          status: string
          target_audience: string
          timezone: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          automation_mode?: string
          created_at?: string
          currency?: string
          daily_offer_limit?: number
          description?: string
          id?: string
          language?: string
          name: string
          niche: string
          slug: string
          status?: string
          target_audience?: string
          timezone?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          automation_mode?: string
          created_at?: string
          currency?: string
          daily_offer_limit?: number
          description?: string
          id?: string
          language?: string
          name?: string
          niche?: string
          slug?: string
          status?: string
          target_audience?: string
          timezone?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      community_categories: {
        Row: {
          community_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_categories_community_id_workspace_id_fkey"
            columns: ["community_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id", "workspace_id"]
          },
        ]
      }
      community_settings: {
        Row: {
          approval_required: boolean
          community_id: string
          created_at: string
          id: string
          unique_offers_only: boolean
          updated_at: string
          workspace_id: string
        }
        Insert: {
          approval_required?: boolean
          community_id: string
          created_at?: string
          id?: string
          unique_offers_only?: boolean
          updated_at?: string
          workspace_id: string
        }
        Update: {
          approval_required?: boolean
          community_id?: string
          created_at?: string
          id?: string
          unique_offers_only?: boolean
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_settings_community_id_workspace_id_fkey"
            columns: ["community_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id", "workspace_id"]
          },
        ]
      }
      marketplace_connections: {
        Row: {
          community_id: string
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_connections_community_id_workspace_id_fkey"
            columns: ["community_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id", "workspace_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          display_name: string
          id: string
          language: string
          theme: string
          timezone: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          display_name?: string
          id: string
          language?: string
          theme?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          display_name?: string
          id?: string
          language?: string
          theme?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          daily_offer_limit: number
          id: string
          language: string
          name: string
          personal_owner_id: string
          timezone: string
          updated_at: string
          zero_cost_budget: number
        }
        Insert: {
          created_at?: string
          daily_offer_limit?: number
          id?: string
          language?: string
          name: string
          personal_owner_id: string
          timezone?: string
          updated_at?: string
          zero_cost_budget?: number
        }
        Update: {
          created_at?: string
          daily_offer_limit?: number
          id?: string
          language?: string
          name?: string
          personal_owner_id?: string
          timezone?: string
          updated_at?: string
          zero_cost_budget?: number
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_personal_owner_id_fkey"
            columns: ["personal_owner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_personal_workspace: {
        Args: { _name: string; _user: string }
        Returns: undefined
      }
      can_manage_workspace: { Args: { _workspace: string }; Returns: boolean }
      is_workspace_member: { Args: { _workspace: string }; Returns: boolean }
      save_community: {
        Args: { _data: Json; _id: string; _workspace: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
