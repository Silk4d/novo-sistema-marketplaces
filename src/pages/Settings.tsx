import { useState, useEffect, useRef } from 'react'
import useDataStore from '@/stores/useDataStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  Settings as SettingsIcon,
  Save,
  Database,
  KeyRound,
  Wifi,
  Printer,
  Truck,
  Loader2,
} from 'lucide-react'
import { PlatformId, Product } from '@/lib/types'

export default function Settings() {
  const { settings, updateSettings, setProducts } = useDataStore()
  const { toast } = useToast()

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncTime, setSyncTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleSave = () => {
    toast({
      title: 'Configurações Salvas',
      description: 'Todas as configurações foram atualizadas com sucesso.',
    })
  }

  const handleTestConnection = async () => {
    if (!settings.tinyIntegration.token || !settings.tinyIntegration.integratorId) {
      toast({
        title: 'Erro na Conexão',
        description: 'Preencha o Token e o Identificador primeiro.',
        variant: 'destructive',
      })
      return
    }

    setIsSyncing(true)
    setSyncTime(0)

    const startTime = Date.now()
    timerRef.current = setInterval(() => {
      setSyncTime((Date.now() - startTime) / 1000)
    }, 100)

    try {
      // Simulating Data Fetch from Tiny ERP
      await new Promise((resolve) => setTimeout(resolve, 3400))

      const newProducts: Product[] = [
        {
          id: 'tiny-1',
          sku: 'TNY-01',
          name: 'Teclado Mecânico RGB',
          ncm: '8471.60.52',
          cost: 150.0,
          currentPrice: 350.0,
          stock: 25,
          avgDailySales: 2,
          leadTime: 5,
          image: 'https://img.usecurling.com/p/100/100?q=keyboard',
          weight: 1.2,
          dimensions: { height: 5, width: 15, length: 45 },
        },
        {
          id: 'tiny-2',
          sku: 'TNY-02',
          name: 'Mouse Gamer 10000DPI',
          ncm: '8471.60.53',
          cost: 80.0,
          currentPrice: 199.9,
          stock: 50,
          avgDailySales: 5,
          leadTime: 3,
          image: 'https://img.usecurling.com/p/100/100?q=mouse',
          weight: 0.3,
          dimensions: { height: 4, width: 8, length: 12 },
        },
      ]

      setProducts((prev) => {
        const merged = [...prev]
        newProducts.forEach((np) => {
          const idx = merged.findIndex((p) => p.sku === np.sku)
          if (idx >= 0) merged[idx] = { ...merged[idx], ...np }
          else merged.push(np)
        })
        return merged
      })

      updateSettings({
        tinyIntegration: { ...settings.tinyIntegration, lastSync: new Date().toLocaleString() },
      })

      const finalTime = ((Date.now() - startTime) / 1000).toFixed(1)
      toast({
        title: 'Sincronização Bem-sucedida',
        description: `Conexão e sincronização concluídas em ${finalTime}s.`,
        className: 'bg-emerald-600 text-white border-none',
      })
    } catch (error) {
      toast({
        title: 'Erro na Sincronização',
        description: 'Não foi possível conectar ao Tiny ERP.',
        variant: 'destructive',
      })
    } finally {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsSyncing(false)
    }
  }

  const updatePlatform = (id: PlatformId, field: string, value: string) => {
    const num = Number(value) / 100
    updateSettings({
      platforms: {
        ...settings.platforms,
        [id]: { ...settings.platforms[id], [field]: field === 'feeRate' ? num : Number(value) },
      },
    })
  }

  const updateTiny = (field: string, value: string) => {
    updateSettings({
      tinyIntegration: { ...settings.tinyIntegration, [field]: value },
    })
  }

  const updatePrintNode = (field: string, value: string) => {
    updateSettings({
      printNode: { ...settings.printNode, [field]: value },
    })
  }

  const updateGateway = (gatewayKey: string, active: boolean) => {
    updateSettings({
      shippingGateways: {
        ...settings.shippingGateways,
        [gatewayKey]: { ...settings.shippingGateways[gatewayKey], active },
      },
    })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-indigo-500" /> Configurações Globais
        </h1>
        <p className="text-slate-400">Ajuste parâmetros financeiros e integrações de sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> Integração Tiny ERP
            </CardTitle>
            <CardDescription>
              Configure o acesso à API para sincronização bi-direcional.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Identificador do Integrador</Label>
              <Input
                value={settings.tinyIntegration.integratorId}
                onChange={(e) => updateTiny('integratorId', e.target.value)}
                placeholder="Ex: 15753"
                className="bg-slate-950 border-slate-700 max-w-xs"
              />
            </div>
            <div className="space-y-2">
              <Label>Token API Tiny</Label>
              <div className="relative max-w-xs">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  type="password"
                  value={settings.tinyIntegration.token}
                  onChange={(e) => updateTiny('token', e.target.value)}
                  placeholder="••••••••••••••••"
                  className="bg-slate-950 border-slate-700 pl-9"
                />
              </div>
            </div>
            <div className="sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <Button
                onClick={handleTestConnection}
                variant="secondary"
                disabled={isSyncing}
                className="min-w-[180px]"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sincronizando...{' '}
                    {syncTime.toFixed(1)}s
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 mr-2" /> Testar conexão
                  </>
                )}
              </Button>
              {settings.tinyIntegration.lastSync && !isSyncing && (
                <span className="text-xs text-slate-500">
                  Última Sincronização: {settings.tinyIntegration.lastSync}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-400" /> Gateways de Frete
            </CardTitle>
            <CardDescription>
              Ative ou desative gateways para as cotações automáticas.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(settings.shippingGateways).map(([key, gateway]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-950"
              >
                <Label className="font-medium cursor-pointer" htmlFor={`gateway-${key}`}>
                  {gateway.name}
                </Label>
                <Switch
                  id={`gateway-${key}`}
                  checked={gateway.active}
                  onCheckedChange={(checked) => updateGateway(key, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-400" /> PrintNode
            </CardTitle>
            <CardDescription>
              Envio direto de etiquetas para impressoras térmicas locais.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>PrintNode API Key</Label>
              <div className="relative max-w-xs">
                <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  type="password"
                  value={settings.printNode.apiKey}
                  onChange={(e) => updatePrintNode('apiKey', e.target.value)}
                  placeholder="••••••••••••••••"
                  className="bg-slate-950 border-slate-700 pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Impressora Térmica Padrão</Label>
              <Select
                value={settings.printNode.printerId}
                onValueChange={(val) => updatePrintNode('printerId', val)}
              >
                <SelectTrigger className="w-full max-w-xs bg-slate-950 border-slate-700">
                  <SelectValue placeholder="Selecione a impressora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="69283">Zebra GC420t (Estoque)</SelectItem>
                  <SelectItem value="69284">Elgin L42 Pro (Expedição)</SelectItem>
                  <SelectItem value="69285">Brother QL-800 (Escritório)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleSave}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto h-12 px-8 text-md font-medium mt-6"
      >
        <Save className="w-5 h-5 mr-2" /> Salvar Configurações
      </Button>
    </div>
  )
}
