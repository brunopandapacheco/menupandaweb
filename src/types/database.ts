export interface User {
  id: string
  email: string
  created_at: string
}

export interface DesignSettings {
  user_id: string
  slug?: string
  logo_url?: string
  nome_confeitaria: string
  cor_borda: string
  cor_background: string
  cor_nome: string
  banner1_url?: string
  banner2_url?: string
  background_topo_color: string
  texto_rodape: string
}

export interface Configuracoes {
  user_id: string
  horario_funcionamento_inicio: string
  horario_funcionamento_fim: string
  telefone: string
  meios_pagamento: string[]
  entrega: boolean
  taxa_entrega: number
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