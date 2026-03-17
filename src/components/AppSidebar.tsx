import { Link, useLocation } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Tag,
  Package,
  PackagePlus,
  Settings,
  Box,
  TrendingUp,
  Kanban,
  Users,
  Target,
  Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()

  const navItems = [
    { name: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { name: 'Precificação Dinâmica', path: '/pricing', icon: Tag },
    { name: 'Estoque e Ruptura', path: '/inventory', icon: Package },
    { name: 'Sugestões de Kits', path: '/bundles', icon: PackagePlus },
    { name: 'Painel de Expedição', path: '/shipping', icon: Truck },
  ]

  const crmItems = [
    { name: 'Dashboard Comercial', path: '/crm/dashboard', icon: TrendingUp },
    { name: 'Pipeline CRM', path: '/crm/pipeline', icon: Kanban },
    { name: 'Hub de Clientes', path: '/crm/customers', icon: Users },
    { name: 'Equipe de Vendas', path: '/crm/team', icon: Target },
  ]

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 mb-4 text-indigo-400">
            <Box className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">TINY OPTIMIZER</span>
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                    <Link
                      to={item.path}
                      className={cn('transition-all', isActive ? 'text-indigo-400' : '')}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 mb-2 mt-4 text-emerald-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider uppercase">CRM & Comercial</span>
          </SidebarGroupLabel>
          <SidebarMenu>
            {crmItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                    <Link
                      to={item.path}
                      className={cn('transition-all', isActive ? 'text-emerald-400' : '')}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/settings'}
                tooltip="Configurações"
              >
                <Link
                  to="/settings"
                  className={cn(
                    'transition-all',
                    location.pathname === '/settings' ? 'text-indigo-400' : '',
                  )}
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
