import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Smartphone, Tablet, Monitor, Copy, Check, Share2, MessageCircle, Send, Instagram, LogOut, RefreshCw } from 'lucide-react'
import { useDatabase } from '@/hooks/useDatabase'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Banner } from '@/components/cardapio/Banner'
import { BannerAd } from '@/components/cardapio/BannerAd'
import { Logo } from '@/components/cardapio/Logo'
import { CategoryFilter } from '@/components/cardapio/CategoryFilter'
import { ProductList } from '@/components/cardapio/ProductList'
import { Footer } from '@/components/cardapio/Footer'
import { EmptyState } from '@/components/cardapio/EmptyState'
import { Produto } from '@/types/database'
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast'
import { supabase } from '@/lib/supabase'

export default function Preview() {
  const { designSettings, configuracoes, produtos, loading, refreshData } = useDatabase()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [generatingCode, setGeneratingCode] = useState(false)
  const device = useDeviceDetection()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowButton(scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      console.log('🔐 Fazendo logout...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Erro ao fazer logout:', error)
        showError('Erro ao sair. Tente novamente.')
      } else {
        console.log('✅ Logout realizado com sucesso')
        showSuccess('Sessão encerrada com sucesso!')
        navigate('/login')
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao fazer logout:', error)
      showError('Erro ao sair. Tente novamente.')
    }
  }

  // Mostrar loading apenas na primeira carga
  if (loading && !designSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando prévia...</p>
        </div>
      </div>
    )
  }

  const filteredProducts = produtos.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getCardapioUrl = () => {
    if (!designSettings?.codigo) {
      showError('Código da loja não encontrado. Gerando um novo código...')
      generateNewCode()
      return null
    }
    
    // URL formatada: dominio.com/cardapio/CODIGO_5_DIGITOS
    const url = `${window.location.origin}/cardapio/${designSettings.codigo}`
    console.log('🔗 Generated URL:', url)
    return url
  }

  const generateNewCode = async () => {
    if (!user) {
      showError('Usuário não autenticado')
      return
    }

    setGeneratingCode(true)
    const toastId = showLoading('Gerando novo código...')

    try {
      // Forçar refresh dos dados para garantir que temos o código mais recente
      await refreshData()
      
      // Verificar se o código foi gerado
      if (designSettings?.codigo) {
        dismissToast(String(toastId))
        showSuccess(`Código gerado: ${designSettings.codigo}`)
        return
      }

      // Se ainda não tiver código, tentar gerar manualmente
      const { supabaseService } = await import('@/services/supabase')
      const newCode = supabaseService.generateUniqueCode()
      
      const success = await supabaseService.updateDesignSettings(user.id, { codigo: newCode })
      
      if (success) {
        dismissToast(String(toastId))
        showSuccess(`Novo código gerado: ${newCode}`)
        // Forçar refresh dos dados
        await refreshData()
      } else {
        dismissToast(String(toastId))
        showError('Erro ao gerar código. Tente novamente.')
      }
    } catch (error) {
      console.error('❌ Erro ao gerar código:', error)
      dismissToast(String(toastId))
      showError('Erro ao gerar código. Tente novamente.')
    } finally {
      setGeneratingCode(false)
    }
  }

  const copyLink = async () => {
    const url = getCardapioUrl()
    if (!url) return
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      showSuccess('Link copiado com sucesso!')
      setTimeout(() => setCopied(false), 2000)
      setShowShareOptions(false)
    } catch (error) {
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      showSuccess('Link copiado com sucesso!')
      setTimeout(() => setCopied(false), 2000)
      setShowShareOptions(false)
    }
  }

  const shareOnWhatsApp = () => {
    const url = getCardapioUrl()
    if (!url) return
    
    const message = `🍰 Confira nosso cardápio de doces! ${url}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setShowShareOptions(false)
    showSuccess('Abrindo WhatsApp...')
  }

  const shareOnInstagram = () => {
    const url = getCardapioUrl()
    if (!url) return
    
    // Instagram não tem URL direta para compartilhamento, então copiamos o link
    copyLink()
    showSuccess('Link copiado! Cole na sua bio do Instagram 📸')
    setShowShareOptions(false)
  }

  // Função de compartilhamento nativo
  const shareNatively = async () => {
    const url = getCardapioUrl()
    if (!url) return

    try {
      // Verificar se a API de compartilhamento nativo está disponível
      if (navigator.share) {
        await navigator.share({
          title: designSettings?.nome_loja || 'Cardápio Digital',
          text: `🍰 Confira nosso cardápio de doces! ${designSettings?.nome_loja || ''}`,
          url: url
        })
        showSuccess('Compartilhado com sucesso!')
        setShowShareOptions(false)
      } else {
        // Se não tiver suporte, usar o método genérico
        shareOnGeneric()
      }
    } catch (error) {
      console.log('Compartilhamento cancelado ou falhou:', error)
      // Se o usuário cancelar, não mostrar erro
      if (error.name !== 'AbortError') {
        shareOnGeneric()
      }
    }
  }

  const shareOnGeneric = () => {
    const url = getCardapioUrl()
    if (!url) return
    
    // Tentar compartilhamento nativo primeiro
    if (navigator.share) {
      navigator.share({
        title: designSettings?.nome_loja || 'Cardápio Digital',
        text: `🍰 Confira nosso cardápio de doces!`,
        url: url
      }).then(() => {
        showSuccess('Compartilhado com sucesso!')
        setShowShareOptions(false)
      }).catch(() => {
        // Se falhar, copiar link
        copyLink()
      })
    } else {
      // Fallback: copiar link
      copyLink()
    }
  }

  // Obter categorias na ordem que foram cadastradas nos produtos
  const getCategories = () => {
    // Sempre incluir "Todos" primeiro
    const categories = [{ name: 'Todos', icon: '/icons/TODOS.png' }]
    
    // Obter categorias únicas dos produtos na ordem de criação
    const productCategories = Array.from(new Set(produtos.map(p => p.categoria)))
      .filter((cat): cat is string => cat && typeof cat === 'string' && cat.trim() !== '')
      .sort() // Ordenar alfabeticamente
    
    console.log('📋 Categorias dos produtos (ordem alfabética):', productCategories)
    
    // Adicionar categorias na ordem que aparecem nos produtos
    productCategories.forEach(category => {
      // Mapear para ícones conhecidos ou usar emoji padrão
      const iconMap: { [key: string]: string } = {
        'Bolos': '/icons/Bolos.png',
        'Doces': '/icons/Doces.png',
        'Salgados': '/icons/Salgados.png'
      }
      
      categories.push({
        name: category,
        icon: iconMap[category] || '🧁'
      })
    })
    
    console.log('📋 Categorias finais:', categories)
    return categories
  }

  const categories = getCategories()

  // Em desktop, mostrar preview em tela cheia sem opções de dispositivo
  if (device === 'desktop') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#ffffff' }}>
        {/* Botões de ação com z-index alto */}
        <div 
          className={`fixed top-4 right-4 z-[9999] transition-opacity duration-300 flex gap-2 ${
            showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Botão Sair */}
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
            size="sm"
          >
            <LogOut className="w-3 h-3 mr-1" />
            Sair
          </Button>

          {/* Botão Compartilhar */}
          <div className="relative">
            <Button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
              size="sm"
            >
              <Share2 className="w-3 h-3 mr-1" />
              Compartilhar
            </Button>

            {/* Menu de opções de compartilhamento com z-index mais alto */}
            {showShareOptions && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-[200px] z-[10000]">
                <div className="space-y-1">
                  {/* Compartilhamento Nativo (prioridade) */}
                  {navigator.share && (
                    <Button
                      onClick={shareNatively}
                      variant="ghost"
                      className="w-full justify-start text-sm h-8 px-2 hover:bg-blue-50"
                    >
                      <Share2 className="w-4 h-4 mr-2 text-blue-600" />
                      Compartilhar
                    </Button>
                  )}
                  
                  <Button
                    onClick={shareOnWhatsApp}
                    variant="ghost"
                    className="w-full justify-start text-sm h-8 px-2 hover:bg-green-50"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                    WhatsApp
                  </Button>
                  
                  <Button
                    onClick={shareOnInstagram}
                    variant="ghost"
                    className="w-full justify-start text-sm h-8 px-2 hover:bg-pink-50"
                  >
                    <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                    Instagram
                  </Button>
                  
                  <hr className="my-1" />
                  
                  <Button
                    onClick={copyLink}
                    variant="ghost"
                    className="w-full justify-start text-sm h-8 px-2 hover:bg-gray-50"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status do Código */}
        <div className="fixed top-4 left-4 z-[9999]">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Seu código:</span>
              {designSettings?.codigo ? (
                <Badge className="bg-green-100 text-green-800">
                  {designSettings.codigo}
                </Badge>
              ) : (
                <Button
                  onClick={generateNewCode}
                  disabled={generatingCode}
                  size="sm"
                  className="h-6 text-xs"
                >
                  {generatingCode ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Gerar Código
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <Banner 
          borderColor={designSettings?.cor_borda}
          bannerGradient={designSettings?.banner_gradient}
        />
        
        <Logo 
          logoUrl={designSettings?.logo_url}
          borderColor={designSettings?.cor_borda}
          storeName={designSettings?.nome_loja}
          storeDescription={designSettings?.descricao_loja}
          corNome={designSettings?.cor_nome}
          avaliacaoMedia={configuracoes?.avaliacao_media}
        />

        <div className="container mx-auto px-4 py-4">
          {/* Banner Publicitário */}
          {designSettings?.banner1_url && (
            <BannerAd bannerUrl={designSettings.banner1_url} />
          )}
          
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            categoryIcons={designSettings?.category_icons || {}} // Passar os ícones personalizados
          />

          {filteredProducts.length > 0 ? (
            <ProductList 
              produtos={filteredProducts}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              backgroundColor={designSettings?.cor_background || '#ffffff'}
              borderColor={designSettings?.cor_borda || '#ec4899'}
              selectedCategory={selectedCategory}
            />
          ) : (
            <EmptyState />
          )}
        </div>

        <Footer 
          textoRodape={designSettings?.texto_rodape} 
        />
      </div>
    )
  }

  // Em mobile e tablet, mostrar preview em tela cheia sem opções de dispositivo
  return (
    <div className="min-h-screen" style={{ backgroundColor: designSettings?.cor_background || '#ffffff' }}>
      {/* Botões de ação com z-index alto */}
      <div 
        className={`fixed top-4 right-4 z-[9999] transition-opacity duration-300 flex gap-2 ${
          showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Botão Sair */}
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
          size="sm"
        >
          <LogOut className="w-3 h-3 mr-1" />
          Sair
        </Button>

        {/* Botão Compartilhar */}
        <div className="relative">
          <Button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="bg-pink-500 hover:bg-pink-600 text-white shadow-lg px-3 py-1 h-8 text-xs transition-colors"
            size="sm"
          >
            <Share2 className="w-3 h-3 mr-1" />
            Compartilhar
          </Button>

          {/* Menu de opções de compartilhamento com z-index mais alto */}
          {showShareOptions && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-[200px] z-[10000]">
              <div className="space-y-1">
                {/* Compartilhamento Nativo (prioridade) */}
                {navigator.share && (
                  <Button
                    onClick={shareNatively}
                    variant="ghost"
                    className="w-full justify-start text-sm h-8 px-2 hover:bg-blue-50"
                  >
                    <Share2 className="w-4 h-4 mr-2 text-blue-600" />
                    Compartilhar
                  </Button>
                )}
                
                <Button
                  onClick={shareOnWhatsApp}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 px-2 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                  WhatsApp
                </Button>
                
                <Button
                  onClick={shareOnInstagram}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 px-2 hover:bg-pink-50"
                >
                  <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                  Instagram
                </Button>
                
                <hr className="my-1" />
                
                <Button
                  onClick={copyLink}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 px-2 hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status do Código */}
      <div className="fixed top-4 left-4 z-[9999]">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Seu código:</span>
            {designSettings?.codigo ? (
              <Badge className="bg-green-100 text-green-800">
                {designSettings.codigo}
              </Badge>
            ) : (
              <Button
                onClick={generateNewCode}
                disabled={generatingCode}
                size="sm"
                className="h-6 text-xs"
              >
                {generatingCode ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Gerar Código
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Banner 
        borderColor={designSettings?.cor_borda}
        bannerGradient={designSettings?.banner_gradient}
      />
      
      <Logo 
        logoUrl={designSettings?.logo_url}
        borderColor={designSettings?.cor_borda}
        storeName={designSettings?.nome_loja}
        storeDescription={designSettings?.descricao_loja}
        corNome={designSettings?.cor_nome}
        avaliacaoMedia={configuracoes?.avaliacao_media}
      />

      <div className="container mx-auto px-4 py-4">
        {/* Banner Publicitário */}
        {designSettings?.banner1_url && (
          <BannerAd bannerUrl={designSettings.banner1_url} />
        )}
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categoryIcons={designSettings?.category_icons || {}} // Passar os ícones personalizados
        />

        {filteredProducts.length > 0 ? (
          <ProductList 
            produtos={filteredProducts}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            backgroundColor={designSettings?.cor_background || '#ffffff'}
            borderColor={designSettings?.cor_borda || '#ec4899'}
            selectedCategory={selectedCategory}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <Footer 
        textoRodape={designSettings?.texto_rodape} 
      />
    </div>
  )
}