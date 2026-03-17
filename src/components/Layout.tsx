import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
          <Header />
          <div className="px-6 py-2">
            <SidebarTrigger className="md:hidden mb-4" />
          </div>
          <main className="flex-1 px-6 pb-12 overflow-x-hidden animate-fade-in">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
