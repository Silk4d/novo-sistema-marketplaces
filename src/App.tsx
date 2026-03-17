import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DataStoreProvider } from '@/stores/useDataStore'

import Layout from './components/Layout'
import Index from './pages/Index'
import Pricing from './pages/Pricing'
import Inventory from './pages/Inventory'
import Bundles from './pages/Bundles'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <DataStoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/bundles" element={<Bundles />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </DataStoreProvider>
  </BrowserRouter>
)

export default App
