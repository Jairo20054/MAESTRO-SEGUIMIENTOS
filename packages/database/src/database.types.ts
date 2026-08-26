export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      daily_priorities: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          id: string;
          occurred_on: string;
          operation_id: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          occurred_on: string;
          operation_id: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          occurred_on?: string;
          operation_id?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      focus_sessions: {
        Row: {
          created_at: string;
          duration_seconds: number | null;
          ended_at: string | null;
          id: string;
          note: string | null;
          operation_id: string;
          reference_id: string | null;
          reference_type: string | null;
          session_type: string;
          started_at: string;
          status: string;
          system_key: string;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          duration_seconds?: number | null;
          ended_at?: string | null;
          id?: string;
          note?: string | null;
          operation_id: string;
          reference_id?: string | null;
          reference_type?: string | null;
          session_type: string;
          started_at: string;
          status?: string;
          system_key?: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          duration_seconds?: number | null;
          ended_at?: string | null;
          id?: string;
          note?: string | null;
          operation_id?: string;
          reference_id?: string | null;
          reference_type?: string | null;
          session_type?: string;
          started_at?: string;
          status?: string;
          system_key?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      goal_steps: {
        Row: {
          completed_at: string | null;
          created_at: string;
          current_value: number | null;
          due_on: string | null;
          goal_id: string;
          id: string;
          operation_id: string;
          position: number;
          status: string;
          target_value: number | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          current_value?: number | null;
          due_on?: string | null;
          goal_id: string;
          id?: string;
          operation_id: string;
          position?: number;
          status?: string;
          target_value?: number | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          current_value?: number | null;
          due_on?: string | null;
          goal_id?: string;
          id?: string;
          operation_id?: string;
          position?: number;
          status?: string;
          target_value?: number | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goal_steps_goal_id_user_id_fkey";
            columns: ["goal_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "goals";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      goals: {
        Row: {
          archived_at: string | null;
          completed_at: string | null;
          created_at: string;
          current_value: number | null;
          description: string | null;
          due_on: string | null;
          id: string;
          metric_name: string | null;
          operation_id: string;
          priority: number;
          starts_on: string | null;
          status: string;
          system_key: string;
          target_value: number | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          archived_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          current_value?: number | null;
          description?: string | null;
          due_on?: string | null;
          id?: string;
          metric_name?: string | null;
          operation_id: string;
          priority?: number;
          starts_on?: string | null;
          status?: string;
          system_key?: string;
          target_value?: number | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          archived_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          current_value?: number | null;
          description?: string | null;
          due_on?: string | null;
          id?: string;
          metric_name?: string | null;
          operation_id?: string;
          priority?: number;
          starts_on?: string | null;
          status?: string;
          system_key?: string;
          target_value?: number | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      habit_logs: {
        Row: {
          created_at: string;
          habit_id: string;
          id: string;
          note: string | null;
          occurred_on: string;
          occurrence_index: number;
          operation_id: string;
          status: string;
          updated_at: string;
          user_id: string;
          value: number | null;
        };
        Insert: {
          created_at?: string;
          habit_id: string;
          id?: string;
          note?: string | null;
          occurred_on: string;
          occurrence_index?: number;
          operation_id: string;
          status: string;
          updated_at?: string;
          user_id: string;
          value?: number | null;
        };
        Update: {
          created_at?: string;
          habit_id?: string;
          id?: string;
          note?: string | null;
          occurred_on?: string;
          occurrence_index?: number;
          operation_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
          value?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_user_id_fkey";
            columns: ["habit_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      habit_schedules: {
        Row: {
          created_at: string;
          frequency: string;
          habit_id: string;
          id: string;
          preferred_time: string | null;
          times_per_week: number | null;
          timezone: string;
          updated_at: string;
          user_id: string;
          weekdays: number[];
        };
        Insert: {
          created_at?: string;
          frequency?: string;
          habit_id: string;
          id?: string;
          preferred_time?: string | null;
          times_per_week?: number | null;
          timezone?: string;
          updated_at?: string;
          user_id: string;
          weekdays?: number[];
        };
        Update: {
          created_at?: string;
          frequency?: string;
          habit_id?: string;
          id?: string;
          preferred_time?: string | null;
          times_per_week?: number | null;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
          weekdays?: number[];
        };
        Relationships: [
          {
            foreignKeyName: "habit_schedules_habit_id_user_id_fkey";
            columns: ["habit_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      habits: {
        Row: {
          active: boolean;
          archived_at: string | null;
          category: string | null;
          color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          priority: number;
          system_key: string;
          target_value: number | null;
          title: string;
          unit: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          archived_at?: string | null;
          category?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          priority?: number;
          system_key?: string;
          target_value?: number | null;
          title: string;
          unit?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          active?: boolean;
          archived_at?: string | null;
          category?: string | null;
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          priority?: number;
          system_key?: string;
          target_value?: number | null;
          title?: string;
          unit?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          content: string;
          created_at: string;
          entry_type: string;
          id: string;
          metadata: Json;
          mood: number | null;
          occurred_on: string;
          operation_id: string;
          system_key: string;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          entry_type?: string;
          id?: string;
          metadata?: Json;
          mood?: number | null;
          occurred_on: string;
          operation_id: string;
          system_key?: string;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          entry_type?: string;
          id?: string;
          metadata?: Json;
          mood?: number | null;
          occurred_on?: string;
          operation_id?: string;
          system_key?: string;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      legacy_migration_items: {
        Row: {
          created_at: string;
          destination_id: string | null;
          destination_type: string | null;
          error_code: string | null;
          id: string;
          operation_id: string;
          run_id: string;
          source_fingerprint: string;
          source_key: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          destination_id?: string | null;
          destination_type?: string | null;
          error_code?: string | null;
          id?: string;
          operation_id: string;
          run_id: string;
          source_fingerprint: string;
          source_key: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          destination_id?: string | null;
          destination_type?: string | null;
          error_code?: string | null;
          id?: string;
          operation_id?: string;
          run_id?: string;
          source_fingerprint?: string;
          source_key?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "legacy_migration_items_run_id_user_id_fkey";
            columns: ["run_id", "user_id"];
            isOneToOne: false;
            referencedRelation: "legacy_migration_runs";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      legacy_migration_runs: {
        Row: {
          backup_hash: string | null;
          completed_at: string | null;
          created_at: string;
          id: string;
          migration_key: string;
          result_summary: Json;
          source_summary: Json;
          started_at: string | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          backup_hash?: string | null;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          migration_key: string;
          result_summary?: Json;
          source_summary?: Json;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          backup_hash?: string | null;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          migration_key?: string;
          result_summary?: Json;
          source_summary?: Json;
          started_at?: string | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          locale: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          locale?: string;
          timezone?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          locale?: string;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      score_configs: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          rules: Json;
          updated_at: string;
          user_id: string;
          version: number;
          weights: Json;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          rules?: Json;
          updated_at?: string;
          user_id: string;
          version?: number;
          weights: Json;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          rules?: Json;
          updated_at?: string;
          user_id?: string;
          version?: number;
          weights?: Json;
        };
        Relationships: [];
      };
      score_snapshots: {
        Row: {
          components: Json;
          created_at: string;
          formula_version: number;
          id: string;
          occurred_on: string;
          total: number;
          user_id: string;
        };
        Insert: {
          components: Json;
          created_at?: string;
          formula_version: number;
          id?: string;
          occurred_on: string;
          total: number;
          user_id: string;
        };
        Update: {
          components?: Json;
          created_at?: string;
          formula_version?: number;
          id?: string;
          occurred_on?: string;
          total?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      sync_operations: {
        Row: {
          action: string;
          applied_at: string;
          base_revision: number | null;
          device_id: string;
          entity_id: string;
          entity_type: string;
          id: string;
          operation_id: string;
          user_id: string;
        };
        Insert: {
          action: string;
          applied_at?: string;
          base_revision?: number | null;
          device_id: string;
          entity_id: string;
          entity_type: string;
          id?: string;
          operation_id: string;
          user_id: string;
        };
        Update: {
          action?: string;
          applied_at?: string;
          base_revision?: number | null;
          device_id?: string;
          entity_id?: string;
          entity_type?: string;
          id?: string;
          operation_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          created_at: string;
          namespace: string;
          revision: number;
          updated_at: string;
          user_id: string;
          value: Json;
        };
        Insert: {
          created_at?: string;
          namespace: string;
          revision?: number;
          updated_at?: string;
          user_id: string;
          value?: Json;
        };
        Update: {
          created_at?: string;
          namespace?: string;
          revision?: number;
          updated_at?: string;
          user_id?: string;
          value?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
