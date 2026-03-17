import { Truck } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PendingOrders from '@/components/shipping/PendingOrders'
import QuotationPanel from '@/components/shipping/QuotationPanel'

export default function Shipping() {
  return (
    <div className="space-y-6 animate-fade-in max-w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <Truck className="w-8 h-8 text-indigo-500" />
          Logística e Expedição
        </h1>
        <p className="text-slate-400">
          Gerencie envios pendentes e simule cotações com arbitragem inteligente via Tiny ERP.
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <div className="overflow-x-auto pb-2 -mb-2">
          <TabsList className="bg-slate-900 border border-slate-800 mb-6 flex w-max h-11 p-1">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 transition-all"
            >
              Fila de Pedidos ERP
            </TabsTrigger>
            <TabsTrigger
              value="quotation"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 transition-all"
            >
              Cotação Avulsa (Gateways)
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="mt-0">
          <PendingOrders />
        </TabsContent>

        <TabsContent value="quotation" className="mt-0">
          <QuotationPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
