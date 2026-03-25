import { useProductsStore } from '@/stores/productsStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, RefreshCw, Settings2 } from 'lucide-react'

export default function Settings() {
  const { sync, status } = useProductsStore()
  const { toast } = useToast()

  const handleSync = async () => {
    try {
      await sync()
      toast({
        title: 'Sincronização concluída',
        description: 'Os produtos foram sincronizados com sucesso a partir do Tiny ERP.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro na sincronização',
        description: error?.message || 'Ocorreu um erro ao tentar sincronizar.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Settings2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Integração Tiny ERP</CardTitle>
            <CardDescription>
              Sincronize o catálogo e atualize as informações do seu negócio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md text-sm border flex flex-col gap-1">
              <span className="text-muted-foreground font-medium">Status da última operação:</span>
              <span className="font-semibold">
                {status === 'idle' ? 'Aguardando primeira sincronização' : status}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSync}
                disabled={status === 'loading'}
                className="w-full sm:w-auto"
              >
                {status === 'loading' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {status === 'loading' ? 'Sincronizando...' : 'Sincronizar Agora'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                A sincronização pode levar alguns segundos dependendo do tamanho do seu catálogo no
                Tiny.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
