import { showSuccess, showError } from './toast'

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
}

export async function compressImage(
  file: File, 
  options: CompressionOptions = {}
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      try {
        // Calcular novas dimensões mantendo proporção
        const { width, height } = calculateDimensions(
          img.width, 
          img.height, 
          options.maxWidth || 800,
          options.maxHeight || 800
        )

        canvas.width = width
        canvas.height = height

        // Desenhar imagem com alta qualidade
        ctx?.drawImage(img, 0, 0, width, height)

        // Converter para formato desejado com 90% de qualidade
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: `image/${options.format || 'webp'}`,
                lastModified: Date.now()
              })
              
              // Log de compressão
              const originalSize = file.size
              const compressedSize = blob.size
              const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
              
              console.log(`🖼️ Imagem comprimida:`)
              console.log(`   Original: ${(originalSize / 1024).toFixed(2)}KB`)
              console.log(`   Comprimida: ${(compressedSize / 1024).toFixed(2)}KB`)
              console.log(`   Redução: ${reduction}%`)
              console.log(`   Qualidade: ${(options.quality || 0.90) * 100}%`)
              
              resolve(compressedFile)
            } else {
              reject(new Error('Falha na compressão da imagem'))
            }
          },
          `image/${options.format || 'webp'}`,
          options.quality || 0.90  // 90% de qualidade padrão
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Falha ao carregar a imagem'))
    }

    img.src = URL.createObjectURL(file)
  })
}

function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = { width: originalWidth, height: originalHeight }

  // Reduzir apenas se exceder dimensões máximas
  if (width > maxWidth) {
    height = (maxWidth / width) * height
    width = maxWidth
  }

  if (height > maxHeight) {
    width = (maxHeight / height) * width
    height = maxHeight
  }

  return { width: Math.round(width), height: Math.round(height) }
}

// Configurações específicas para 90% de qualidade
export const COMPRESS_CONFIG = {
  // Para fotos de produtos (qualidade excelente)
  product: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.90,        // 90% - qualidade excelente
    format: 'webp' as const
  },
  
  // Para logos (qualidade máxima)
  logo: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.95,        // 95% - para logos precisos
    format: 'webp' as const
  },
  
  // Para banners (qualidade alta)
  banner: {
    maxWidth: 1200,
    maxHeight: 400,
    quality: 0.90,        // 90% - para banners
    format: 'webp' as const
  },
  
  // Para thumbnails (qualidade alta)
  thumbnail: {
    maxWidth: 200,
    maxHeight: 200,
    quality: 0.85,        // 85% - para miniaturas
    format: 'webp' as const
  }
}

// Detectar tipo de imagem baseado no nome
export function detectImageType(file: File, fileName: string): keyof typeof COMPRESS_CONFIG {
  const name = fileName.toLowerCase()
  
  if (name.includes('logo') || name.includes('marca')) return 'logo'
  if (name.includes('banner') || name.includes('capa')) return 'banner'
  if (name.includes('thumb') || name.includes('mini')) return 'thumbnail'
  
  return 'product' // padrão para produtos
}

// Função principal de upload com compressão
export async function compressAndUpload(
  file: File, 
  bucket: string, 
  fileName: string,
  customOptions?: CompressionOptions
): Promise<{ url: string; originalSize: number; compressedSize: number; reduction: number }> {
  try {
    // Detectar tipo de imagem
    const imageType = detectImageType(file, fileName)
    
    // Usar configuração específica ou customizada
    const config = customOptions || COMPRESS_CONFIG[imageType]
    
    // Comprimir imagem com 90% de qualidade
    const compressedFile = await compressImage(file, config)
    
    const originalSize = file.size
    const compressedSize = compressedFile.size
    const reduction = ((originalSize - compressedSize) / originalSize * 100)
    
    return {
      url: '', // Será preenchido após upload
      originalSize,
      compressedSize,
      reduction
    }
  } catch (error) {
    console.error('Erro na compressão:', error)
    throw error
  }
}