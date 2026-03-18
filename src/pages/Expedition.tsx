import { useState } from 'react'
import useDataStore from '@/stores/useDataStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Package, Printer, CheckCircle2, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExpeditionOrder {
  id: string
  clientName: string
  channel: string
  items: { sku: string; name: string; qty: number; checked: boolean }[]
  status: 'Pendente' | 'Em Separação' | 'Impresso'
}

const INITIAL_EXPEDITION_ORDERS: ExpeditionOrder[] = [
  {
    id: 'PED-1020',
    clientName: 'Roberto Almeida',
    channel: 'Off-Marketplace',
    status: 'Pendente',
    items: [
      { sku: 'SMW-01', name: 'Smartwatch Pro X', qty: 1, checked: false },
      { sku: 'EAR-02', name: 'Fones Bluetooth TWS', qty: 2, checked: false },
    ],
  },
  {
    id: 'PED-1021',
    clientName: 'Juliana Costa',
    channel: 'Shopee',
    status: 'Pendente',
    items: [{ sku: 'CAS-03', name: 'Capa Anti-Impacto iPhone', qty: 3, checked: false }],
  },
  {
    id: 'PED-1022',
    clientName: 'Marcos Silva',
    channel: 'Mercado Livre',
    status: 'Pendente',
    items: [
      { sku: 'STD-06', name: 'Suporte Articulado Notebook', qty: 1, checked: false },
      { sku: 'CHG-05', name: 'Carregador Turbo 20W', qty: 1, checked: false },
    ],
  },
]

export default function Expedition() {
  const { settings } = useDataStore()
  const { toast } = useToast()
  const [orders, setOrders] = useState<ExpeditionOrder[]>(INITIAL_EXPEDITION_ORDERS)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const [printingId, setPrintingId] = useState<string | null>(null)

  const activeOrder = orders.find((o) => o.id === activeOrderId)

  const handleStartPicking = (id: string) => {
    setActiveOrderId(id)
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === 'Pendente' ? 'Em Separação' : o.status } : o,
      ),
    )
  }

  const toggleItemCheck = (orderId: string, itemIndex: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const newItems = [...o.items]
        newItems[itemIndex].checked = !newItems[itemIndex].checked
        return { ...o, items: newItems }
      }),
    )
  }

  const handlePrintLabel = async (orderId: string) => {
    if (!settings.printNode.apiKey || !settings.printNode.printerId) {
      toast({
        title: 'PrintNode Não Configurado',
        description: 'Configure a API Key e a impressora nas Configurações para impressão direta.',
        variant: 'destructive',
      })
      return
    }

    setPrintingId(orderId)
    toast({ title: 'Preparando Etiqueta', description: 'Buscando ZPL via API...' })

    await new Promise((resolve) => setTimeout(resolve, 800))
    toast({
      title: 'Enviando para PrintNode',
      description: `Imprimindo na impressora ${settings.printNode.printerId}...`,
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: 'Impressão Concluída',
      description: `Etiqueta de ${orderId} enviada com sucesso!`,
      className: 'bg-emerald-600 text-white border-none',
    })

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'Impresso' } : o)))
    setPrintingId(null)
    setActiveOrderId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <Package className="w-8 h-8 text-indigo-500" />
          Painel de Expedição
        </h1>
        <p className="text-slate-400">
          Separação individual de clientes (Picking) e impressão automática via PrintNode.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">Fila de Separação</h2>
          <div className="space-y-3">
            {orders.map((order) => (
              <Card
                key={order.id}
                className={cn(
                  'bg-slate-900 border-slate-800 cursor-pointer transition-colors hover:border-indigo-500/50',
                  activeOrderId === order.id && 'border-indigo-500 bg-indigo-500/5',
                )}
                onClick={() => handleStartPicking(order.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-200">{order.id}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" /> {order.clientName}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px]',
                        order.status === 'Impresso'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : order.status === 'Em Separação'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700',
                      )}
                    >
                      {order.status}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {activeOrder ? (
            <Card className="bg-slate-900 border-slate-800 shadow-elevation animate-slide-up h-full">
              <CardHeader className="border-b border-slate-800/50 pb-4">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-xl text-indigo-400">{activeOrder.id}</CardTitle>
                    <CardDescription className="mt-1 text-slate-300">
                      Cliente: <span className="font-medium">{activeOrder.clientName}</span> |
                      Canal: {activeOrder.channel}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-slate-950">
                    {activeOrder.items.length} SKUs
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
                    Itens do Pedido
                  </h3>
                  <div className="space-y-3">
                    {activeOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-lg border transition-colors',
                          item.checked
                            ? 'bg-emerald-500/5 border-emerald-500/30'
                            : 'bg-slate-950 border-slate-800',
                        )}
                      >
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleItemCheck(activeOrder.id, idx)}
                          className={cn(
                            'w-6 h-6',
                            item.checked
                              ? 'data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500'
                              : '',
                          )}
                        />
                        <div className="flex-1">
                          <p
                            className={cn(
                              'font-medium',
                              item.checked
                                ? 'text-slate-300 line-through opacity-70'
                                : 'text-slate-200',
                            )}
                          >
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-slate-300">x{item.qty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/50 flex justify-end">
                  <Button
                    onClick={() => handlePrintLabel(activeOrder.id)}
                    disabled={
                      printingId === activeOrder.id || !activeOrder.items.every((i) => i.checked)
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 shadow-md"
                  >
                    {printingId === activeOrder.id ? (
                      <Printer className="w-5 h-5 mr-2 animate-bounce" />
                    ) : activeOrder.status === 'Impresso' ? (
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                    ) : (
                      <Printer className="w-5 h-5 mr-2" />
                    )}
                    {activeOrder.status === 'Impresso'
                      ? 'Etiqueta Impressa'
                      : 'Impressão Automática (PrintNode)'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-slate-800 rounded-lg bg-slate-900/50">
              <div className="text-center text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Selecione um pedido na fila para iniciar o picking</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
