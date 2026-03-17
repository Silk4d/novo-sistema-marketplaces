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
import { Printer, Search, RefreshCw, CheckCircle2 } from 'lucide-react'
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

export default function PendingOrders() {
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
    toast({ title: 'Consultando Tiny ERP...', description: `Buscando etiqueta para ${orderId}` })
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast({ title: 'Enviando para Impressão', description: `Enviando ZPL/PDF para impressora...` })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast({
      title: 'Impressão Concluída',
      description: `Etiqueta de ${orderId} impressa com sucesso!`,
      className: 'bg-emerald-600 text-white border-none',
    })
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, printed: true } : o)))
    setPrintingId(null)
  }

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in">
      <CardHeader className="pb-4 border-b border-slate-800/50">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            Pedidos Pendentes
            <Badge variant="secondary" className="ml-2 bg-indigo-500/20 text-indigo-400">
              {orders.filter((o) => !o.printed).length}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Buscar pedido..."
                className="bg-slate-950 border-slate-800 pl-9 h-9"
              />
            </div>
            <Button
              onClick={fetchOrders}
              disabled={loading}
              variant="outline"
              size="icon"
              className="border-slate-700 bg-slate-800 hover:bg-slate-700 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-950/50 whitespace-nowrap">
            <TableRow className="border-slate-800">
              <TableHead className="pl-6">ID</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status ERP</TableHead>
              <TableHead className="text-right pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Carregando...
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
                  className="border-slate-800 hover:bg-slate-800/30 whitespace-nowrap"
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
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                      >
                        {printingId === order.id ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Printer className="w-4 h-4 mr-2" />
                        )}
                        Imprimir
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
  )
}
