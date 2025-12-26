-- Schema para o Panda Menu
-- Execute este SQL no seu novo projeto Supabase

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de configurações de design
CREATE TABLE IF NOT EXISTS design_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE,
  logo_url TEXT,
  nome_confeitaria TEXT NOT NULL DEFAULT 'Minha Confeitaria',
  cor_borda TEXT DEFAULT '#ec4899',
  cor_background TEXT DEFAULT '#fef2f2',
  cor_nome TEXT DEFAULT '#be185d',
  banner1_url TEXT,
  banner2_url TEXT,
  background_topo_color TEXT DEFAULT '#fce7f3',
  texto_rodape TEXT DEFAULT 'Faça seu pedido! 📞 (11) 99999-9999',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações gerais
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  horario_funcionamento_inicio TEXT DEFAULT '08:00',
  horario_funcionamento_fim TEXT DEFAULT '18:00',
  telefone TEXT DEFAULT '(11) 99999-9999',
  meios_pagamento TEXT[] DEFAULT ARRAY['Pix', 'Cartão', 'Dinheiro'],
  entrega BOOLEAN DEFAULT true,
  taxa_entrega DECIMAL(10,2) DEFAULT 5.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_normal DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),
  imagem_url TEXT,
  categoria TEXT NOT NULL,
  forma_venda TEXT NOT NULL,
  disponivel BOOLEAN DEFAULT true,
  promocao BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança (RLS)
ALTER TABLE design_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Políticas para design_settings
CREATE POLICY "Users can view own design settings" ON design_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own design settings" ON design_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own design settings" ON design_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para configuracoes
CREATE POLICY "Users can view own configuracoes" ON configuracoes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configuracoes" ON configuracoes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configuracoes" ON configuracoes
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para produtos
CREATE POLICY "Users can view own produtos" ON produtos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own produtos" ON produtos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own produtos" ON produtos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own produtos" ON produtos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas públicas para cardápio (leitura pública)
CREATE POLICY "Public can view design settings by slug" ON design_settings
  FOR SELECT USING (slug IS NOT NULL);

CREATE POLICY "Public can view available produtos" ON produtos
  FOR SELECT USING (disponivel = true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_design_settings_slug ON design_settings(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_user_id ON produtos(user_id);
CREATE INDEX IF NOT EXISTS idx_produtos_disponivel ON produtos(disponivel);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_design_settings_updated_at BEFORE UPDATE ON design_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();