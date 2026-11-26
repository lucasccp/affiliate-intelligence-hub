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
      pilot_artifacts: {
        Row: {
          community_id: string
          content: string
          created_at: string
          id: string
          job_id: string | null
          kind: string
          offer_id: string
          version: number
          workspace_id: string
        }
        Insert: {
          community_id: string
          content: string
          created_at?: string
          id?: string
          job_id?: string | null
          kind: string
          offer_id: string
          version: number
          workspace_id: string
        }
        Update: {
          community_id?: string
          content?: string
          created_at?: string
          id?: string
          job_id?: string | null
          kind?: string
          offer_id?: string
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_artifacts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "pilot_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pilot_artifacts_offer_id_version_fkey"
            columns: ["offer_id", "version"]
            isOneToOne: false
            referencedRelation: "pilot_offer_revisions"
            referencedColumns: ["offer_id", "version"]
          },
          {
            foreignKeyName: "pilot_artifacts_offer_id_workspace_id_community_id_fkey"
            columns: ["offer_id", "workspace_id", "community_id"]
            isOneToOne: false
            referencedRelation: "pilot_offers"
            referencedColumns: ["id", "workspace_id", "community_id"]
          },
        ]
      }
      pilot_events: {
        Row: {
          action: string
          actor_id: string | null
          community_id: string | null
          created_at: string
          detail: Json
          entity_id: string | null
          entity_type: string
          id: string
          version: number | null
          workspace_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          community_id?: string | null
          created_at?: string
          detail?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
          version?: number | null
          workspace_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          community_id?: string | null
          created_at?: string
          detail?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
          version?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_jobs: {
        Row: {
          attempts: number
          community_id: string
          completed_at: string | null
          created_at: string
          created_by: string
          id: string
          idempotency_key: string
          last_error: string | null
          lease_expires_at: string | null
          lease_owner: string | null
          max_attempts: number
          status: string
          step: string
          updated_at: string
          version: number
          workflow_id: string
          workspace_id: string
        }
        Insert: {
          attempts?: number
          community_id: string
          completed_at?: string | null
          created_at?: string
          created_by: string
          id?: string
          idempotency_key: string
          last_error?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          max_attempts?: number
          status?: string
          step: string
          updated_at?: string
          version: number
          workflow_id: string
          workspace_id: string
        }
        Update: {
          attempts?: number
          community_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string
          id?: string
          idempotency_key?: string
          last_error?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          max_attempts?: number
          status?: string
          step?: string
          updated_at?: string
          version?: number
          workflow_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_jobs_workflow_id_workspace_id_community_id_fkey"
            columns: ["workflow_id", "workspace_id", "community_id"]
            isOneToOne: false
            referencedRelation: "pilot_workflows"
            referencedColumns: ["id", "workspace_id", "community_id"]
          },
        ]
      }
      pilot_offer_revisions: {
        Row: {
          community_id: string
          created_at: string
          created_by: string
          currency: string
          draft_text: string
          expires_at: string
          id: string
          name: string
          observed_at: string
          offer_id: string
          price_cents: number
          source_url: string
          version: number
          workspace_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          created_by: string
          currency?: string
          draft_text: string
          expires_at: string
          id?: string
          name: string
          observed_at: string
          offer_id: string
          price_cents: number
          source_url: string
          version: number
          workspace_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          created_by?: string
          currency?: string
          draft_text?: string
          expires_at?: string
          id?: string
          name?: string
          observed_at?: string
          offer_id?: string
          price_cents?: number
          source_url?: string
          version?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_offer_revisions_offer_id_workspace_id_community_id_fkey"
            columns: ["offer_id", "workspace_id", "community_id"]
            isOneToOne: false
            referencedRelation: "pilot_offers"
            referencedColumns: ["id", "workspace_id", "community_id"]
          },
        ]
      }
      pilot_offers: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approved_version: number | null
          community_id: string
          created_at: string
          created_by: string
          current_version: number
          id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approved_version?: number | null
          community_id: string
          created_at?: string
          created_by: string
          current_version?: number
          id?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approved_version?: number | null
          community_id?: string
          created_at?: string
          created_by?: string
          current_version?: number
          id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_offers_community_id_workspace_id_fkey"
            columns: ["community_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id", "workspace_id"]
          },
        ]
      }
      pilot_quota_accounts: {
        Row: {
          accounted: number
          allowance: number
          created_at: string
          id: string
          margin: number
          period_start: string
          provider: string
          reserved: number
          snapshot_valid_until: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          accounted?: number
          allowance?: number
          created_at?: string
          id?: string
          margin?: number
          period_start: string
          provider: string
          reserved?: number
          snapshot_valid_until?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          accounted?: number
          allowance?: number
          created_at?: string
          id?: string
          margin?: number
          period_start?: string
          provider?: string
          reserved?: number
          snapshot_valid_until?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_quota_accounts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_quota_reservations: {
        Row: {
          account_id: string
          community_id: string
          created_at: string
          created_by: string
          id: string
          modality: string
          observed_units: number | null
          operation_key: string
          settled_at: string | null
          status: string
          units: number
          workspace_id: string
        }
        Insert: {
          account_id: string
          community_id: string
          created_at?: string
          created_by: string
          id?: string
          modality: string
          observed_units?: number | null
          operation_key: string
          settled_at?: string | null
          status?: string
          units: number
          workspace_id: string
        }
        Update: {
          account_id?: string
          community_id?: string
          created_at?: string
          created_by?: string
          id?: string
          modality?: string
          observed_units?: number | null
          operation_key?: string
          settled_at?: string | null
          status?: string
          units?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_quota_reservations_account_id_workspace_id_fkey"
            columns: ["account_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "pilot_quota_accounts"
            referencedColumns: ["id", "workspace_id"]
          },
          {
            foreignKeyName: "pilot_quota_reservations_community_id_workspace_id_fkey"
            columns: ["community_id", "workspace_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id", "workspace_id"]
          },
        ]
      }
      pilot_workflows: {
        Row: {
          community_id: string
          created_at: string
          created_by: string
          id: string
          kind: string
          offer_id: string
          workspace_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          created_by: string
          id?: string
          kind?: string
          offer_id: string
          workspace_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          created_by?: string
          id?: string
          kind?: string
          offer_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_workflows_offer_id_workspace_id_community_id_fkey"
            columns: ["offer_id", "workspace_id", "community_id"]
            isOneToOne: false
            referencedRelation: "pilot_offers"
            referencedColumns: ["id", "workspace_id", "community_id"]
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
      pilot_approve_offer: {
        Args: { _offer: string; _version: number }
        Returns: undefined
      }
      pilot_claim_job: {
        Args: { _job: string; _lease_owner: string; _lease_seconds?: number }
        Returns: {
          attempts: number
          community_id: string
          completed_at: string | null
          created_at: string
          created_by: string
          id: string
          idempotency_key: string
          last_error: string | null
          lease_expires_at: string | null
          lease_owner: string | null
          max_attempts: number
          status: string
          step: string
          updated_at: string
          version: number
          workflow_id: string
          workspace_id: string
        }
        SetofOptions: {
          from: "*"
          to: "pilot_jobs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      pilot_complete_job: {
        Args: { _job: string; _lease_owner: string }
        Returns: string
      }
      pilot_enqueue_job: {
        Args: {
          _max_attempts?: number
          _offer: string
          _step: string
          _version: number
        }
        Returns: string
      }
      pilot_export_offer: {
        Args: { _offer: string }
        Returns: {
          community_id: string
          created_at: string
          created_by: string
          currency: string
          draft_text: string
          expires_at: string
          id: string
          name: string
          observed_at: string
          offer_id: string
          price_cents: number
          source_url: string
          version: number
          workspace_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "pilot_offer_revisions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      pilot_log: {
        Args: {
          _action: string
          _comm: string
          _detail: Json
          _entity: string
          _type: string
          _version: number
          _ws: string
        }
        Returns: undefined
      }
      pilot_record_quota_snapshot: {
        Args: {
          _accounted: number
          _allowance: number
          _margin: number
          _period: string
          _provider: string
          _valid_until: string
          _workspace: string
        }
        Returns: string
      }
      pilot_require_manager: {
        Args: { _comm: string; _ws: string }
        Returns: undefined
      }
      pilot_reserve_quota: {
        Args: {
          _account: string
          _additional_cents: number
          _community: string
          _modality: string
          _operation_key: string
          _units: number
        }
        Returns: {
          account_id: string
          community_id: string
          created_at: string
          created_by: string
          id: string
          modality: string
          observed_units: number | null
          operation_key: string
          settled_at: string | null
          status: string
          units: number
          workspace_id: string
        }
        SetofOptions: {
          from: "*"
          to: "pilot_quota_reservations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      pilot_save_offer: {
        Args: {
          _community: string
          _data: Json
          _offer: string
          _workspace: string
        }
        Returns: string
      }
      pilot_settle_reservation: {
        Args: {
          _observed_units?: number
          _outcome: string
          _reservation: string
        }
        Returns: undefined
      }
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
