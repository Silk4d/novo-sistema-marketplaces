import { useState } from 'react'
import useDataStore from '@/stores/useDataStore'
import { PlatformId } from '@/lib/types'
import { calcTargetPrice, calcBreakeven, calcMarginPercent } from '@/lib/calculations'
import { formatBRL, formatPercent, cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export function PricingTable({ platformId }: { platformId: PlatformId }) {
  const { products, settings, updateProduct } = useDataStore()
  const { toast } = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const platformSettings = settings.platforms[platformId]

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? products.map((p) => p.id) : [])
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))
  }

  const handleAdjustBatch = () => {
    selectedIds.forEach((id) => {
      const p = products.find((x) => x.id === id)
      if (p) {
        const target = calcTargetPrice(
          p.cost,
          platformSettings,
          settings.taxRate,
          settings.targetMargin,
          platformId,
        )
        updateProduct(id, { currentPrice: Number(target.toFixed(2)) })
      }
    })
    toast({ title: 'Sucesso', description: `${selectedIds.length} produtos atualizados.` })
    setSelectedIds([])
  }

  return (
    <div className="space-y-4 animate-fade-in mt-4">
      <div className="flex justify-end">
        <Button
          onClick={handleAdjustBatch}
          disabled={selectedIds.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Ajustar Selecionados para Alvo
        </Button>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead className="w-[40px] text-center">
                <Checkbox
                  checked={selectedIds.length === products.length && products.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-slate-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                />
              </TableHead>
              <TableHead className="min-w-[200px]">SKU / Produto</TableHead>
              <TableHead>NCM</TableHead>
              <TableHead className="text-right">Custo Base</TableHead>
              <TableHead className="text-right">Break-even (0%)</TableHead>
              <TableHead className="text-right text-indigo-400 whitespace-nowrap">
                Preço Alvo ({settings.targetMargin * 100}%)
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">Tiny Atual</TableHead>
              <TableHead className="text-right whitespace-nowrap">Status Margem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const target = calcTargetPrice(
                p.cost,
                platformSettings,
                settings.taxRate,
                settings.targetMargin,
                platformId,
              )
              const breakeven = calcBreakeven(
                p.cost,
                platformSettings,
                settings.taxRate,
                platformId,
              )
              const currentMargin = calcMarginPercent(
                p.currentPrice,
                p.cost,
                platformSettings,
                settings.taxRate,
                platformId,
              )
              const isHealthy = currentMargin >= settings.targetMargin

              return (
                <TableRow
                  key={p.id}
                  className="border-slate-800 hover:bg-slate-800/30 transition-colors group"
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(p.id)}
                      onCheckedChange={(c) => handleSelect(p.id, !!c)}
                      className="border-slate-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 opacity-0 group-hover:opacity-100 data-[state=checked]:opacity-100 transition-opacity"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        className="w-10 h-10 rounded bg-slate-800 object-cover shrink-0"
                        alt=""
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-200">{p.sku}</span>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]">
                          {p.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs font-mono">{p.ncm}</TableCell>
                  <TableCell className="text-right text-slate-300 font-mono">
                    {formatBRL(p.cost)}
                  </TableCell>
                  <TableCell className="text-right text-slate-400 font-mono">
                    {formatBRL(breakeven)}
                  </TableCell>
                  <TableCell className="text-right text-indigo-400 font-mono font-medium">
                    {formatBRL(target)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-200">
                    {formatBRL(p.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={isHealthy ? 'outline' : 'destructive'}
                      className={cn(
                        'font-mono whitespace-nowrap',
                        isHealthy && 'text-emerald-400 border-emerald-500/30',
                      )}
                    >
                      {formatPercent(currentMargin)}
                    </Badge>
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
