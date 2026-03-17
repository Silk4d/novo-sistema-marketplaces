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
import { Card, CardContent } from '@/components/ui/card'
import { PackageSearch, AlertTriangle, Layers, TrendingUp } from 'lucide-react'

export default function Inventory() {
  const { products, updateProduct } = useDataStore()

  const globalStock = products.reduce((acc, p) => acc + p.stock, 0)
  const globalVelocity = products.reduce((acc, p) => acc + p.avgDailySales, 0)
  const itemsInRupture = products.filter(
    (p) => calcDaysOfCover(p.stock, p.avgDailySales) < p.leadTime,
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <PackageSearch className="w-8 h-8 text-indigo-500" />
          Estoque e Ruptura Global
        </h1>
        <p className="text-slate-400">
          Monitoramento cross-channel de demanda total vs estoque atualizado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Estoque Total Global</p>
              <p className="text-2xl font-bold text-slate-100">{formatNumber(globalStock)} un.</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Giro Diário (Todos os Canais)</p>
              <p className="text-2xl font-bold text-slate-100">
                {formatNumber(globalVelocity)} un/dia
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">SKUs em Risco (Cross-Channel)</p>
              <p className="text-2xl font-bold text-rose-500">{itemsInRupture} itens</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-elevation animate-fade-in">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Estoque Global</TableHead>
              <TableHead className="text-right">Vendas/Dia Global</TableHead>
              <TableHead className="text-center">Lead Time (Dias)</TableHead>
              <TableHead className="text-right">DoC</TableHead>
              <TableHead>Status Cross-Channel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const doc = calcDaysOfCover(p.stock, p.avgDailySales)
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
                      <div className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md w-max border border-rose-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Alerta Crítico</span>
                      </div>
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
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
