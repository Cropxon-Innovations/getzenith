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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      channels: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          members: string[] | null
          name: string
          tenant_id: string
          type: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          members?: string[] | null
          name: string
          tenant_id: string
          type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          members?: string[] | null
          name?: string
          tenant_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content: {
        Row: {
          access_level: string | null
          author_id: string | null
          created_at: string | null
          data: Json | null
          id: string
          published_at: string | null
          scheduled_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          tenant_id: string
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          author_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          tenant_id: string
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          author_id?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          tenant_id?: string
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          folder: string | null
          id: string
          name: string
          tenant_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          folder?: string | null
          id?: string
          name: string
          tenant_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          folder?: string | null
          id?: string
          name?: string
          tenant_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_media_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_versions: {
        Row: {
          author_id: string | null
          changes: string | null
          content_id: string
          created_at: string | null
          data: Json
          id: string
        }
        Insert: {
          author_id?: string | null
          changes?: string | null
          content_id: string
          created_at?: string | null
          data: Json
          id?: string
        }
        Update: {
          author_id?: string | null
          changes?: string | null
          content_id?: string
          created_at?: string | null
          data?: Json
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
        ]
      }
      content_locks: {
        Row: {
          content_id: string
          expires_at: string | null
          id: string
          locked_at: string | null
          locked_by: string
          section_id: string | null
        }
        Insert: {
          content_id: string
          expires_at?: string | null
          id?: string
          locked_at?: string | null
          locked_by: string
          section_id?: string | null
        }
        Update: {
          content_id?: string
          expires_at?: string | null
          id?: string
          locked_at?: string | null
          locked_by?: string
          section_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_locks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "cms_content"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          host_id: string
          id: string
          is_recording: boolean | null
          meeting_link: string | null
          participants: string[] | null
          recording_url: string | null
          scheduled_at: string | null
          status: string | null
          tenant_id: string
          title: string
          waiting_room_enabled: boolean | null
          waiting_room_participants: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          host_id: string
          id?: string
          is_recording?: boolean | null
          meeting_link?: string | null
          participants?: string[] | null
          recording_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          tenant_id: string
          title: string
          waiting_room_enabled?: boolean | null
          waiting_room_participants?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          host_id?: string
          id?: string
          is_recording?: boolean | null
          meeting_link?: string | null
          participants?: string[] | null
          recording_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
          waiting_room_enabled?: boolean | null
          waiting_room_participants?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          channel_id: string | null
          content: string
          created_at: string
          id: string
          message_type: string | null
          read_by: Json | null
          recipient_id: string | null
          sender_id: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          channel_id?: string | null
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_by?: Json | null
          recipient_id?: string | null
          sender_id: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          channel_id?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_by?: Json | null
          recipient_id?: string | null
          sender_id?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string | null
          read: boolean | null
          tenant_id: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          tenant_id: string
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          tenant_id?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          invoice_url: string | null
          payment_id: string | null
          payment_provider: string | null
          status: string
          subscription_id: string | null
          tenant_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_id?: string | null
          payment_provider?: string | null
          status: string
          subscription_id?: string | null
          tenant_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_id?: string | null
          payment_provider?: string | null
          status?: string
          subscription_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_history_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_tenant_id: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_tenant_id?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_tenant_id?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_tenant_id_fkey"
            columns: ["current_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          billing_cycle: string | null
          created_at: string
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          payment_id: string | null
          payment_provider: string | null
          plan: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          billing_cycle?: string | null
          created_at?: string
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          plan?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          billing_cycle?: string | null
          created_at?: string
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          payment_id?: string | null
          payment_provider?: string | null
          plan?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          notification_method: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string
          tenant_id: string
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          notification_method?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          tenant_id: string
          token?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          notification_method?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          tenant_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          business_goals: string[] | null
          business_type: string | null
          created_at: string | null
          font_family: string | null
          id: string
          logo_url: string | null
          name: string
          plan: string | null
          primary_color: string | null
          slug: string
          subdomain: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          business_goals?: string[] | null
          business_type?: string | null
          created_at?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          name: string
          plan?: string | null
          primary_color?: string | null
          slug: string
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          business_goals?: string[] | null
          business_type?: string | null
          created_at?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          plan?: string | null
          primary_color?: string | null
          slug?: string
          subdomain?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_tenant_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_in_tenant: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "tenant_admin" | "editor" | "mentor" | "viewer"
      content_status: "draft" | "published" | "scheduled" | "archived"
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
      app_role: ["tenant_admin", "editor", "mentor", "viewer"],
      content_status: ["draft", "published", "scheduled", "archived"],
    },
  },
} as const
