import { User } from '@supabase/supabase-js'

export interface DesignSettings {
  user_id: string
  slug?: string
  logo_url?: string
  nome_loja: string
  cor_borda: string
  cor_background: string
  cor_nome: string
  background_topo_color: string
  texto_rodape: string
  categorias?: string[]
  descricao_loja?: string
  banner_gradient?: string
  banner1_url?: string
  category_icons?: { [key: string]: string }
}

export interface Configuracoes {
  user_id: string
  telefone: string
  meios_pagamento: string[]
  entrega: boolean
  taxa_entrega: number
  total_pedidos?: number
  avaliacao_media?: number
}

export interface Produto {
  id: string
  user_id: string
  nome: string
  descricao: string
  preco_normal: number
  preco_promocional?: number
  imagem_url?: string
  categoria: string
  forma_venda: string
  disponivel: boolean
  promocao: boolean
  created_at: string
  updated_at: string
}

// Only export User from supabase, the others are already exported as interfaces above
export type { User }