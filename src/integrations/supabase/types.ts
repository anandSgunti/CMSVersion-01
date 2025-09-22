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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          document_id: string
          id: string
          is_resolved: boolean
          parent_id: string | null
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          document_id: string
          id?: string
          is_resolved?: boolean
          parent_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          document_id?: string
          id?: string
          is_resolved?: boolean
          parent_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "v_documents_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_permissions: {
        Row: {
          document_id: string
          granted_at: string
          granted_by: string
          id: string
          role: Database["public"]["Enums"]["doc_role"]
          user_id: string
        }
        Insert: {
          document_id: string
          granted_at?: string
          granted_by: string
          id?: string
          role: Database["public"]["Enums"]["doc_role"]
          user_id: string
        }
        Update: {
          document_id?: string
          granted_at?: string
          granted_by?: string
          id?: string
          role?: Database["public"]["Enums"]["doc_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "v_documents_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_revisions: {
        Row: {
          body: string
          created_at: string
          created_by: string
          document_id: string
          id: string
          summary: string | null
          title: string
          version: number
        }
        Insert: {
          body: string
          created_at?: string
          created_by: string
          document_id: string
          id?: string
          summary?: string | null
          title: string
          version: number
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string
          document_id?: string
          id?: string
          summary?: string | null
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_revisions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_revisions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "v_documents_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          author_id: string
          body: string
          created_at: string
          final_file_id: string | null
          id: string
          is_template: boolean
          project_id: string
          published_at: string | null
          status: Database["public"]["Enums"]["doc_status"]
          template_id: string | null
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          author_id: string
          body?: string
          created_at?: string
          final_file_id?: string | null
          id?: string
          is_template?: boolean
          project_id: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          template_id?: string | null
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          final_file_id?: string | null
          id?: string
          is_template?: boolean
          project_id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["doc_status"]
          template_id?: string | null
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_final_file_id_fkey"
            columns: ["final_file_id"]
            isOneToOne: false
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "v_documents_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          bucket: string
          created_at: string
          created_by: string | null
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
        }
        Insert: {
          bucket: string
          created_at?: string
          created_by?: string | null
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
        }
        Update: {
          bucket?: string
          created_at?: string
          created_by?: string | null
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "files_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          global_role: Database["public"]["Enums"]["global_role"]
          id: string
          last_login: string | null
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          global_role?: Database["public"]["Enums"]["global_role"]
          id: string
          last_login?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          global_role?: Database["public"]["Enums"]["global_role"]
          id?: string
          last_login?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          project_id: string
          role: Database["public"]["Enums"]["project_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          project_id?: string
          role?: Database["public"]["Enums"]["project_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
          "User Name": string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          "User Name"?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
          "User Name"?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_requests: {
        Row: {
          created_at: string
          document_id: string
          due_at: string | null
          id: string
          message: string | null
          re_requested_at: string | null
          requester_id: string
          resubmitted_at: string | null
          reviewer_id: string
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_id: string
          due_at?: string | null
          id?: string
          message?: string | null
          re_requested_at?: string | null
          requester_id: string
          resubmitted_at?: string | null
          reviewer_id: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_id?: string
          due_at?: string | null
          id?: string
          message?: string | null
          re_requested_at?: string | null
          requester_id?: string
          resubmitted_at?: string | null
          reviewer_id?: string
          status?: Database["public"]["Enums"]["review_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "v_documents_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      template_versions: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          template_id: string
          title: string
          version: number
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          template_id: string
          title: string
          version: number
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          template_id?: string
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_versions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "v_documents_meta"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_documents_meta: {
        Row: {
          author_email: string | null
          author_id: string | null
          author_name: string | null
          created_at: string | null
          id: string | null
          is_template: boolean | null
          project_id: string | null
          project_name: string | null
          published_at: string | null
          status: Database["public"]["Enums"]["doc_status"] | null
          template_id: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "v_documents_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      v_project_members: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assigned_by_email: string | null
          assigned_by_name: string | null
          id: string | null
          project_id: string | null
          role: Database["public"]["Enums"]["project_role"] | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_project_overview: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_by_email: string | null
          created_by_name: string | null
          documents_count: number | null
          id: string | null
          in_review_count: number | null
          last_activity_at: string | null
          members_count: number | null
          name: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          templates_count: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_by_email: string | null
          created_by_name: string | null
          description: string | null
          id: string | null
          name: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          docs: number
          in_review: number
          projects: number
          templates: number
          users: number
        }[]
      }
      admin_create_template: {
        Args: { p_body: string; p_project_id: string; p_title: string }
        Returns: string
      }
      admin_documents_overview: {
        Args: {
          p_is_template_filter?: boolean
          p_limit?: number
          p_offset?: number
          p_project_filter?: string
          p_status_filter?: Database["public"]["Enums"]["doc_status"]
        }
        Returns: {
          author_email: string
          author_id: string
          author_name: string
          created_at: string
          id: string
          is_template: boolean
          project_id: string
          project_name: string
          published_at: string
          status: Database["public"]["Enums"]["doc_status"]
          template_id: string
          title: string
          updated_at: string
        }[]
      }
      admin_grant_project_member: {
        Args: {
          p_project_id: string
          p_role: Database["public"]["Enums"]["project_role"]
          p_user_id: string
        }
        Returns: undefined
      }
      admin_projects_overview: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          created_at: string
          created_by: string
          created_by_email: string
          created_by_name: string
          documents_count: number
          id: string
          in_review_count: number
          last_activity_at: string
          members_count: number
          name: string
          status: Database["public"]["Enums"]["project_status"]
          templates_count: number
          updated_at: string
        }[]
      }
      admin_recent_activity: {
        Args: { p_limit?: number; p_offset?: number; p_since?: unknown }
        Returns: {
          actor_email: string
          actor_id: string
          actor_name: string
          document_id: string
          document_title: string
          event_time: string
          event_type: string
          project_id: string
          project_name: string
          summary: string
        }[]
      }
      admin_review_queue: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_project_id?: string
          p_reviewer_id?: string
          p_status?: Database["public"]["Enums"]["review_status"]
        }
        Returns: {
          created_at: string
          document_id: string
          document_title: string
          due_at: string
          message: string
          project_id: string
          project_name: string
          requester_id: string
          requester_name: string
          review_id: string
          reviewer_id: string
          reviewer_name: string
          status: Database["public"]["Enums"]["review_status"]
          updated_at: string
        }[]
      }
      admin_revoke_project_member: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: undefined
      }
      admin_set_user_role: {
        Args: {
          p_role: Database["public"]["Enums"]["global_role"]
          p_user_id: string
        }
        Returns: undefined
      }
      admin_top_projects: {
        Args: { p_limit?: number; p_since?: unknown }
        Returns: {
          activities: number
          documents: number
          last_activity_at: string
          members: number
          project_id: string
          project_name: string
        }[]
      }
      admin_user_list: {
        Args: { p_limit?: number; p_offset?: number; p_search?: string }
        Returns: {
          documents_count: number
          email: string
          global_role: Database["public"]["Enums"]["global_role"]
          last_login: string
          name: string
          projects_count: number
          user_id: string
        }[]
      }
      can_read_document: {
        Args: { p_document_id: string; p_user_id?: string }
        Returns: boolean
      }
      comment_toggle_resolve: {
        Args: { p_resolved: boolean; p_thread_id: string }
        Returns: undefined
      }
      create_document_from_template: {
        Args: { p_project_id: string; p_template_id: string; p_title?: string }
        Returns: string
      }
      document_set_status: {
        Args: {
          p_document_id: string
          p_status: Database["public"]["Enums"]["doc_status"]
        }
        Returns: undefined
      }
      document_update_content: {
        Args: {
          p_body?: string
          p_document_id: string
          p_summary?: string
          p_title?: string
        }
        Returns: undefined
      }
      has_document_permission: {
        Args: {
          p_document_id: string
          p_roles?: Database["public"]["Enums"]["doc_role"][]
          p_user_id?: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_document_owner: {
        Args: { p_document_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_project_admin_or_owner: {
        Args: { p_project_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_project_editor_or_above: {
        Args: { p_project_id: string; p_user_id?: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { p_project_id: string; p_user_id?: string }
        Returns: boolean
      }
      request_review: {
        Args: {
          p_document_id: string
          p_due_at?: string
          p_message?: string
          p_reviewer_id: string
        }
        Returns: string
      }
      review_approve: {
        Args: { p_document_id: string; p_message?: string }
        Returns: undefined
      }
      review_request_changes: {
        Args: { p_document_id: string; p_message?: string }
        Returns: undefined
      }
    }
    Enums: {
      doc_role: "owner" | "editor" | "commenter" | "viewer"
      doc_status:
        | "draft"
        | "in_review"
        | "changes_requested"
        | "approved"
        | "published"
        | "archived"
      global_role: "user" | "admin"
      project_role: "owner" | "admin" | "editor" | "viewer"
      project_status: "active" | "archived"
      review_status:
        | "requested"
        | "in_review"
        | "changes_requested"
        | "approved"
        | "declined"
        | "cancelled"
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
      doc_role: ["owner", "editor", "commenter", "viewer"],
      doc_status: [
        "draft",
        "in_review",
        "changes_requested",
        "approved",
        "published",
        "archived",
      ],
      global_role: ["user", "admin"],
      project_role: ["owner", "admin", "editor", "viewer"],
      project_status: ["active", "archived"],
      review_status: [
        "requested",
        "in_review",
        "changes_requested",
        "approved",
        "declined",
        "cancelled",
      ],
    },
  },
} as const
