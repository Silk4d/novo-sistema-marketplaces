import { useEffect } from 'react'
import useProductsStore from '@/stores/useProductsStore'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatBRL } from '@/lib/utils'

export default function Products() {
  const { products, status, sync, loadProducts } = useProductsStore()

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <div className="p-6">
      <div className="flex gap-4 items-center mb-6">
        <Button onClick={sync}>Testar/Sincronizar Tiny</Button>
        <span className="text-sm font-medium text-slate-400">{status}</span>
      </div>

      <div className="border border-slate-800 rounded-md bg-slate-900 shadow-sm overflow-hidden animate-fade-in">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead>SKU</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Custo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                  Nenhum produto encontrado. Clique em Sincronizar para importar dados do Tiny ERP.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow
                  key={p.id}
                  className="border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <TableCell className="font-medium text-slate-200">{p.sku}</TableCell>
                  <TableCell className="text-slate-300">{p.name}</TableCell>
                  <TableCell className="text-slate-300">{formatBRL(p.price)}</TableCell>
                  <TableCell className="text-slate-300">{formatBRL(p.cost)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
