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
import { syncTinyProducts, type SyncSummary } from '@/services/tiny'
import pb from '@/lib/pocketbase/client'
import {
  Settings as SettingsIcon,
  Save,
  Database,
  KeyRound,
  Wifi,
  Printer,
  Truck,
  Loader2,
  RefreshCw,
} from 'lucide-react'

export default function Settings() {
  const { settings, updateSettings, setProducts } = useDataStore()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncTime, setSyncTime] = useState(0)
  const [syncSummary, setSyncSummary] = useState<SyncSummary | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    [],
  )

  const handleSave = () => {
    toast({
      title: 'Configurações Salvas',
      description: 'Todas as configurações foram atualizadas com sucesso no banco de dados local.',
    })
  }

  const handleTestConnection = async () => {
    const envToken = import.meta.env.VITE_TINY_TOKEN
    const tokenToUse = envToken || settings.tinyIntegration.token

    if (!tokenToUse) {
      toast({
        title: 'Erro na Conexão',
        description:
          'Token não configurado. Adicione no campo abaixo ou defina VITE_TINY_TOKEN no .env.',
        variant: 'destructive',
      })
      return
    }

    setIsSyncing(true)
    setSyncTime(0)
    setSyncSummary(null)
    const startTime = Date.now()
    timerRef.current = setInterval(() => setSyncTime(Date.now() - startTime), 100)

    try {
      // 1. Trigger robust backend synchronization process
      const summary = await syncTinyProducts(tokenToUse)
      setSyncSummary(summary)

      // 2. Fetch the newly saved data from PocketBase to update frontend cache
      const pbProducts = await pb.collection('products').getFullList()
      setProducts(
        pbProducts.map((p: any) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          ncm: p.ncm || '',
          cost: p.cost || 0,
          currentPrice: p.price || 0,
          stock: p.stock || 0,
          avgDailySales: p.avgDailySales || 0,
          leadTime: p.leadTime || 0,
          image: p.image || 'https://img.usecurling.com/p/100/100?q=product',
          weight: p.weight || 0,
          dimensions: p.dimensions || { height: 0, width: 0, length: 0 },
        })),
      )

      updateSettings({
        tinyIntegration: { ...settings.tinyIntegration, lastSync: new Date().toLocaleString() },
      })

      toast({
        title: 'Sincronização Concluída',
        description: `Processo finalizado via proxy backend em ${((Date.now() - startTime) / 1000).toFixed(1)}s.`,
        className: 'bg-emerald-600 text-white border-none',
      })
    } catch (error: any) {
      toast({
        title: 'Erro na Sincronização',
        description: error.message || 'Falha ao comunicar com o servidor proxy.',
        variant: 'destructive',
      })
    } finally {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsSyncing(false)
    }
  }

  const updateTiny = (field: string, value: string) =>
    updateSettings({ tinyIntegration: { ...settings.tinyIntegration, [field]: value } })
  const updatePrintNode = (field: string, value: string) =>
    updateSettings({ printNode: { ...settings.printNode, [field]: value } })
  const updateGateway = (gatewayKey: string, active: boolean) =>
    updateSettings({
      shippingGateways: {
        ...settings.shippingGateways,
        [gatewayKey]: { ...settings.shippingGateways[gatewayKey], active },
      },
    })

  return (
    <div className="space-y-6 animate-fade-in max-w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-indigo-500" /> Configurações Globais
        </h1>
        <p className="text-slate-400">Ajuste parâmetros financeiros e integrações de sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 md:col-span-2 lg:col-span-3 overflow-hidden">
          <CardHeader className="border-b border-slate-800/50 pb-4 bg-slate-900/50">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" /> Integração Tiny ERP (Sync Engine)
            </CardTitle>
            <CardDescription>
              Integração via Proxy Backend para evitar erros de CORS. Usa Upsert inteligente por
              SKU.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Token API Tiny</Label>
                <div className="relative w-full max-w-sm">
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <Input
                    type="password"
                    value={
                      import.meta.env.VITE_TINY_TOKEN
                        ? '********_ENV_VAR_********'
                        : settings.tinyIntegration.token
                    }
                    disabled={!!import.meta.env.VITE_TINY_TOKEN}
                    onChange={(e) => updateTiny('token', e.target.value)}
                    placeholder="••••••••••••••••"
                    className="bg-slate-950 border-slate-700 pl-9 w-full"
                  />
                </div>
                {import.meta.env.VITE_TINY_TOKEN && (
                  <p className="text-[10px] text-emerald-500/80">
                    Utilizando token seguro via variável de ambiente.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                <Button
                  onClick={handleTestConnection}
                  disabled={isSyncing}
                  className="min-w-[240px] bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processando...{' '}
                      {(syncTime / 1000).toFixed(1)}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" /> Executar Sincronização
                    </>
                  )}
                </Button>
                {settings.tinyIntegration.lastSync && !isSyncing && (
                  <span className="text-xs text-slate-500">
                    Último Sync: {settings.tinyIntegration.lastSync}
                  </span>
                )}
              </div>
            </div>

            {/* Sync Reporting Dashboard Requirement */}
            <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
              {syncSummary ? (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center border-b border-slate-800 pb-2">
                    Painel de Resultados (Sync Reporting)
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center bg-slate-900 p-2 rounded border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-medium mb-1">LIDOS (API)</p>
                      <p className="text-xl font-bold text-indigo-400">{syncSummary.read}</p>
                    </div>
                    <div className="text-center bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                      <p className="text-[10px] text-emerald-500/80 font-medium mb-1">
                        SALVOS/ATUALIZADOS
                      </p>
                      <p className="text-xl font-bold text-emerald-400">{syncSummary.saved}</p>
                    </div>
                    <div className="text-center bg-rose-500/10 p-2 rounded border border-rose-500/20">
                      <p className="text-[10px] text-rose-500/80 font-medium mb-1">
                        PULADOS (SEM SKU)
                      </p>
                      <p className="text-xl font-bold text-rose-400">{syncSummary.skipped}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-600 flex flex-col items-center gap-2">
                  <Database className="w-8 h-8 opacity-20" />
                  <p className="text-sm">Aguardando execução da sincronização...</p>
                </div>
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
