import { useState } from 'react'
import useCrmStore from '@/stores/useCrmStore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { formatBRL } from '@/lib/utils'
import { MessageCircle, Mail, Phone, ShoppingBag, CreditCard } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Customers() {
  const { customers } = useCrmStore()
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

  const activeCust = customers.find((c) => c.id === selectedCustomer)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Hub de Clientes</h1>
        <p className="text-slate-400">Banco de dados sincronizado com Tiny ERP.</p>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-elevation">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead>Cliente / Empresa</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Segmento (NCM)</TableHead>
              <TableHead className="text-right">Total Gasto</TableHead>
              <TableHead>Status Crédito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow
                key={c.id}
                className="cursor-pointer hover:bg-slate-800/30 border-slate-800 transition-colors"
                onClick={() => setSelectedCustomer(c.id)}
              >
                <TableCell className="font-medium text-slate-200">{c.name}</TableCell>
                <TableCell>
                  <div className="text-sm text-slate-400 flex flex-col gap-1.5">
                    <span className="flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {c.phone}
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail className="w-3 h-3" /> {c.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-950 border-slate-700">
                    {c.ncmSegment}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-emerald-400 font-medium">
                  {formatBRL(c.totalSpent)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      c.creditStatus === 'Aprovado'
                        ? 'default'
                        : c.creditStatus === 'Bloqueado'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className={
                      c.creditStatus === 'Aprovado'
                        ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/50'
                        : c.creditStatus === 'Em Análise'
                          ? 'bg-amber-500/20 text-amber-500 border-amber-500/50 hover:bg-amber-500/30'
                          : ''
                    }
                  >
                    {c.creditStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <SheetContent className="bg-slate-950 border-l-slate-800 w-full sm:max-w-md p-0 flex flex-col shadow-2xl">
          {activeCust && (
            <>
              <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-xl text-slate-100">{activeCust.name}</SheetTitle>
                  <SheetDescription className="text-slate-500">
                    ID ERP: {activeCust.id.toUpperCase()}
                  </SheetDescription>
                </SheetHeader>

                <div className="flex gap-3 mt-6">
                  <a
                    href={`https://wa.me/${activeCust.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 flex-1 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Iniciar WhatsApp
                  </a>
                  <a
                    href={`mailto:${activeCust.email}`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-700 bg-slate-800 hover:bg-slate-700 h-10 w-10 shrink-0"
                  >
                    <Mail className="w-4 h-4 text-slate-300" />
                  </a>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-400" /> Informações Financeiras
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                        <p className="text-xs text-slate-500 mb-2">Status de Crédito</p>
                        <Badge
                          variant={activeCust.creditStatus === 'Aprovado' ? 'default' : 'secondary'}
                          className={
                            activeCust.creditStatus === 'Aprovado'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : ''
                          }
                        >
                          {activeCust.creditStatus}
                        </Badge>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80">
                        <p className="text-xs text-slate-500 mb-1">Lifetime Value</p>
                        <p className="font-mono font-bold text-emerald-400">
                          {formatBRL(activeCust.totalSpent)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" /> Histórico de Pedidos (Tiny
                      ERP)
                    </h3>
                    <div className="space-y-3">
                      {activeCust.orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80 flex items-center justify-between hover:bg-slate-900 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm text-slate-200">{order.id}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm font-bold text-slate-300">
                              {formatBRL(order.amount)}
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1.5 text-[10px] bg-slate-950 text-slate-400 border-slate-700"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {activeCust.orders.length === 0 && (
                        <p className="text-sm text-slate-500 italic">Nenhum pedido encontrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
