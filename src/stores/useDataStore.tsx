import React, { createContext, useContext, useState, ReactNode } from 'react'
import { AppSettings, Product } from '@/lib/types'

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'SMW-01',
    name: 'Smartwatch Pro X',
    ncm: '8517.62.77',
    cost: 120,
    currentPrice: 249.9,
    stock: 45,
    avgDailySales: 3,
    leadTime: 15,
    image: 'https://img.usecurling.com/p/100/100?q=smartwatch',
    weight: 0.3,
    dimensions: { height: 10, width: 10, length: 15 },
  },
  {
    id: '2',
    sku: 'EAR-02',
    name: 'Fones Bluetooth TWS',
    ncm: '8518.30.00',
    cost: 45,
    currentPrice: 99.9,
    stock: 12,
    avgDailySales: 5,
    leadTime: 10,
    image: 'https://img.usecurling.com/p/100/100?q=earbuds',
    weight: 0.15,
    dimensions: { height: 5, width: 10, length: 10 },
  },
  {
    id: '3',
    sku: 'CAS-03',
    name: 'Capa Anti-Impacto iPhone',
    ncm: '3926.90.90',
    cost: 12,
    currentPrice: 39.9,
    stock: 300,
    avgDailySales: 15,
    leadTime: 7,
    image: 'https://img.usecurling.com/p/100/100?q=phone%20case',
    weight: 0.05,
    dimensions: { height: 2, width: 8, length: 16 },
  },
  {
    id: '4',
    sku: 'SCR-04',
    name: 'Película Vidro Temperado',
    ncm: '7007.19.00',
    cost: 5,
    currentPrice: 19.9,
    stock: 50,
    avgDailySales: 10,
    leadTime: 10,
    image: 'https://img.usecurling.com/p/100/100?q=screen%20protector',
    weight: 0.02,
    dimensions: { height: 1, width: 7, length: 15 },
  },
  {
    id: '5',
    sku: 'CHG-05',
    name: 'Carregador Turbo 20W',
    ncm: '8504.40.10',
    cost: 25,
    currentPrice: 79.9,
    stock: 5,
    avgDailySales: 2,
    leadTime: 15,
    image: 'https://img.usecurling.com/p/100/100?q=charger',
    weight: 0.1,
    dimensions: { height: 6, width: 6, length: 8 },
  },
  {
    id: '6',
    sku: 'STD-06',
    name: 'Suporte Articulado Notebook',
    ncm: '7616.99.00',
    cost: 40,
    currentPrice: 110.0,
    stock: 0,
    avgDailySales: 1,
    leadTime: 20,
    image: 'https://img.usecurling.com/p/100/100?q=laptop%20stand',
    weight: 0.8,
    dimensions: { height: 4, width: 25, length: 30 },
  },
]

const INITIAL_SETTINGS: AppSettings = {
  taxRate: 0.04, // 4% Simples Nacional
  targetMargin: 0.2, // 20%
  tinyIntegration: {
    integratorId: '15753',
    token: 'e03db1c0f47be07c80d2a111f5730689a0c97d5c00d61ac1ef284b4',
    lastSync: null,
  },
  printNode: {
    apiKey: '',
    printerId: '',
  },
  shippingGateways: {
    frenet: { active: true, name: 'Frenet' },
    correios: { active: true, name: 'Correios' },
    superfrete: { active: true, name: 'SuperFrete' },
    melhorenvio: { active: true, name: 'Melhor Envio' },
  },
  platforms: {
    shopee: { name: 'Shopee', feeRate: 0.18, fixedFee: 3.0, shippingCost: 0 },
    amazon: { name: 'Amazon', feeRate: 0.15, fixedFee: 0, shippingCost: 5.0 },
    tiktok: { name: 'TikTok Shop', feeRate: 0.12, fixedFee: 2.0, shippingCost: 0 },
    meli_classic: {
      name: 'Mercado Livre Clássico',
      feeRate: 0.11,
      fixedFee: 6.0,
      shippingCost: 20.0,
    },
    meli_premium: {
      name: 'Mercado Livre Premium',
      feeRate: 0.16,
      fixedFee: 6.0,
      shippingCost: 20.0,
    },
    olist: { name: 'Olist', feeRate: 0.19, fixedFee: 5.0, shippingCost: 0 },
    tray: { name: 'Tray', feeRate: 0.02, fixedFee: 1.0, shippingCost: 0 },
  },
}

interface StoreState {
  products: Product[]
  settings: AppSettings
  updateProduct: (id: string, data: Partial<Product>) => void
  updateSettings: (data: Partial<AppSettings>) => void
}

const StoreContext = createContext<StoreState | null>(null)

export const DataStoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS)

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const updateSettings = (data: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }))
  }

  return (
    <StoreContext.Provider value={{ products, settings, updateProduct, updateSettings }}>
      {children}
    </StoreContext.Provider>
  )
}

export default function useDataStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useDataStore must be used within DataStoreProvider')
  return context
}
