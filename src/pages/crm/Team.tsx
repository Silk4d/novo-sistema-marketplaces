import useCrmStore from '@/stores/useCrmStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { formatBRL } from '@/lib/utils'
import { Target, Users, Mail } from 'lucide-react'

export default function Team() {
  const { team } = useCrmStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Equipe Comercial</h1>
        <p className="text-slate-400">Gerencie representantes, metas e performance individual.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {team.map((rep, index) => {
          const progress = Math.min((rep.totalSales / rep.target) * 100, 100)

          return (
            <Card
              key={rep.id}
              className="bg-slate-900 border-slate-800 shadow-elevation animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-4 border-b border-slate-800/50">
                <Avatar className="w-14 h-14 border border-slate-700 shadow-sm">
                  <AvatarImage src={rep.avatar} />
                  <AvatarFallback className="bg-slate-800 text-slate-300">
                    {rep.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <CardTitle className="text-lg truncate">{rep.name}</CardTitle>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 truncate">
                    <Mail className="w-3 h-3 shrink-0" /> {rep.email}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-400" /> Vendas (Mês)
                    </p>
                    <p className="font-mono font-bold text-slate-200">
                      {formatBRL(rep.totalSales)}
                    </p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> Leads Ativos
                    </p>
                    <p className="font-mono font-bold text-slate-200">{rep.activeLeads}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Progresso da Meta</span>
                    <span className="font-mono font-bold text-indigo-400">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 bg-slate-800/50 [&>div]:bg-indigo-500"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="font-mono">{formatBRL(0)}</span>
                    <span className="font-mono">Meta: {formatBRL(rep.target)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
