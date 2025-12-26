"use client";

import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react'
import { DesignSettings, Configuracoes, Produto } from '@/types/database'

interface CacheData {
  designSettings: DesignSettings | null
  configuracoes: Configuracoes | null
  produtos: Produto[]
  massas: string[]
  recheios: string[]
  coberturas: string[]
  lastUpdated: {
    designSettings: number | null
    configuracoes: number | null
    produtos: number | null
    massas: number | null
    recheios: number | null
    coberturas: number | null
  }
}

interface CacheContextType {
  cache: CacheData
  updateCache: (type: keyof Omit<CacheData, 'lastUpdated'>, data: any) => void
  getCache: (type: keyof Omit<CacheData, 'lastUpdated'>) => any
  isCacheValid: (type: keyof Omit<CacheData, 'lastUpdated'>, maxAge?: number) => boolean
  clearCache: () => void
}

const CacheContext = createContext<CacheContextType | null>(null)

export function CacheProvider({ children }: { children: ReactNode }) {
  const [cache, setCache] = useState<CacheData>({
    designSettings: null,
    configuracoes: null,
    produtos: [],
    massas: [],
    recheios: [],
    coberturas: [],
    lastUpdated: {
      designSettings: null,
      configuracoes: null,
      produtos: null,
      massas: null,
      recheios: null,
      coberturas: null
    }
  })

  const updateCache = useCallback((type: keyof Omit<CacheData, 'lastUpdated'>, data: any) => {
    setCache(prev => ({
      ...prev,
      [type]: data,
      lastUpdated: {
        ...prev.lastUpdated,
        [type]: Date.now()
      }
    }))
  }, [])

  const getCache = useCallback((type: keyof Omit<CacheData, 'lastUpdated'>) => {
    return cache[type]
  }, [cache])

  const isCacheValid = useCallback((type: keyof Omit<CacheData, 'lastUpdated'>, maxAge = 300000) => {
    const lastUpdated = cache.lastUpdated[type]
    if (!lastUpdated) return false
    return Date.now() - lastUpdated < maxAge
  }, [cache])

  const clearCache = useCallback(() => {
    setCache({
      designSettings: null,
      configuracoes: null,
      produtos: [],
      massas: [],
      recheios: [],
      coberturas: [],
      lastUpdated: {
        designSettings: null,
        configuracoes: null,
        produtos: null,
        massas: null,
        recheios: null,
        coberturas: null
      }
    })
  }, [])

  const contextValue = {
    cache,
    updateCache,
    getCache,
    isCacheValid,
    clearCache
  }

  return React.createElement(
    CacheContext.Provider,
    { value: contextValue },
    children
  )
}

export function useCache() {
  const context = useContext(CacheContext)
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider')
  }
  return context
}