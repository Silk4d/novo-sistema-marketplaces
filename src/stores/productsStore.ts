import { useSyncExternalStore } from 'react'
import pb from '@/lib/pocketbase/client'
import { fetchProducts } from '@/services/tinyService'

type StateCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T,
) => T

function create<T>(createState: StateCreator<T>) {
  let state: T
  const listeners = new Set<() => void>()

  const set = (partial: Partial<T> | ((state: T) => Partial<T>)) => {
    const nextState = typeof partial === 'function' ? (partial as any)(state) : partial
    if (nextState !== state) {
      state = Object.assign({}, state, nextState)
      listeners.forEach((l) => l())
    }
  }

  const get = () => state
  state = createState(set, get)

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return function useStore<U = T>(selector?: (state: T) => U): U {
    const slice = useSyncExternalStore(subscribe, get)
    return selector ? selector(slice) : (slice as unknown as U)
  }
}

export interface Product {
  sku: string
  name: string
  price: number
  cost: number
  gtin: string
  status: string
}

export interface Store {
  products: Product[]
  status: string
  sync: () => Promise<void>
}

export const useProductsStore = create<Store>((set) => ({
  products: [],
  status: 'idle',
  sync: async () => {
    set({ status: 'syncing...' })
    try {
      const token = import.meta.env.VITE_TINY_TOKEN || ''
      const tinyProducts = await fetchProducts(token)

      for (const tp of tinyProducts) {
        try {
          const existing = await pb.collection('products').getFirstListItem(`sku="${tp.sku}"`)

          await pb.collection('products').update(existing.id, {
            name: tp.name,
            price: tp.price,
            cost: tp.cost,
            gtin: tp.gtin,
            status: tp.status,
          })
        } catch (err: any) {
          if (err.status === 404) {
            await pb.collection('products').create({
              sku: tp.sku,
              name: tp.name,
              price: tp.price,
              cost: tp.cost,
              gtin: tp.gtin,
              status: tp.status,
            })
          } else {
            throw err
          }
        }
      }

      set({
        products: tinyProducts,
        status: `✅ ${tinyProducts.length} sincronizados`,
      })
    } catch (error: any) {
      console.error('Sync error:', error)
      set({ status: `❌ Erro: ${error.message || 'Erro desconhecido'}` })
    }
  },
}))
