import { KpiCards } from '@/components/dashboard/KpiCards'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import useDataStore from '@/stores/useDataStore'
import { calcDaysOfCover } from '@/lib/calculations'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

export default function Index() {
  const { products } = useDataStore()

  const ruptureRisks = [...products]
    .map((p) => ({ ...p, doc: calcDaysOfCover(p.stock, p.avgDailySales) }))
    .sort((a, b) => a.doc - b.doc)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Visão Geral</h1>
        <p className="text-slate-400">
          Análise integrada de inteligência e otimização para marketplaces.
        </p>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>

        <Card
          className="bg-slate-900 border-slate-800 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <CardHeader>
            <CardTitle className="text-lg">Top 5 Riscos de Ruptura</CardTitle>
            <CardDescription className="text-slate-400">
              SKUs próximos de zerar o estoque.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-slate-800/50">
              {ruptureRisks.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-md object-cover border border-slate-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{p.sku}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[120px]">{p.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={p.doc < p.leadTime ? 'destructive' : 'warning'}
                      className="mb-1"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.floor(p.doc)} dias
                    </Badge>
                    <p className="text-xs text-slate-500">LT: {p.leadTime}d</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
