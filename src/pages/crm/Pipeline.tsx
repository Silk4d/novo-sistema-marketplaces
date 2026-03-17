import React from 'react'
import useCrmStore from '@/stores/useCrmStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatBRL } from '@/lib/utils'
import { MessageCircle, Clock, Building2, User } from 'lucide-react'

export default function Pipeline() {
  const { stages, leads, moveLead } = useCrmStore()

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('leadId')
    if (leadId) {
      moveLead(leadId, stageId)
    }
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">Pipeline de Vendas</h1>
        <p className="text-slate-400">Gerencie seus leads através do funil comercial.</p>
      </div>

      <div className="flex gap-6 overflow-x-auto flex-1 pb-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stageId === stage.id)
          const totalValue = stageLeads.reduce((acc, l) => acc + l.value, 0)

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-[320px] flex flex-col bg-slate-900/50 rounded-lg border border-slate-800"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 rounded-t-lg">
                <h3 className="font-semibold text-slate-200">{stage.name}</h3>
                <Badge variant="outline" className="font-mono bg-slate-950">
                  {formatBRL(totalValue)}
                </Badge>
              </div>

              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {stageLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className="cursor-grab active:cursor-grabbing bg-slate-950 border-slate-800 hover:border-indigo-500/50 transition-colors shadow-sm animate-fade-in-up"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-200 text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                            <Building2 className="w-3 h-3" />
                            {lead.company}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {formatBRL(lead.value)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-800/50">
                        <div className="flex items-center text-[10px] text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {lead.lastInteraction}
                        </div>
                        <a
                          href={`https://wa.me/${lead.phone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 h-7 px-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Chat
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-center p-4 border border-dashed border-slate-800 rounded-lg text-slate-600 text-xs">
                    Arraste leads para cá
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
