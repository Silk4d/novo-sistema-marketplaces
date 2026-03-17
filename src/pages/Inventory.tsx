import useDataStore from '@/stores/useDataStore'
import { calcDaysOfCover } from '@/lib/calculations'
import { formatNumber, cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PackageSearch } from 'lucide-react'

export default function Inventory() {
  const { products, updateProduct } = useDataStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <PackageSearch className="w-8 h-8 text-indigo-500" />
          Estoque e Ruptura
        </h1>
        <p className="text-slate-400">
          Analise os Dias de Cobertura (DoC) e planeje reposições baseadas no giro de vendas.
        </p>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-elevation animate-fade-in">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Estoque Atual</TableHead>
              <TableHead className="text-right">Vendas/Dia</TableHead>
              <TableHead className="text-center">Lead Time (Dias)</TableHead>
              <TableHead className="text-right">DoC</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Sugestão (60d)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const doc = calcDaysOfCover(p.stock, p.avgDailySales)
              const orderQty = Math.max(0, Math.ceil(60 * p.avgDailySales - p.stock))

              const isCritical = doc < p.leadTime
              const isWarning = doc >= p.leadTime && doc < p.leadTime * 1.5

              const docPercent = Math.min((doc / 60) * 100, 100)

              return (
                <TableRow
                  key={p.id}
                  className="border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.image} className="w-8 h-8 rounded object-cover" alt="" />
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200">{p.sku}</span>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                          {p.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-200">
                    {formatNumber(p.stock)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-400">
                    {formatNumber(p.avgDailySales)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Input
                      type="number"
                      min="1"
                      className="w-20 mx-auto text-center h-8 bg-slate-950 border-slate-700"
                      value={p.leadTime}
                      onChange={(e) =>
                        updateProduct(p.id, { leadTime: Number(e.target.value) || 1 })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right min-w-[120px]">
                    <div className="flex flex-col gap-1 items-end">
                      <span className="font-mono text-sm">{formatNumber(Math.floor(doc))}</span>
                      <div className="w-full max-w-[80px] bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full transition-all',
                            isCritical
                              ? 'bg-rose-500'
                              : isWarning
                                ? 'bg-amber-500'
                                : 'bg-emerald-500',
                          )}
                          style={{ width: `${docPercent}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isCritical ? (
                      <Badge
                        variant="destructive"
                        className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 border-rose-500/50"
                      >
                        Crítico
                      </Badge>
                    ) : isWarning ? (
                      <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                        Atenção
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-emerald-500 border-emerald-500/50">
                        Saudável
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'font-mono font-bold',
                        orderQty > 0 ? 'text-indigo-400' : 'text-slate-500',
                      )}
                    >
                      +{formatNumber(orderQty)}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
