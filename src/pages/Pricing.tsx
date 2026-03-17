import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PricingTable } from '@/components/pricing/PricingTable'
import { Calculator } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export default function Pricing() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
          <Calculator className="w-8 h-8 text-indigo-500" />
          Precificação Dinâmica
        </h1>
        <p className="text-slate-400">
          Calcule e ajuste preços para garantir sua margem de contribuição alvo em cada marketplace.
        </p>
      </div>

      <Tabs defaultValue="shopee" className="w-full">
        <ScrollArea className="w-full max-w-[100vw] pb-3 -mb-3">
          <TabsList className="bg-slate-900 border border-slate-800 mb-6 h-12 p-1 w-max flex">
            <TabsTrigger
              value="shopee"
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all px-6"
            >
              Shopee
            </TabsTrigger>
            <TabsTrigger
              value="amazon"
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900 transition-all px-6"
            >
              Amazon
            </TabsTrigger>
            <TabsTrigger
              value="tiktok"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white transition-all px-6"
            >
              TikTok Shop
            </TabsTrigger>
            <TabsTrigger
              value="meli_classic"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-zinc-900 transition-all px-6"
            >
              MeLi Clássico
            </TabsTrigger>
            <TabsTrigger
              value="meli_premium"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-zinc-900 transition-all px-6"
            >
              MeLi Premium
            </TabsTrigger>
            <TabsTrigger
              value="olist"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all px-6"
            >
              Olist
            </TabsTrigger>
            <TabsTrigger
              value="tray"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all px-6"
            >
              Tray
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>

        <TabsContent value="shopee">
          <PricingTable platformId="shopee" />
        </TabsContent>
        <TabsContent value="amazon">
          <PricingTable platformId="amazon" />
        </TabsContent>
        <TabsContent value="tiktok">
          <PricingTable platformId="tiktok" />
        </TabsContent>
        <TabsContent value="meli_classic">
          <PricingTable platformId="meli_classic" />
        </TabsContent>
        <TabsContent value="meli_premium">
          <PricingTable platformId="meli_premium" />
        </TabsContent>
        <TabsContent value="olist">
          <PricingTable platformId="olist" />
        </TabsContent>
        <TabsContent value="tray">
          <PricingTable platformId="tray" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
