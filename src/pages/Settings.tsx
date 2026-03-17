import useDataStore from '@/stores/useDataStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { PlatformId } from '@/lib/types'

export default function Settings() {
  const { settings, updateSettings } = useDataStore()
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: 'Configurações Salvas',
      description: 'Todos os preços foram recalculados automaticamente.',
    })
  }

  const updatePlatform = (id: PlatformId, field: string, value: string) => {
    const num = Number(value) / 100 // Assuming input is percentage
    updateSettings({
      platforms: {
        ...settings.platforms,
        [id]: { ...settings.platforms[id], [field]: field === 'feeRate' ? num : Number(value) },
      },
    })
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-indigo-500" />
          Configurações Globais
        </h1>
        <p className="text-slate-400">
          Ajuste os parâmetros financeiros base para recalcular a precificação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Impostos e Meta</CardTitle>
            <CardDescription>Defina sua tributação e margem desejada padrão.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Imposto (Ex: Simples Nacional %)</Label>
              <Input
                type="number"
                value={settings.taxRate * 100}
                onChange={(e) => updateSettings({ taxRate: Number(e.target.value) / 100 })}
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Margem Alvo de Contribuição (%)</Label>
              <Input
                type="number"
                value={settings.targetMargin * 100}
                onChange={(e) => updateSettings({ targetMargin: Number(e.target.value) / 100 })}
                className="bg-slate-950 border-slate-700"
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
