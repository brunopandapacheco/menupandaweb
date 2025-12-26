# Panda Menu - Cardápio Digital para Confeiteiras

Sistema completo para criação de cardápios digitais personalizados para confeiteiras.

## 🚀 Configuração Rápida

### 1. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. No dashboard do seu projeto, vá em **Settings > API**
4. Copie a **URL** e a **anon public key**
5. Execute o SQL do arquivo `supabase-schema.sql` no SQL Editor do Supabase

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# System Configuration (opcional)
VITE_SYSTEM_NAME=Panda Menu
VITE_SYSTEM_SUBTITLE=Cardápio Digital
VITE_SYSTEM_LOGO_URL=
```

### 3. Instalar e Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🌐 Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Nas configurações do projeto Vercel, adicione as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anon do seu projeto Supabase
3. Faça o deploy

## 📱 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Gestão de produtos
- ✅ Personalização de design
- ✅ Cardápio público responsivo
- ✅ Integração com WhatsApp
- ✅ Upload de imagens
- ✅ Sistema de promoções

## 🛠️ Stack

- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Backend + Auth + Storage)
- React Router
- Vite

## 📁 Estrutura

```
src/
├── components/     # Componentes UI
├── hooks/         # Hooks personalizados
├── lib/           # Configurações (Supabase)
├── pages/         # Páginas da aplicação
├── services/      # Serviços de API
├── types/         # Tipos TypeScript
└── utils/         # Utilitários