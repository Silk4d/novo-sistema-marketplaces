import { useEffect } from 'react'
import { useProductsStore } from '@/stores/productsStore'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatBRL, cn } from '@/lib/utils'
import { Loader2, RefreshCw } from 'lucide-react'

export default function Products() {
  const { products, status, sync, loadFromDb } = useProductsStore()

  useEffect(() => {
    loadFromDb()
  }, [loadFromDb])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventário de Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catálogo de produtos sincronizado com sua conta do Tiny ERP.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center text-sm font-medium px-4 py-2 bg-muted rounded-md border border-border">
            <span className="text-muted-foreground mr-2">Status:</span>
            <span
              className={cn(
                status.startsWith('✅') && 'text-emerald-500',
                status.startsWith('❌') && 'text-rose-500',
                (status === 'idle' || status === 'syncing...') && 'text-foreground',
              )}
            >
              {status}
            </span>
          </div>
          <Button onClick={sync} disabled={status === 'syncing...'} className="min-w-[200px]">
            {status === 'syncing...' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Testar/Sincronizar Tiny
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[140px] font-semibold">SKU</TableHead>
              <TableHead className="font-semibold">Nome</TableHead>
              <TableHead className="w-[160px] text-right font-semibold">Preço</TableHead>
              <TableHead className="w-[160px] text-right font-semibold">Custo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                  Nenhum produto encontrado no banco de dados. <br className="mb-2" />
                  Clique em Sincronizar para importar dados do Tiny ERP.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.sku} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{p.sku}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatBRL(p.price || 0)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatBRL(p.cost || 0)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
