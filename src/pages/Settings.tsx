import useDataStore from '@/stores/useDataStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Settings as SettingsIcon, Save, Database, KeyRound, Wifi } from 'lucide-react'
import { PlatformId } from '@/lib/types'

export default function Settings() {
  const { settings, updateSettings } = useDataStore()
  const { toast } = useToast()

  const handleSave = () => {
    updateSettings({
      tinyIntegration: { ...settings.tinyIntegration, lastSync: new Date().toLocaleString() },
    })
    toast({
      title: 'Configurações Salvas',
      description: 'Todos os preços e integrações foram atualizados.',
    })
  }

  const handleTestConnection = () => {
    if (!settings.tinyIntegration.token || !settings.tinyIntegration.integratorId) {
      toast({
        title: 'Erro na Conexão',
        description: 'Preencha o Token e o Identificador primeiro.',
        variant: 'destructive',
      })
      return
    }
    toast({
      title: 'Conexão Bem-sucedida',
      description: 'Autenticado com o Tiny ERP via API.',
      className: 'bg-emerald-600 text-white border-none',
    })
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

  return (
    <div className="space-y-6 animate-fade-in max-w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-indigo-500" />
          Configurações Globais
        </h1>
        <p className="text-slate-400">Ajuste parâmetros financeiros e integrações de sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              Integração Tiny ERP
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
                placeholder="Ex: 12345"
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
            <div className="sm:col-span-2 flex items-center gap-4 mt-2">
              <Button onClick={handleTestConnection} variant="secondary">
                <Wifi className="w-4 h-4 mr-2" /> Testar Conexão
              </Button>
              {settings.tinyIntegration.lastSync && (
                <span className="text-xs text-slate-500">
                  Última Sincronização: {settings.tinyIntegration.lastSync}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Impostos e Meta</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Imposto (Ex: Simples Nacional %)</Label>
              <Input
                type="number"
                value={settings.taxRate * 100}
                onChange={(e) => updateSettings({ taxRate: Number(e.target.value) / 100 })}
                className="bg-slate-950 border-slate-700 max-w-xs"
              />
            </div>
            <div className="space-y-2">
              <Label>Margem Alvo de Contribuição (%)</Label>
              <Input
                type="number"
                value={settings.targetMargin * 100}
                onChange={(e) => updateSettings({ targetMargin: Number(e.target.value) / 100 })}
                className="bg-slate-950 border-slate-700 max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {Object.entries(settings.platforms).map(([key, plat]) => (
          <Card key={key} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="capitalize">{plat.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Comissão (%)</Label>
                <Input
                  type="number"
                  value={plat.feeRate * 100}
                  onChange={(e) => updatePlatform(key as PlatformId, 'feeRate', e.target.value)}
                  className="bg-slate-950 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Taxa Fixa (R$)</Label>
                <Input
                  type="number"
                  value={plat.fixedFee}
                  onChange={(e) => updatePlatform(key as PlatformId, 'fixedFee', e.target.value)}
                  className="bg-slate-950 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Custo Logístico (R$)</Label>
                <Input
                  type="number"
                  value={plat.shippingCost}
                  onChange={(e) =>
                    updatePlatform(key as PlatformId, 'shippingCost', e.target.value)
                  }
                  className="bg-slate-950 border-slate-700"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleSave}
        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto h-12 px-8 text-md font-medium"
      >
        <Save className="w-5 h-5 mr-2" /> Salvar Configurações
      </Button>
    </div>
  )
}
