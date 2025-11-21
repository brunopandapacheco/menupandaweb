import { User, DesignSettings, Configuracoes, Produto } from './database'

export type { User, DesignSettings, Configuracoes, Produto }

export type AuthMode = 'login' | 'register' | 'reset'
export type DeviceType = 'mobile' | 'tablet' | 'desktop'