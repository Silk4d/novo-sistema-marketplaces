export type PlatformId = 'shopee' | 'amazon' | 'tiktok'

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

export interface AppSettings {
  taxRate: number
  targetMargin: number
  platforms: Record<PlatformId, PlatformSettings>
}
