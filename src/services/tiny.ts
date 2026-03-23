import pb from '@/lib/pocketbase/client'

export interface SyncSummary {
  read: number
  saved: number
  skipped: number
}

export const syncTinyProducts = async (token: string): Promise<SyncSummary> => {
  return await pb.send('/backend/v1/tiny-sync', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export interface TinyProduct {
  sku: string
  name: string
  price: number
  cost: number
  gtin: string
  status: string
}

export const fetchProducts = async (token: string): Promise<TinyProduct[]> => {
  // Simulating the retrieval of products from Tiny ERP
  return [
    {
      sku: 'SMW-01',
      name: 'Smartwatch Pro X (Sincronizado)',
      price: 269.9,
      cost: 115,
      gtin: '1234567890123',
      status: 'A',
    },
    {
      sku: 'EAR-02',
      name: 'Fones Bluetooth TWS (Sincronizado)',
      price: 89.9,
      cost: 40,
      gtin: '1234567890124',
      status: 'A',
    },
    {
      sku: 'CAS-03',
      name: 'Capa Anti-Impacto iPhone (Sincronizado)',
      price: 45.0,
      cost: 15,
      gtin: '1234567890125',
      status: 'A',
    },
  ]
}
