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
import { LayoutDashboard, Tag, Package, PackagePlus, Settings, Box } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()

  const navItems = [
    { name: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { name: 'Precificação Dinâmica', path: '/pricing', icon: Tag },
    { name: 'Estoque e Ruptura', path: '/inventory', icon: Package },
    { name: 'Sugestões de Kits', path: '/bundles', icon: PackagePlus },
    { name: 'Configurações', path: '/settings', icon: Settings },
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
      </SidebarContent>
    </Sidebar>
  )
}
