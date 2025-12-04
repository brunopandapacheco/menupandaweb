import { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CartItem {
  id: string
  nome: string
  preco_normal: number
  preco_promocional?: number
  promocao: boolean
  forma_venda: string
  quantidade: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  storePhone: string
  storeName: string
}

export function Cart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  storePhone,
  storeName
}: CartProps) {
  const [observacoes, setObservacoes] = useState('')
  const [isSending, setIsSending] = useState(false)

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantidade, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.promocao && item.preco_promocional ? item.preco_promocional : item.preco_normal
      return total + (price * item.quantidade)
    }, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleSendOrder = async () => {
    if (items.length === 0) return

    setIsSending(true)

    try {
      // Formatar mensagem para WhatsApp
      let message = "🛒 *NOVO PEDIDO - " + storeName + "*\n\n"
      message += "📋 *Resumo do Pedido:*\n"
      message += "─".repeat(30) + "\n\n"

      items.forEach((item, index) => {
        const price = item.promocao && item.preco_promocional ? item.preco_promocional : item.preco_normal
        message += (index + 1) + ". *" + item.nome + "*\n"
        message += "   💰 " + formatPrice(price) + " x " + item.quantidade + " " + item.forma_venda + "\n"
        message += "   🧮 Subtotal: " + formatPrice(price * item.quantidade) + "\n\n"
      })

      message += "─".repeat(30) + "\n"
      message += "💳 *Total: " + formatPrice(getTotalPrice()) + "*\n\n"

      if (observacoes.trim()) {
        message += "📝 *Observações:* " + observacoes + "\n\n"
      }

      message += "📅 *Data:* " + new Date().toLocaleDateString('pt-BR') + "\n"
      message += "⏰ *Hora:* " + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + "\n\n"
      message += "Aguardando confirmação! 🎉"

      // Limpar número de telefone (remover caracteres não numéricos)
      const cleanPhone = storePhone.replace(/\D/g, '')
      
      // Criar link do WhatsApp
      const whatsappUrl = "https://wa.me/55" + cleanPhone + "?text=" + encodeURIComponent(message)
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank')
      
      // Limpar carrinho após envio
      onClearCart()
      setObservacoes('')
      onClose()
      
    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id)
    } else if (newQuantity <= 99) {
      onUpdateQuantity(id, newQuantity)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '500px',
        height: '90vh',
        maxHeight: '700px',
        borderRadius: '20px 20px 0 0',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#fef2f2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShoppingCart size={24} />
              Meu Carrinho
              {getTotalItems() > 0 && (
                <Badge style={{
                  backgroundColor: '#ec4899',
                  color: 'white',
                  marginLeft: '8px'
                }}>
                  {getTotalItems()}
                </Badge>
              )}
            </h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              style={{ color: '#6b7280' }}
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af'
            }}>
              <ShoppingCart size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>Seu carrinho está vazio</p>
              <p style={{ fontSize: '14px' }}>Adicione produtos para começar!</p>
            </div>
          ) : (
            <div style={{ gap: '16px' }}>
              {items.map((item) => {
                const price = item.promocao && item.preco_promocional ? item.preco_promocional : item.preco_normal
                const subtotal = price * item.quantidade

                return (
                  <Card key={item.id} style={{ marginBottom: '12px' }}>
                    <CardContent style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '4px',
                            lineHeight: '1.3'
                          }}>
                            {item.nome}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: item.promocao ? '#059669' : '#1f2937'
                            }}>
                              {formatPrice(price)}
                            </span>
                            {item.forma_venda && (
                              <span style={{
                                fontSize: '11px',
                                color: '#6b7280'
                              }}>
                                /{item.forma_venda}
                              </span>
                            )}
                          </div>
                          {item.promocao && item.preco_promocional && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{
                                fontSize: '11px',
                                color: '#9ca3af',
                                textDecoration: 'line-through'
                              }}>
                                {formatPrice(item.preco_normal)}
                              </span>
                              <Badge style={{
                                backgroundColor: '#dc2626',
                                color: 'white',
                                fontSize: '10px',
                                padding: '2px 6px'
                              }}>
                                -{Math.round((1 - item.preco_promocional / item.preco_normal) * 100)}%
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => onRemoveItem(item.id)}
                          variant="ghost"
                          size="icon"
                          style={{ color: '#dc2626', padding: '4px' }}
                        >
                          <X size={16} />
                        </Button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Button
                            onClick={() => handleQuantityUpdate(item.id, item.quantidade - 1)}
                            variant="outline"
                            size="icon"
                            style={{ width: '28px', height: '28px', padding: '0' }}
                          >
                            <Minus size={14} />
                          </Button>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            minWidth: '40px',
                            textAlign: 'center'
                          }}>
                            {item.quantidade}
                          </span>
                          <Button
                            onClick={() => handleQuantityUpdate(item.id, item.quantidade + 1)}
                            variant="outline"
                            size="icon"
                            style={{ width: '28px', height: '28px', padding: '0' }}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#059669'
                        }}>
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Observações */}
        {items.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ marginBottom: '16px' }}>
              <Label htmlFor="observacoes" style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px',
                display: 'block'
              }}>
                Observações (opcional)
              </Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Alguma observação especial para seu pedido?"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                maxLength={500}
              />
              <div style={{
                fontSize: '12px',
                color: '#9ca3af',
                textAlign: 'right',
                marginTop: '4px'
              }}>
                {observacoes.length}/500
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151'
              }}>
                Total:
              </span>
              <span style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#059669'
              }}>
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            
            <Button
              onClick={handleSendOrder}
              disabled={isSending}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#25d366',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSending ? (
                'Enviando...'
              ) : (
                <>
                  <MessageCircle size={20} />
                  Enviar Pedido via WhatsApp
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}