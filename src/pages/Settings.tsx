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
      description: 'Todas as configurações foram atualizadas com sucesso no banco de dados local.',
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
      setSyncTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    try {
      // Simulating Data Fetch from Tiny ERP with real-world delay
      await new Promise((resolve) => setTimeout(resolve, 3800))

      const syncedTinyData: Array<Partial<Product> & { sku: string }> = [
        {
          sku: 'SMW-01',
          name: 'Smartwatch Pro X (Sincronizado)',
          image: 'https://img.usecurling.com/p/100/100?q=smartwatch&color=blue',
          stock: 154,
        },
        {
          sku: 'EAR-02',
          name: 'Fones Bluetooth TWS V2',
          image: 'https://img.usecurling.com/p/100/100?q=earbuds&color=black',
          stock: 89,
        },
        {
          sku: 'CAS-03',
          name: 'Capa Anti-Impacto iPhone 14/15',
          image: 'https://img.usecurling.com/p/100/100?q=phone%20case&color=red',
          stock: 412,
        },
        {
          sku: 'TNY-NEW1',
          id: 'tiny-new-1',
          name: 'Mousepad Gamer Extra Grande',
          ncm: '3926.90.90',
          cost: 25.0,
          currentPrice: 89.9,
          stock: 120,
          avgDailySales: 8,
          leadTime: 3,
          image: 'https://img.usecurling.com/p/100/100?q=mousepad',
          weight: 0.5,
          dimensions: { height: 1, width: 40, length: 90 },
        },
      ]

      setProducts((prev) => {
        const merged = [...prev]
        syncedTinyData.forEach((np) => {
          const idx = merged.findIndex((p) => p.sku === np.sku)
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...np }
          } else if (np.id) {
            merged.push(np as Product)
          }
        })
        return merged
      })

      updateSettings({
        tinyIntegration: { ...settings.tinyIntegration, lastSync: new Date().toLocaleString() },
      })

      const finalTimeStr = `${Math.floor(syncTime / 60)
        .toString()
        .padStart(2, '0')}:${(syncTime % 60).toString().padStart(2, '0')}s`

      toast({
        title: 'Sincronização Bem-sucedida',
        description: `Produtos e estoque atualizados com sucesso. Tempo total: ${finalTimeStr}. ${syncedTinyData.length} registros sincronizados.`,
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

  const formattedSyncTime = `${Math.floor(syncTime / 60)
    .toString()
    .padStart(2, '0')}:${(syncTime % 60).toString().padStart(2, '0')}s`

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
                className="min-w-[220px]"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sincronizando...{' '}
                    {formattedSyncTime}
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
