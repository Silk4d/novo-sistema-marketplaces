import { useMemo } from 'react'
import useDataStore from '@/stores/useDataStore'
import { calculateKitMetrics } from '@/lib/calculations'
import { formatBRL, formatPercent } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Layers, ArrowRight, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Bundles() {
  const { products, settings } = useDataStore()
  const { toast } = useToast()

  const mockKits = useMemo(() => {
    if (products.length < 4) return []
    return [
      { id: 'k1', p1: products[0], p2: products[1], name: 'Kit Ecossistema Smart' },
      { id: 'k2', p1: products[2], p2: products[3], name: 'Kit Proteção Total' },
      { id: 'k3', p1: products[2], p2: products[4], name: 'Kit Energia Extra' },
    ]
  }, [products])

  const handlePushKit = (kitName: string) => {
    toast({
      title: 'Kit Criado',
      description: `${kitName} foi enviado para o Tiny ERP com sucesso.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <Layers className="w-8 h-8 text-indigo-500" />
          Otimização de Kits (Bundles)
        </h1>
        <p className="text-slate-400">
          Combine produtos para diluir custos fixos e aumentar a margem líquida.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockKits.map((kit) => {
          const metrics = calculateKitMetrics(
            kit.p1,
            kit.p2,
            settings.platforms.shopee,
            settings.taxRate,
            settings.targetMargin,
            'shopee',
          )

          return (
            <Card
              key={kit.id}
              className="bg-slate-900 border-slate-800 shadow-elevation animate-slide-up hover:border-indigo-500/30 transition-colors"
            >
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg text-indigo-400">{kit.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between px-4">
                  <div className="flex flex-col items-center gap-2 w-1/3">
                    <img
                      src={kit.p1.image}
                      alt=""
                      className="w-16 h-16 rounded border border-slate-700 object-cover"
                    />
                    <span className="text-xs text-center text-slate-400 line-clamp-2">
                      {kit.p1.name}
                    </span>
                  </div>
                  <div className="w-1/3 flex justify-center text-slate-500">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-center gap-2 w-1/3">
                    <img
                      src={kit.p2.image}
                      alt=""
                      className="w-16 h-16 rounded border border-slate-700 object-cover"
                    />
                    <span className="text-xs text-center text-slate-400 line-clamp-2">
                      {kit.p2.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800/50">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Preço Sugerido (10% OFF)</p>
                    <p className="text-lg font-mono font-bold text-slate-200">
                      {formatBRL(metrics.kitPrice)}
                    </p>
                    <p className="text-xs text-slate-600 line-through">
                      Soma ind: {formatBRL(metrics.sumIndividualPrices)}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-xs text-slate-500">Aumento de Margem</p>
                    <p className="text-lg font-mono font-bold text-emerald-400">
                      +{formatPercent(metrics.marginIncreasePercent)}
                    </p>
                    <p className="text-xs text-emerald-400/60">
                      Nova Margem: {formatPercent(metrics.kitMarginPercent)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => handlePushKit(kit.name)}
                >
                  <Check className="w-4 h-4 mr-2" /> Push para o Tiny
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
