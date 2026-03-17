import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, AlertTriangle, PieChart, Coins } from 'lucide-react'
import useDataStore from '@/stores/useDataStore'
import { formatBRL, formatPercent } from '@/lib/utils'
import { calcDaysOfCover } from '@/lib/calculations'

export function KpiCards() {
  const { products, settings } = useDataStore()

  const totalSkus = products.length
  const criticalStock = products.filter(
    (p) => calcDaysOfCover(p.stock, p.avgDailySales) < p.leadTime,
  ).length

  // Calculate average margin simply for KPIs
  const avgMargin =
    products.reduce((acc, p) => {
      const pPrice = p.currentPrice || 1
      const net =
        pPrice - p.cost - pPrice * settings.platforms.shopee.feeRate - pPrice * settings.taxRate
      return acc + net / pPrice
    }, 0) / (totalSkus || 1)

  const revenuePotential = products.reduce((acc, p) => acc + p.stock * p.currentPrice, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-400">Total de SKUs Ativos</CardTitle>
          <Package className="w-4 h-4 text-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-100">{totalSkus}</div>
          <p className="text-xs text-slate-500 mt-1">Sincronizados via Tiny ERP</p>
        </CardContent>
      </Card>

      <Card
        className="bg-slate-900 border-rose-900/50 shadow-elevation animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-400">
            Risco Crítico (Ruptura)
          </CardTitle>
          <AlertTriangle className="w-4 h-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-500">{criticalStock}</div>
          <p className="text-xs text-rose-500/70 mt-1">Abaixo do Lead Time</p>
        </CardContent>
      </Card>

      <Card
        className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-400">Margem Média Global</CardTitle>
          <PieChart className="w-4 h-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400">{formatPercent(avgMargin)}</div>
          <p className="text-xs text-slate-500 mt-1">
            Meta definida: {formatPercent(settings.targetMargin)}
          </p>
        </CardContent>
      </Card>

      <Card
        className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
        style={{ animationDelay: '300ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-slate-400">Potencial de Receita</CardTitle>
          <Coins className="w-4 h-4 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-100">{formatBRL(revenuePotential)}</div>
          <p className="text-xs text-slate-500 mt-1">Baseado no estoque atual</p>
        </CardContent>
      </Card>
    </div>
  )
}
