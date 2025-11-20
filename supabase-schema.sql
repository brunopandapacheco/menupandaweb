-- Criar as tabelas necessárias para o sistema de cardápio digital

-- Tabela de configurações de design
CREATE TABLE IF NOT EXISTS design_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_confeitaria VARCHAR(255) NOT NULL DEFAULT 'Doces da Vovó',
  cor_borda VARCHAR(7) DEFAULT '#ec4899',
  cor_background VARCHAR(7) DEFAULT '#fef2f2',
  cor_nome VARCHAR(7) DEFAULT '#be185d',
  background_topo_color VARCHAR(7) DEFAULT '#fce7f3',
  texto_rodape TEXT DEFAULT 'Faça seu pedido! 📞 (11) 99999-9999',
  logo_url TEXT,
  banner1_url TEXT,
  banner2_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de configurações gerais
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  horario_funcionamento_inicio TIME DEFAULT '08:00',
  horario_funcionamento_fim TIME DEFAULT '18:00',
  telefone VARCHAR(20) DEFAULT '(11) 99999-9999',
  meios_pagamento TEXT[] DEFAULT ARRAY['Pix', 'Cartão de Crédito', 'Dinheiro'],
  entrega BOOLEAN DEFAULT true,
  taxa_entrega DECIMAL(10,2) DEFAULT 5.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco_normal DECIMAL(10,2) NOT NULL,
  preco_promocional DECIMAL(10,2),
  imagem_url TEXT,
  categoria VARCHAR(100) NOT NULL,
  forma_venda VARCHAR(100) NOT NULL,
  disponivel BOOLEAN DEFAULT true,
  promocao BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_produtos_user_id ON produtos(user_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_disponivel ON produtos(disponivel);
CREATE INDEX IF NOT EXISTS idx_produtos_promocao ON produtos(promocao);

-- Criar políticas de segurança (Row Level Security)
-- Habilitar RLS nas tabelas
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

CREATE POLICY "Users can delete own design settings" ON design_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para configuracoes
CREATE POLICY "Users can view own configuracoes" ON configuracoes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configuracoes" ON configuracoes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configuracoes" ON configuracoes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configuracoes" ON configuracoes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para produtos
CREATE POLICY "Users can view own produtos" ON produtos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own produtos" ON produtos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own produtos" ON produtos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own produtos" ON produtos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para acesso público ao cardápio (somente leitura)
CREATE POLICY "Public can view available produtos" ON produtos
  FOR SELECT USING (disponivel = true);

CREATE POLICY "Public can view design settings" ON design_settings
  FOR SELECT USING (true);

CREATE POLICY "Public can view configuracoes" ON configuracoes
  FOR SELECT USING (true);

-- Criar trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas
CREATE TRIGGER update_design_settings_updated_at BEFORE UPDATE ON design_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();