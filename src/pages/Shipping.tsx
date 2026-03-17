import { useState, useEffect } from 'react'
import useDataStore from '@/stores/useDataStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Truck, Printer, Search, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ShippingOrder {
  id: string
  channel: string
  issueDate: string
  status: 'Pronto para Envio' | 'Faturado'
  printed: boolean
}

const mockOrders: ShippingOrder[] = [
  {
    id: 'PED-1001',
    channel: 'Shopee',
    issueDate: '2023-12-01',
    status: 'Faturado',
    printed: false,
  },
  {
    id: 'PED-1002',
    channel: 'Amazon',
    issueDate: '2023-12-02',
    status: 'Pronto para Envio',
    printed: false,
  },
  {
    id: 'PED-1003',
    channel: 'Mercado Livre',
    issueDate: '2023-12-02',
    status: 'Faturado',
    printed: true,
  },
  {
    id: 'PED-1004',
    channel: 'TikTok Shop',
    issueDate: '2023-12-03',
    status: 'Pronto para Envio',
    printed: false,
  },
  { id: 'PED-1005', channel: 'Olist', issueDate: '2023-12-03', status: 'Faturado', printed: false },
]

export default function Shipping() {
  const { settings } = useDataStore()
  const { toast } = useToast()
  const [orders, setOrders] = useState<ShippingOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [printingId, setPrintingId] = useState<string | null>(null)

  const fetchOrders = () => {
    setLoading(true)
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 800)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handlePrint = async (orderId: string) => {
    if (!settings.tinyIntegration.token || !settings.tinyIntegration.integratorId) {
      toast({
        title: 'Tiny ERP Não Configurado',
        description: 'Configure o token do Tiny ERP nas Configurações.',
        variant: 'destructive',
      })
      return
    }

    if (!settings.printNode.apiKey || !settings.printNode.printerId) {
      toast({
        title: 'PrintNode Não Configurado',
        description: 'Configure a API Key e a impressora nas Configurações.',
        variant: 'destructive',
      })
      return
    }

    setPrintingId(orderId)

    // Mock API call to Tiny ERP to obtain the label
    toast({
      title: 'Consultando Tiny ERP...',
      description: `Buscando etiqueta (expedicao/obter) para ${orderId}`,
    })
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock API call to PrintNode to print in background
    toast({
      title: 'Enviando para Impressão',
      description: `Enviando ZPL/PDF para a impressora via PrintNode...`,
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: 'Impressão Concluída',
      description: `Etiqueta de ${orderId} impressa com sucesso via PrintNode!`,
      className: 'bg-emerald-600 text-white border-none',
    })

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, printed: true } : o)))
    setPrintingId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
            <Truck className="w-8 h-8 text-indigo-500" />
            Painel de Expedição
          </h1>
          <p className="text-slate-400">
            Fila de pedidos prontos. Impressão térmica direta sem pop-ups via PrintNode.
          </p>
        </div>
        <Button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar Tiny
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 shadow-elevation">
        <CardHeader className="pb-4 border-b border-slate-800/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              Pedidos Pendentes de Envio
              <Badge variant="secondary" className="ml-2 bg-indigo-500/20 text-indigo-400">
                {orders.filter((o) => !o.printed).length}
              </Badge>
            </CardTitle>
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Buscar pedido..."
                className="bg-slate-950 border-slate-800 pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-950/50">
              <TableRow className="border-slate-800">
                <TableHead className="pl-6">ID do Pedido</TableHead>
                <TableHead>Canal de Venda</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Status ERP</TableHead>
                <TableHead className="text-right pr-6">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Carregando pedidos do Tiny...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhum pedido pendente.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <TableCell className="pl-6 font-medium text-slate-200">{order.id}</TableCell>
                    <TableCell>{order.channel}</TableCell>
                    <TableCell>{order.issueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.status === 'Faturado'
                            ? 'text-amber-500 border-amber-500/50'
                            : 'text-emerald-500 border-emerald-500/50'
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {order.printed ? (
                        <Button
                          disabled
                          variant="outline"
                          className="border-slate-800 text-slate-500 bg-slate-900"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Impresso
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePrint(order.id)}
                          disabled={printingId === order.id}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-900/20"
                        >
                          {printingId === order.id ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Printer className="w-4 h-4 mr-2" />
                          )}
                          Imprimir Agora
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
