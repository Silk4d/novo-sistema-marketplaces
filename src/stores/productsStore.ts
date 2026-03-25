import { useSyncExternalStore } from 'react'
import PocketBase from 'pocketbase'
import { fetchProducts } from '@/services/tinyService'
import { getErrorMessage } from '@/lib/pocketbase/errors'

// Lightweight implementation mimicking Zustand's create pattern
// since zustand is not in the project dependencies.
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
  loadFromDb: () => Promise<void>
}

// The store must initialize a PocketBase client using the VITE_PB_URL environment variable
const pbUrl = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090'
const pb = new PocketBase(pbUrl)
pb.autoCancellation(false)

export const useProductsStore = create<Store>((set) => ({
  products: [],
  status: 'idle',
  loadFromDb: async () => {
    try {
      const records = await pb.collection('products').getFullList({ sort: '-updated' })
      set({
        products: records.map((r) => ({
          sku: r.sku,
          name: r.name,
          price: r.price,
          cost: r.cost,
          gtin: r.gtin,
          status: r.status,
        })),
      })
    } catch (error) {
      console.error('Failed to load products from DB:', error)
    }
  },
  sync: async () => {
    set({ status: 'syncing...' })
    try {
      const token = import.meta.env.VITE_TINY_TOKEN || ''
      const tinyProducts = await fetchProducts(token)

      for (const tp of tinyProducts) {
        try {
          // Attempt to update the record using the SKU as the identifier
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
            // If the update operation fails (indicating the product is new), create a new record
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
    } catch (error: unknown) {
      console.error('Sync error:', error)
      set({ status: `❌ Erro: ${getErrorMessage(error)}` })
    }
  },
}))
