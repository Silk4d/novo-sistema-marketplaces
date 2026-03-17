import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import useDataStore from '@/stores/useDataStore'
import { calcTargetPrice } from '@/lib/calculations'

export function PerformanceChart() {
  const { products, settings } = useDataStore()

  const data = useMemo(() => {
    return products.map((p) => ({
      name: p.sku,
      current: p.currentPrice,
      targetShopee: Number(
        calcTargetPrice(
          p.cost,
          settings.platforms.shopee,
          settings.taxRate,
          settings.targetMargin,
        ).toFixed(2),
      ),
      targetAmazon: Number(
        calcTargetPrice(
          p.cost,
          settings.platforms.amazon,
          settings.taxRate,
          settings.targetMargin,
        ).toFixed(2),
      ),
    }))
  }, [products, settings])

  const chartConfig = {
    current: { label: 'Preço Atual (Tiny)', color: 'hsl(var(--muted-foreground))' },
    targetShopee: { label: 'Alvo Shopee', color: 'hsl(25 95% 53%)' }, // Orange-ish
    targetAmazon: { label: 'Alvo Amazon', color: 'hsl(45 93% 47%)' }, // Yellow-ish
  }

  return (
    <Card className="bg-slate-900 border-slate-800 h-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">Performance de Precificação por SKU</CardTitle>
        <CardDescription className="text-slate-400">
          Comparativo entre o preço atual e o ideal para atingir {settings.targetMargin * 100}% de
          margem.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="4 4" />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickFormatter={(value) => `R$${value}`}
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="targetShopee" fill="var(--color-targetShopee)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="targetAmazon" fill="var(--color-targetAmazon)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
