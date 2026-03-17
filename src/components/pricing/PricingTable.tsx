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
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { RefreshCw, Calculator } from 'lucide-react'

export function PricingTable({ platformId }: { platformId: PlatformId }) {
  const { products, settings, updateProduct } = useDataStore()
  const { toast } = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [simulateShipping, setSimulateShipping] = useState(false)
  const [simulatedFreight, setSimulatedFreight] = useState(15)

  const platformSettings = settings.platforms[platformId]

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? products.map((p) => p.id) : [])
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)))
  }

  const handleAdjustBatch = () => {
    const override = simulateShipping ? simulatedFreight : undefined
    selectedIds.forEach((id) => {
      const p = products.find((x) => x.id === id)
      if (p) {
        const target = calcTargetPrice(
          p.cost,
          platformSettings,
          settings.taxRate,
          settings.targetMargin,
          platformId,
          override,
        )
        updateProduct(id, { currentPrice: Number(target.toFixed(2)) })
      }
    })
    toast({
      title: 'Sucesso',
      description: `${selectedIds.length} produtos atualizados localmente.`,
    })
    setSelectedIds([])
  }

  const handleSyncToTiny = () => {
    toast({
      title: 'Sincronização Iniciada',
      description: `Enviando ${selectedIds.length} preços ideais para o Tiny ERP via API.`,
    })
    setSelectedIds([])
  }

  return (
    <div className="space-y-4 animate-fade-in mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="sim-freight"
              checked={simulateShipping}
              onCheckedChange={setSimulateShipping}
            />
            <Label htmlFor="sim-freight" className="text-slate-300 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-400" /> Simular Frete
            </Label>
          </div>
          {simulateShipping && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">R$</span>
              <Input
                type="number"
                value={simulatedFreight}
                onChange={(e) => setSimulatedFreight(Number(e.target.value))}
                className="w-20 h-8 bg-slate-950 border-slate-700 px-2 text-right"
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={handleSyncToTiny}
            disabled={selectedIds.length === 0}
            variant="outline"
            className="flex-1 sm:flex-none border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Tiny ERP
          </Button>
          <Button
            onClick={handleAdjustBatch}
            disabled={selectedIds.length === 0}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Ajustar Selecionados
          </Button>
        </div>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 overflow-x-auto shadow-elevation">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead className="w-[40px] text-center">
                <Checkbox
                  checked={selectedIds.length === products.length && products.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[200px]">SKU / Produto</TableHead>
              <TableHead className="text-right">Custo Base</TableHead>
              <TableHead className="text-right">Break-even</TableHead>
              <TableHead className="text-right text-indigo-400">Preço Alvo</TableHead>
              <TableHead className="text-right">Preço Atual</TableHead>
              <TableHead className="text-right">Status Margem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const override = simulateShipping ? simulatedFreight : undefined
              const target = calcTargetPrice(
                p.cost,
                platformSettings,
                settings.taxRate,
                settings.targetMargin,
                platformId,
                override,
              )
              const breakeven = calcBreakeven(
                p.cost,
                platformSettings,
                settings.taxRate,
                platformId,
                override,
              )
              const currentMargin = calcMarginPercent(
                p.currentPrice,
                p.cost,
                platformSettings,
                settings.taxRate,
                platformId,
                override,
              )
              const isHealthy = currentMargin >= settings.targetMargin

              return (
                <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/30">
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedIds.includes(p.id)}
                      onCheckedChange={(c) => handleSelect(p.id, !!c)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        className="w-10 h-10 rounded bg-slate-800 object-cover"
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
                        'font-mono',
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
