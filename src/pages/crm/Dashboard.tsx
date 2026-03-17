import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatBRL, formatPercent } from '@/lib/utils'
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react'

const performanceData = [
  { month: 'Jul', revenue: 45000, cac: 120 },
  { month: 'Ago', revenue: 52000, cac: 115 },
  { month: 'Set', revenue: 48000, cac: 130 },
  { month: 'Out', revenue: 61000, cac: 110 },
  { month: 'Nov', revenue: 85000, cac: 95 },
  { month: 'Dez', revenue: 115000, cac: 90 },
]

export default function CrmDashboard() {
  const chartConfig = {
    revenue: { label: 'Receita Total', color: 'hsl(142 71% 45%)' }, // emerald-500
    cac: { label: 'CAC (R$)', color: 'hsl(346 87% 60%)' }, // rose-500
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold tracking-tight">Dashboard Comercial</h1>
        <p className="text-slate-400">Acompanhe KPIs de vendas e projeções financeiras.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Receita Mensal (Est.)
            </CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{formatBRL(115000)}</div>
            <p className="text-xs text-emerald-500/70 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +35.2% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">Taxa de Conversão</CardTitle>
            <Activity className="w-4 h-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{formatPercent(0.184)}</div>
            <p className="text-xs text-slate-500 mt-1">Lead para Fechamento</p>
          </CardContent>
        </Card>

        <Card
          className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Custo de Aquisição (CAC)
            </CardTitle>
            <Users className="w-4 h-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">{formatBRL(90)}</div>
            <p className="text-xs text-emerald-500/70 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 rotate-180" /> -5.2% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-400">
              Lifetime Value (LTV)
            </CardTitle>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{formatBRL(4850)}</div>
            <p className="text-xs text-slate-500 mt-1">Média por cliente B2B</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800 animate-fade-in h-full">
          <CardHeader>
            <CardTitle className="text-lg">Evolução de Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig}>
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs font-medium"
                  />
                  <YAxis
                    tickFormatter={(val) => `R$${val / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs font-medium"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="url(#fillRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-slate-900 border-slate-800 animate-fade-in h-full"
          style={{ animationDelay: '150ms' }}
        >
          <CardHeader>
            <CardTitle className="text-lg">Evolução do CAC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig}>
                <BarChart data={performanceData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid
                    vertical={false}
                    stroke="hsl(var(--border))"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs font-medium"
                  />
                  <YAxis
                    tickFormatter={(val) => `R$${val}`}
                    tickLine={false}
                    axisLine={false}
                    className="text-xs font-medium"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="cac" fill="var(--color-cac)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
