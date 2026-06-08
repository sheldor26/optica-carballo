export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          apartment: string | null
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          label: string | null
          number: string
          phone: string | null
          postal_code: string
          province: string
          recipient_name: string
          street: string
          updated_at: string
          user_id: string
        }
        Insert: {
          apartment?: string | null
          city: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          number: string
          phone?: string | null
          postal_code: string
          province: string
          recipient_name: string
          street: string
          updated_at?: string
          user_id: string
        }
        Update: {
          apartment?: string | null
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string | null
          number?: string
          phone?: string | null
          postal_code?: string
          province?: string
          recipient_name?: string
          street?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_argentine: boolean
          logo_url: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_argentine?: boolean
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_argentine?: boolean
          logo_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          auto_filter: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          auto_filter?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          auto_filter?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          brand_name: string | null
          created_at: string
          id: string
          lens_options: Json | null
          line_total_cents: number
          order_id: string
          product_id: string | null
          product_name: string
          product_slug: string
          quantity: number
          unit_price_cents: number
          variant_attributes: Json
          variant_id: string | null
          variant_sku: string
        }
        Insert: {
          brand_name?: string | null
          created_at?: string
          id?: string
          lens_options?: Json | null
          line_total_cents: number
          order_id: string
          product_id?: string | null
          product_name: string
          product_slug: string
          quantity: number
          unit_price_cents: number
          variant_attributes?: Json
          variant_id?: string | null
          variant_sku: string
        }
        Update: {
          brand_name?: string | null
          created_at?: string
          id?: string
          lens_options?: Json | null
          line_total_cents?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_slug?: string
          quantity?: number
          unit_price_cents?: number
          variant_attributes?: Json
          variant_id?: string | null
          variant_sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_dni: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivered_at: string | null
          discount_cents: number
          id: string
          invoice_cae: string | null
          invoice_id: string | null
          invoice_url: string | null
          mp_payment_id: string | null
          mp_preference_id: string | null
          notes: string | null
          order_number: string
          paid_at: string | null
          payment_method: string | null
          payment_status: string | null
          prescription_id: string | null
          prescription_snapshot: Json | null
          shipped_at: string | null
          shipping_address_id: string | null
          shipping_agency_code: string | null
          shipping_agency_name: string | null
          shipping_apartment: string | null
          shipping_cents: number
          shipping_city: string | null
          shipping_cost_cents: number | null
          shipping_country: string | null
          shipping_delivery_type: string | null
          shipping_method: string | null
          shipping_number: string | null
          shipping_phone: string | null
          shipping_postal_code: string | null
          shipping_province: string | null
          shipping_recipient_name: string | null
          shipping_street: string | null
          status: string
          subtotal_cents: number
          total_cents: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_dni?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivered_at?: string | null
          discount_cents?: number
          id?: string
          invoice_cae?: string | null
          invoice_id?: string | null
          invoice_url?: string | null
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          notes?: string | null
          order_number: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          prescription_id?: string | null
          prescription_snapshot?: Json | null
          shipped_at?: string | null
          shipping_address_id?: string | null
          shipping_agency_code?: string | null
          shipping_agency_name?: string | null
          shipping_apartment?: string | null
          shipping_cents?: number
          shipping_city?: string | null
          shipping_cost_cents?: number | null
          shipping_country?: string | null
          shipping_delivery_type?: string | null
          shipping_method?: string | null
          shipping_number?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_province?: string | null
          shipping_recipient_name?: string | null
          shipping_street?: string | null
          status?: string
          subtotal_cents: number
          total_cents: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_dni?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivered_at?: string | null
          discount_cents?: number
          id?: string
          invoice_cae?: string | null
          invoice_id?: string | null
          invoice_url?: string | null
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          notes?: string | null
          order_number?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          prescription_id?: string | null
          prescription_snapshot?: Json | null
          shipped_at?: string | null
          shipping_address_id?: string | null
          shipping_agency_code?: string | null
          shipping_agency_name?: string | null
          shipping_apartment?: string | null
          shipping_cents?: number
          shipping_city?: string | null
          shipping_cost_cents?: number | null
          shipping_country?: string | null
          shipping_delivery_type?: string | null
          shipping_method?: string | null
          shipping_number?: string | null
          shipping_phone?: string | null
          shipping_postal_code?: string | null
          shipping_province?: string | null
          shipping_recipient_name?: string | null
          shipping_street?: string | null
          status?: string
          subtotal_cents?: number
          total_cents?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          doctor_matricula: string | null
          doctor_name: string | null
          expires_at: string | null
          id: string
          image_path: string | null
          is_archived: boolean
          notes: string | null
          od_addition: number | null
          od_axis: number | null
          od_cylinder: number | null
          od_sphere: number | null
          oi_addition: number | null
          oi_axis: number | null
          oi_cylinder: number | null
          oi_sphere: number | null
          patient_name: string | null
          prescribed_at: string | null
          pupillary_distance: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doctor_matricula?: string | null
          doctor_name?: string | null
          expires_at?: string | null
          id?: string
          image_path?: string | null
          is_archived?: boolean
          notes?: string | null
          od_addition?: number | null
          od_axis?: number | null
          od_cylinder?: number | null
          od_sphere?: number | null
          oi_addition?: number | null
          oi_axis?: number | null
          oi_cylinder?: number | null
          oi_sphere?: number | null
          patient_name?: string | null
          prescribed_at?: string | null
          pupillary_distance?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doctor_matricula?: string | null
          doctor_name?: string | null
          expires_at?: string | null
          id?: string
          image_path?: string | null
          is_archived?: boolean
          notes?: string | null
          od_addition?: number | null
          od_axis?: number | null
          od_cylinder?: number | null
          od_sphere?: number | null
          oi_addition?: number | null
          oi_axis?: number | null
          oi_cylinder?: number | null
          oi_sphere?: number | null
          patient_name?: string | null
          prescribed_at?: string | null
          pupillary_distance?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string
          created_at: string
          height: number | null
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string
          updated_at: string
          variant_id: string | null
          width: number | null
        }
        Insert: {
          alt_text: string
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path: string
          updated_at?: string
          variant_id?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string
          updated_at?: string
          variant_id?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          is_active: boolean
          price_cents: number
          product_id: string
          sku: string
          sort_order: number
          stock_qty: number
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          price_cents: number
          product_id: string
          sku: string
          sort_order?: number
          stock_qty?: number
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          price_cents?: number
          product_id?: string
          sku?: string
          sort_order?: number
          stock_qty?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json
          brand_id: string
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          search_vector: unknown
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          attributes?: Json
          brand_id: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          search_vector?: unknown
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          attributes?: Json
          brand_id?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          search_vector?: unknown
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          cuit_cuil: string | null
          display_name: string | null
          dni: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cuit_cuil?: string | null
          display_name?: string | null
          dni?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cuit_cuil?: string | null
          display_name?: string | null
          dni?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      increment_variant_stock: {
        Args: { p_amount: number; p_variant_id: string }
        Returns: undefined
      }
      reserve_stock: { Args: { p_items: Json }; Returns: undefined }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

