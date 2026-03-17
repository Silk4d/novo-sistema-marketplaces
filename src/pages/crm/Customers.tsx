import { useState } from 'react'
import useCrmStore, { Customer } from '@/stores/useCrmStore'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatBRL, cn } from '@/lib/utils'
import { MessageCircle, Mail, Phone, ShoppingBag, CreditCard, FileText } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Customers() {
  const { customers } = useCrmStore()
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [pdfCustomer, setPdfCustomer] = useState<Customer | null>(null)

  const activeCust = customers.find((c) => c.id === selectedCustomer)

  const getRfmStatus = (c: Customer) => {
    if (c.totalSpent > 100000 && c.orders.length > 1)
      return { label: 'Campeão', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' }
    if (c.orders.length > 1)
      return { label: 'Frequente', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' }
    if (c.creditStatus === 'Bloqueado')
      return { label: 'Em Risco', color: 'bg-rose-500/20 text-rose-500 border-rose-500/30' }
    return { label: 'Fiel', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
  }

  const handleOpenWhatsApp = () => {
    if (pdfCustomer) {
      window.open(`https://wa.me/${pdfCustomer.phone}`, '_blank')
      setPdfCustomer(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Hub de Clientes & RFM</h1>
        <p className="text-slate-400">
          Banco de dados com segmentação automática baseada no histórico Tiny.
        </p>
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 shadow-elevation">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead>Cliente / Empresa</TableHead>
              <TableHead>Segmento (NCM)</TableHead>
              <TableHead>Segmentação RFM</TableHead>
              <TableHead className="text-right">LTV</TableHead>
              <TableHead>Status Crédito</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => {
              const rfm = getRfmStatus(c)
              return (
                <TableRow
                  key={c.id}
                  className="cursor-pointer hover:bg-slate-800/30 border-slate-800 transition-colors"
                  onClick={() => setSelectedCustomer(c.id)}
                >
                  <TableCell>
                    <div className="font-medium text-slate-200">{c.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{c.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-950 border-slate-700 font-normal">
                      {c.ncmSegment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('font-medium', rfm.color)}>
                      {rfm.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-300 font-medium">
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
                          ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'
                          : ''
                      }
                    >
                      {c.creditStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
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
                  <SheetDescription className="text-slate-500 flex items-center justify-between">
                    ID ERP: {activeCust.id.toUpperCase()}
                    <Badge
                      variant="outline"
                      className={cn('text-[10px]', getRfmStatus(activeCust).color)}
                    >
                      {getRfmStatus(activeCust).label}
                    </Badge>
                  </SheetDescription>
                </SheetHeader>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setPdfCustomer(activeCust)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Contato Integrado
                  </Button>
                  <a
                    href={`mailto:${activeCust.email}`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-slate-700 bg-slate-800 hover:bg-slate-700 h-10 w-10 shrink-0 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-slate-300" />
                  </a>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-amber-400" /> Histórico de Pedidos (Tiny
                      ERP)
                    </h3>
                    <div className="space-y-3">
                      {activeCust.orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-slate-900/50 p-4 rounded-lg border border-slate-800/80 flex items-center justify-between"
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
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!pdfCustomer} onOpenChange={(open) => !open && setPdfCustomer(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle>Gerar Cotação e Contatar</DialogTitle>
            <DialogDescription>
              Deseja gerar o PDF com o histórico e catálogo atualizado para {pdfCustomer?.name}{' '}
              antes de abrir o WhatsApp?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg flex flex-col items-center gap-3 w-full max-w-xs">
              <FileText className="w-12 h-12 text-rose-400 opacity-80" />
              <p className="text-sm font-medium text-slate-300">
                Cotacao_{pdfCustomer?.name.replace(/\s/g, '')}.pdf
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPdfCustomer(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleOpenWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Gerar & Abrir WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
