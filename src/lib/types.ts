export type PlatformId =
  | 'shopee'
  | 'amazon'
  | 'tiktok'
  | 'meli_classic'
  | 'meli_premium'
  | 'olist'
  | 'tray'

export interface Product {
  id: string
  sku: string
  name: string
  image: string
  ncm: string
  cost: number
  currentPrice: number
  stock: number
  avgDailySales: number
  leadTime: number
}

export interface PlatformSettings {
  name: string
  feeRate: number
  fixedFee: number
  shippingCost: number
}

export interface TinyIntegration {
  integratorId: string
  token: string
  lastSync: string | null
}

export interface PrintNodeSettings {
  apiKey: string
  printerId: string
}

export interface AppSettings {
  taxRate: number
  targetMargin: number
  platforms: Record<PlatformId, PlatformSettings>
  tinyIntegration: TinyIntegration
  printNode: PrintNodeSettings
}

export type RfmSegment = 'Campeão' | 'Frequente' | 'Em Risco' | 'Fiel' | 'Novo'
