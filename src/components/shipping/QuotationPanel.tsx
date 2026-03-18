import { useState, useMemo } from 'react'
import useDataStore from '@/stores/useDataStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { Search, Zap, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatBRL, cn } from '@/lib/utils'

interface ShippingQuote {
  id: string
  carrier: string
  service: string
  gateway: string
  basePrice: number
  insurance: number
  netPrice: number
  deliveryDays: number
  reliabilityScore: number
}

export default function QuotationPanel() {
  const { settings } = useDataStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [quotes, setQuotes] = useState<ShippingQuote[]>([])

  const [formData, setFormData] = useState({ cep: '', weight: '', l: '', w: '', h: '' })

  const handleQuote = () => {
    if (!settings.tinyIntegration.token) {
      toast({
        title: 'Aviso',
        description: 'Configure o Token do Tiny ERP para cotações reais.',
        variant: 'destructive',
      })
      return
    }
    if (!formData.cep || !formData.weight) {
      toast({
        title: 'Aviso',
        description: 'Preencha ao menos CEP e Peso.',
        variant: 'destructive',
      })
      return
    }

    const activeGateways = Object.values(settings.shippingGateways)
      .filter((g) => g.active)
      .map((g) => g.name)

    if (activeGateways.length === 0) {
      toast({
        title: 'Sem Gateways Ativos',
        description: 'Ative ao menos um gateway nas Configurações.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      const MOCK_QUOTES: ShippingQuote[] = [
        {
          id: '1',
          carrier: 'Correios',
          service: 'PAC',
          gateway: 'Melhor Envio',
          basePrice: 18.5,
          insurance: 1.5,
          netPrice: 20.0,
          deliveryDays: 7,
          reliabilityScore: 85,
        },
        {
          id: '2',
          carrier: 'Loggi',
          service: 'Express',
          gateway: 'Frenet',
          basePrice: 24.0,
          insurance: 1.0,
          netPrice: 25.0,
          deliveryDays: 4,
          reliabilityScore: 80,
        },
        {
          id: '3',
          carrier: 'Azul Cargo',
          service: 'Amanhã',
          gateway: 'SuperFrete',
          basePrice: 24.5,
          insurance: 1.2,
          netPrice: 25.7,
          deliveryDays: 3,
          reliabilityScore: 95,
        },
        {
          id: '4',
          carrier: 'Jadlog',
          service: '.Com',
          gateway: 'Frenet',
          basePrice: 22.0,
          insurance: 2.0,
          netPrice: 24.0,
          deliveryDays: 6,
          reliabilityScore: 82,
        },
        {
          id: '5',
          carrier: 'Correios',
          service: 'SEDEX',
          gateway: 'Correios',
          basePrice: 35.0,
          insurance: 2.0,
          netPrice: 37.0,
          deliveryDays: 2,
          reliabilityScore: 90,
        },
      ]

      const filteredQuotes = MOCK_QUOTES.filter((q) => activeGateways.includes(q.gateway))
      setQuotes(filteredQuotes)
      setLoading(false)
      toast({
        title: 'Cotação Concluída',
        description: `Gateways consultados: ${activeGateways.join(', ')}`,
      })
    }, 1200)
  }

  const analyzedQuotes = useMemo(() => {
    if (!quotes.length) return []
    const withSlaStatus = quotes.map((q) => ({ ...q, isSlaFail: q.deliveryDays > 5 }))
    const eligible = withSlaStatus.filter((q) => !q.isSlaFail)

    let bestId: string | null = null
    let isArbitrage = false

    if (eligible.length > 0) {
      const sortedByPrice = [...eligible].sort((a, b) => a.netPrice - b.netPrice)
      bestId = sortedByPrice[0].id
    }

    return withSlaStatus
      .map((q) => ({ ...q, isBest: q.id === bestId, isArbitrage }))
      .sort((a, b) => a.netPrice - b.netPrice)
  }, [quotes])

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-slate-900 border-slate-800 shadow-elevation">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-200">Simulador de Frete Multi-Gateway</CardTitle>
          <CardDescription>
            Consulta via expedicao/obter_cotacoes para pedidos Off-Marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>CEP Destino</Label>
              <Input
                placeholder="00000-000"
                className="bg-slate-950 border-slate-700"
                value={formData.cep}
                onChange={(e) => setFormData((p) => ({ ...p, cep: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                placeholder="1.5"
                className="bg-slate-950 border-slate-700"
                value={formData.weight}
                onChange={(e) => setFormData((p) => ({ ...p, weight: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Comp. (cm)</Label>
              <Input
                type="number"
                placeholder="20"
                className="bg-slate-950 border-slate-700"
                value={formData.l}
                onChange={(e) => setFormData((p) => ({ ...p, l: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Larg. (cm)</Label>
              <Input
                type="number"
                placeholder="15"
                className="bg-slate-950 border-slate-700"
                value={formData.w}
                onChange={(e) => setFormData((p) => ({ ...p, w: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Alt. (cm)</Label>
              <Input
                type="number"
                placeholder="10"
                className="bg-slate-950 border-slate-700"
                value={formData.h}
                onChange={(e) => setFormData((p) => ({ ...p, h: e.target.value }))}
              />
            </div>
            <Button
              onClick={handleQuote}
              disabled={loading}
              className="col-span-2 md:col-span-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? (
                <Zap className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}{' '}
              Cotar Auto
            </Button>
          </div>
        </CardContent>
      </Card>

      {analyzedQuotes.length > 0 && (
        <Card className="bg-slate-900 border-slate-800 shadow-elevation animate-slide-up">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-slate-800/50 mb-2">
            <CardTitle className="text-lg">Comparativo de Custos & SLA</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-950/30 whitespace-nowrap">
                <TableRow className="border-slate-800">
                  <TableHead className="pl-6">Transportadora</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead className="text-right">Frete Base</TableHead>
                  <TableHead className="text-right">Seguro</TableHead>
                  <TableHead className="text-right text-indigo-400 font-bold">Preço Net</TableHead>
                  <TableHead className="text-center">Prazo (Dias)</TableHead>
                  <TableHead className="pr-6 text-center">Status (KPI)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyzedQuotes.map((q) => (
                  <TableRow
                    key={q.id}
                    className={cn(
                      'border-slate-800 whitespace-nowrap transition-colors',
                      q.isBest
                        ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                        : 'hover:bg-slate-800/30',
                      q.isSlaFail && 'opacity-60',
                    )}
                  >
                    <TableCell className="pl-6">
                      <p className="font-medium text-slate-200">{q.carrier}</p>
                      <p className="text-xs text-slate-500">{q.service}</p>
                    </TableCell>
                    <TableCell className="text-slate-400">{q.gateway}</TableCell>
                    <TableCell className="text-right font-mono">{formatBRL(q.basePrice)}</TableCell>
                    <TableCell className="text-right font-mono text-slate-500">
                      {formatBRL(q.insurance)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-indigo-400">
                      {formatBRL(q.netPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          'font-medium',
                          q.isSlaFail ? 'text-rose-400' : 'text-slate-300',
                        )}
                      >
                        {q.deliveryDays} d
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-center">
                      {q.isBest ? (
                        <div className="flex flex-col items-center gap-1">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-2 py-0.5">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Melhor Escolha (≤ 5d)
                          </Badge>
                        </div>
                      ) : q.isSlaFail ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="text-rose-500 border-rose-500/30 cursor-help"
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" /> SLA &gt; 5d
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
                            Excede limite de entrega de 5 dias úteis.
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Badge variant="outline" className="text-slate-500 border-slate-700">
                          Disponível
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
