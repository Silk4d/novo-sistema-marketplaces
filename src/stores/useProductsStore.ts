import { useSyncExternalStore } from 'react'
import pb from '@/lib/pocketbase/client'
import { fetchProducts } from '@/services/tiny'

type StateCreator<T> = (
  set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void,
  get: () => T,
) => T

// Zustand-like create function implemented internally to respect dependencies constraints
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

export interface ProductRecord {
  id: string
  sku: string
  name: string
  price: number
  cost: number
  gtin: string
  status: string
}

export interface ProductsState {
  products: ProductRecord[]
  status: string
  sync: () => Promise<void>
  loadProducts: () => Promise<void>
}

const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  status: 'idle',
  loadProducts: async () => {
    try {
      const records = await pb.collection('products').getFullList<ProductRecord>()
      set({ products: records })
    } catch (error: any) {
      console.error('Failed to load products:', error)
    }
  },
  sync: async () => {
    set({ status: 'loading' })
    try {
      const token = import.meta.env.VITE_TINY_TOKEN || ''
      const tinyProducts = await fetchProducts(token)
      let count = 0

      for (const tp of tinyProducts) {
        try {
          const existing = await pb
            .collection('products')
            .getFirstListItem<ProductRecord>(`sku="${tp.sku}"`)
          await pb.collection('products').update(existing.id, {
            name: tp.name,
            price: tp.price,
            cost: tp.cost,
            gtin: tp.gtin,
            status: tp.status,
          })
          count++
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
            count++
          } else {
            throw err
          }
        }
      }

      await get().loadProducts()
      set({ status: `OK: ${count} sincronizados` })
    } catch (error: any) {
      set({ status: `Erro: ${error.message || 'Erro desconhecido'}` })
    }
  },
}))

export default useProductsStore
