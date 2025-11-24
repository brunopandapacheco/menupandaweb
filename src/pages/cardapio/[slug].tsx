import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Banner } from '@/components/cardapio/Banner'
import { Logo } from '@/components/cardapio/Logo'
import { StoreInfo } from '@/components/cardapio/StoreInfo'
import { SearchBar } from '@/components/cardapio/SearchBar'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'

interface Produto {
  id: string
  nome: string
  descricao: string
  preco_normal: number
  preco_promocional?: number
  imagem_url?: string
  categoria: string
  forma_venda: string
  disponivel: boolean
  promocao: boolean
}

interface DesignSettings {
  nome_confeitaria: string
  cor_borda: string
  cor_background: string
  cor_nome: string
  background_topo_color: string
  texto_rodape: string
  logo_url?: string
  banner1_url?: string
  banner2_url?: string
}

interface Configuracoes {
  telefone: string
  horario_funcionamento_inicio: string
  horario_funcionamento_fim: string
  meios_pagamento: string[]
  entrega: boolean
  taxa_entrega: number
  em_ferias?: boolean
}

export default function CardapioPublico() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [designSettings, setDesignSettings] = useState<DesignSettings | null>(null)
  const [configuracoes, setConfiguracoes] = useState<Configuracoes | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (slug) {
      loadData()
    }
  }, [slug])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Buscar design settings pelo slug
      const { data: designData, error: designError } = await supabase
        .from('design_settings')
        .select('*')
        .eq('slug', slug)
        .single()

      if (designError || !designData) {
        console.error('Design settings não encontrados:', designError)
        setLoading(false)
        return
      }

      // Buscar configurações do usuário
      const { data: configData, error: configError } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('user_id', designData.user_id)
        .single()

      if (configError) {
        console.error('Erro ao buscar configurações:', configError)
      }

      // Buscar produtos do usuário
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .eq('user_id', designData.user_id)
        .eq('disponivel', true)
        .order('created_at', { ascending: false })

      if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError)
      }

      setDesignSettings(designData)
      setConfiguracoes(configData)
      setProdutos(produtosData || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleWhatsAppOrder = (productName: string) => {
    const message = `Olá! Gostaria de fazer um pedido de: ${productName}`
    const phoneNumber = configuracoes?.telefone?.replace(/\D/g, '') || '11999999999'
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const filteredProducts = produtos.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (!designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cardápio não encontrado</h1>
          <p className="text-gray-600 mb-4">Esta confeitaria não existe ou está indisponível.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <div style={{ maxWidth: '448px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
        <Banner logoUrl={designSettings.logo_url} borderColor={designSettings.cor_borda} />
        <Logo logoUrl={designSettings.logo_url} borderColor={designSettings.cor_borda} />
        
        <div style={{ padding: '0 16px 16px', backgroundColor: '#FFFFFF' }}>
          <StoreInfo
            nomeConfeitaria={designSettings.nome_confeitaria}
            corNome={designSettings.cor_nome}
            telefone={configuracoes?.telefone || '(11) 99999-9999'}
            horarioFuncionamentoInicio={configuracoes?.horario_funcionamento_inicio || '08:00'}
            horarioFuncionamentoFim={configuracoes?.horario_funcionamento_fim || '18:00'}
            meiosPagamento={configuracoes?.meios_pagamento || ['Pix', 'Cardão', 'Dinheiro']}
            entrega={configuracoes?.entrega ?? true}
            taxaEntrega={configuracoes?.taxa_entrega || 0}
            emFerias={configuracoes?.em_ferias}
          />

          {/* Banner promocional */}
          {designSettings.banner1_url && (
            <div style={{ marginBottom: '24px', height: '160px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <img 
                src={designSettings.banner1_url} 
                alt="Banner promocional"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          {filteredProducts.length > 0 ? (
            <ProductList
              produtos={filteredProducts}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onOrder={handleWhatsAppOrder}
              backgroundColor={designSettings.cor_background}
              borderColor={designSettings.cor_borda}
            />
          ) : (
            <EmptyState />
          )}

          <Footer textoRodape={designSettings.texto_rodape} />
        </div>
      </div>
    </div>
  )
}