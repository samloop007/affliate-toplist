import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import DomainsPage from "./pages/DomainsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';

const queryClient = new QueryClient();

const RequireAdminAuth = ({ children }: { children: JSX.Element }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_jwt') : null;
  return token ? children : <Navigate to="/admin/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/domains" element={<RequireAdminAuth><DomainsPage /></RequireAdminAuth>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdminAuth><AdminPanel /></RequireAdminAuth>} />
          <Route path="/admin/panel" element={<RequireAdminAuth><AdminPage /></RequireAdminAuth>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
