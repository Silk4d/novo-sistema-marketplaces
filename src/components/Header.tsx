import useDataStore from '@/stores/useDataStore'
import useCrmStore from '@/stores/useCrmStore'
import { calcDaysOfCover } from '@/lib/calculations'
import { formatBRL, formatPercent, cn } from '@/lib/utils'
import { AlertCircle, TrendingUp, DollarSign } from 'lucide-react'

export function Header() {
  const { products, settings } = useDataStore()
  const { whatsappConnected } = useCrmStore()

  const totalValue = products.reduce((acc, p) => acc + p.stock * p.cost, 0)

  const criticalAlerts = products.filter((p) => {
    const doc = calcDaysOfCover(p.stock, p.avgDailySales)
    return doc < p.leadTime
  }).length

  const totalRevenue = products.reduce((acc, p) => acc + p.currentPrice * p.stock, 0)
  const totalCost = products.reduce((acc, p) => {
    const shopee = settings.platforms.shopee
    const shipping = shopee.shippingCost * p.stock
    const fixed = shopee.fixedFee * p.stock
    const fees = p.currentPrice * shopee.feeRate * p.stock
    const taxes = p.currentPrice * settings.taxRate * p.stock
    return acc + p.cost * p.stock + shipping + fixed + fees + taxes
  }, 0)

  const avgMargin = totalRevenue > 0 ? (totalRevenue - totalCost) / totalRevenue : 0

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Dashboard Operacional
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-sm bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
          <div
            className={cn(
              'relative flex w-2 h-2 rounded-full',
              whatsappConnected ? 'bg-emerald-500' : 'bg-rose-500',
            )}
          >
            {whatsappConnected && (
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
            )}
          </div>
          <span className="font-medium text-slate-300">
            {whatsappConnected ? 'WhatsApp Ativo' : 'WhatsApp Offline'}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span className="text-muted-foreground">Estoque BRL:</span>
          <span className="font-mono font-medium">{formatBRL(totalValue)}</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span className="text-muted-foreground">Margem Média (Shopee):</span>
          <span className="font-mono font-medium">{formatPercent(avgMargin)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-full border border-rose-500/20">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">{criticalAlerts} Rupturas</span>
          {criticalAlerts > 0 && (
            <span className="relative flex w-2 h-2 ml-1">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-rose-400"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-rose-500"></span>
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
