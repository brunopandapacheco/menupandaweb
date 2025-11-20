import { supabase } from '@/lib/supabase'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

// Design Settings
export async function getDesignSettings(userId: string): Promise<DesignSettings | null> {
  const { data, error } = await supabase
    .from('design_settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar configurações de design:', error)
    return null
  }

  return data
}

export async function updateDesignSettings(userId: string, settings: Partial<DesignSettings>): Promise<boolean> {
  const { error } = await supabase
    .from('design_settings')
    .upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Erro ao atualizar configurações de design:', error)
    return false
  }

  return true
}

// Configurações
export async function getConfiguracoes(userId: string): Promise<Configuracoes | null> {
  const { data, error } = await supabase
    .from('configuracoes')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Erro ao buscar configurações:', error)
    return null
  }

  return data
}

export async function updateConfiguracoes(userId: string, config: Partial<Configuracoes>): Promise<boolean> {
  const { error } = await supabase
    .from('configuracoes')
    .upsert({
      user_id: userId,
      ...config,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Erro ao atualizar configurações:', error)
    return false
  }

  return true
}

// Produtos
export async function getProdutos(userId: string): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }

  return data || []
}

export async function createProduto(userId: string, produto: Omit<Produto, 'id' | 'user_id' | 'created_at'>): Promise<Produto | null> {
  const { data, error } = await supabase
    .from('produtos')
    .insert({
      user_id: userId,
      ...produto,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar produto:', error)
    return null
  }

  return data
}

export async function updateProduto(id: string, produto: Partial<Produto>): Promise<boolean> {
  const { error } = await supabase
    .from('produtos')
    .update({
      ...produto,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Erro ao atualizar produto:', error)
    return false
  }

  return true
}

export async function deleteProduto(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir produto:', error)
    return false
  }

  return true
}

// Upload de imagens
export async function uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}

export async function deleteImage(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Erro ao excluir imagem:', error)
    return false
  }

  return true
}