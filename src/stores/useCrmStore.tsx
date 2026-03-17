import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface CrmStage {
  id: string
  name: string
  order: number
}

export interface CrmLead {
  id: string
  name: string
  company: string
  value: number
  stageId: string
  lastInteraction: string
  phone: string
  repId: string
}

export interface TinyOrder {
  id: string
  date: string
  amount: number
  status: 'Pendente' | 'Faturado' | 'Enviado' | 'Entregue'
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalSpent: number
  ncmSegment: string
  creditStatus: 'Aprovado' | 'Bloqueado' | 'Em Análise'
  orders: TinyOrder[]
}

export interface SalesRep {
  id: string
  name: string
  email: string
  avatar: string
  totalSales: number
  activeLeads: number
  target: number
}

interface CrmStoreState {
  stages: CrmStage[]
  leads: CrmLead[]
  customers: Customer[]
  team: SalesRep[]
  whatsappConnected: boolean
  moveLead: (leadId: string, toStageId: string) => void
  toggleWhatsappConnection: () => void
}

const INITIAL_STAGES: CrmStage[] = [
  { id: 's1', name: 'Prospecção', order: 1 },
  { id: 's2', name: 'Qualificação', order: 2 },
  { id: 's3', name: 'Proposta', order: 3 },
  { id: 's4', name: 'Negociação', order: 4 },
  { id: 's5', name: 'Fechado Ganho', order: 5 },
]

const INITIAL_LEADS: CrmLead[] = [
  {
    id: 'l1',
    name: 'Carlos Silva',
    company: 'Tech Soluções',
    value: 15000,
    stageId: 's1',
    lastInteraction: '2 horas atrás',
    phone: '5511999999999',
    repId: 'r1',
  },
  {
    id: 'l2',
    name: 'Ana Souza',
    company: 'Global Imports',
    value: 28000,
    stageId: 's2',
    lastInteraction: '1 dia atrás',
    phone: '5511988888888',
    repId: 'r2',
  },
  {
    id: 'l3',
    name: 'Bruno Costa',
    company: 'Varejo Express',
    value: 9500,
    stageId: 's3',
    lastInteraction: 'Hoje',
    phone: '5511977777777',
    repId: 'r1',
  },
  {
    id: 'l4',
    name: 'Mariana Lima',
    company: 'Mega Shop',
    value: 42000,
    stageId: 's4',
    lastInteraction: '3 horas atrás',
    phone: '5511966666666',
    repId: 'r3',
  },
  {
    id: 'l5',
    name: 'João Santos',
    company: 'Eletrônicos SP',
    value: 12000,
    stageId: 's1',
    lastInteraction: '5 dias atrás',
    phone: '5511955555555',
    repId: 'r2',
  },
]

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Tech Soluções LTDA',
    phone: '5511999999999',
    email: 'compras@techsolucoes.com',
    totalSpent: 145000,
    ncmSegment: '8517.62.77 (Telecom)',
    creditStatus: 'Aprovado',
    orders: [
      { id: 'PED-1001', date: '2023-10-15', amount: 45000, status: 'Entregue' },
      { id: 'PED-1089', date: '2023-11-02', amount: 100000, status: 'Entregue' },
    ],
  },
  {
    id: 'c2',
    name: 'Global Imports S.A.',
    phone: '5511988888888',
    email: 'contato@globalimports.com.br',
    totalSpent: 35000,
    ncmSegment: '8518.30.00 (Áudio)',
    creditStatus: 'Em Análise',
    orders: [{ id: 'PED-1102', date: '2023-11-20', amount: 35000, status: 'Faturado' }],
  },
  {
    id: 'c3',
    name: 'Eletrônicos SP',
    phone: '5511955555555',
    email: 'financeiro@eletronicossp.com.br',
    totalSpent: 12000,
    ncmSegment: '8504.40.10 (Energia)',
    creditStatus: 'Bloqueado',
    orders: [{ id: 'PED-1150', date: '2023-12-05', amount: 12000, status: 'Pendente' }],
  },
]

const INITIAL_TEAM: SalesRep[] = [
  {
    id: 'r1',
    name: 'Fernando Alves',
    email: 'fernando@empresa.com',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    totalSales: 450000,
    activeLeads: 12,
    target: 500000,
  },
  {
    id: 'r2',
    name: 'Luciana Martins',
    email: 'luciana@empresa.com',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
    totalSales: 620000,
    activeLeads: 18,
    target: 600000,
  },
  {
    id: 'r3',
    name: 'Roberto Dias',
    email: 'roberto@empresa.com',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    totalSales: 280000,
    activeLeads: 8,
    target: 400000,
  },
]

const StoreContext = createContext<CrmStoreState | null>(null)

export const CrmStoreProvider = ({ children }: { children: ReactNode }) => {
  const [stages] = useState<CrmStage[]>(INITIAL_STAGES)
  const [leads, setLeads] = useState<CrmLead[]>(INITIAL_LEADS)
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS)
  const [team] = useState<SalesRep[]>(INITIAL_TEAM)
  const [whatsappConnected, setWhatsappConnected] = useState(true)

  const moveLead = (leadId: string, toStageId: string) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stageId: toStageId } : l)))
  }

  const toggleWhatsappConnection = () => {
    setWhatsappConnected((prev) => !prev)
  }

  return (
    <StoreContext.Provider
      value={{
        stages,
        leads,
        customers,
        team,
        whatsappConnected,
        moveLead,
        toggleWhatsappConnection,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export default function useCrmStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useCrmStore must be used within CrmStoreProvider')
  return context
}
