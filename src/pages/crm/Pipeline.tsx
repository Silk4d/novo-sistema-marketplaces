import React, { useState } from 'react'
import useCrmStore, { CrmLead } from '@/stores/useCrmStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatBRL } from '@/lib/utils'
import { MessageCircle, Clock, Building2, User, RefreshCw, FileText } from 'lucide-react'

export default function Pipeline() {
  const { stages, leads, moveLead, syncTinyOrders } = useCrmStore()
  const [pdfLead, setPdfLead] = useState<CrmLead | null>(null)

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

  const handleOpenWhatsApp = () => {
    if (pdfLead) {
      window.open(`https://wa.me/${pdfLead.phone}`, '_blank')
      setPdfLead(null)
    }
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Pipeline de Vendas</h1>
          <p className="text-slate-400">Automação de status integrada com Tiny ERP.</p>
        </div>
        <Button
          onClick={syncTinyOrders}
          variant="outline"
          className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Forçar Automação Tiny
        </Button>
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
                        <button
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 h-7 px-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPdfLead(lead)
                          }}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Chat
                        </button>
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

      <Dialog open={!!pdfLead} onOpenChange={(open) => !open && setPdfLead(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle>Automação de Orçamento via WhatsApp</DialogTitle>
            <DialogDescription>
              Gerar PDF da proposta comercial de {formatBRL(pdfLead?.value || 0)} para{' '}
              {pdfLead?.company}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg flex flex-col items-center gap-3 w-full max-w-xs">
              <FileText className="w-12 h-12 text-emerald-400/80" />
              <p className="text-sm font-medium text-slate-300">
                Proposta_{pdfLead?.company.replace(/\s/g, '')}.pdf
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPdfLead(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleOpenWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Gerar PDF & Iniciar Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
