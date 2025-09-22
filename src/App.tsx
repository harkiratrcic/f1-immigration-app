import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Settings from "./pages/Settings";
import InviteFlow from "./pages/InviteFlow";
import AdminClients from "./pages/AdminClients";
import FormFill from "./pages/FormFill";
import AdminResponses from "./pages/AdminResponses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/clients" element={
            <AppLayout>
              <Clients />
            </AppLayout>
          } />
          <Route path="/clients/:clientId" element={
            <AppLayout>
              <ClientDetail />
            </AppLayout>
          } />
          <Route path="/admin/clients" element={
            <AppLayout>
              <AdminClients />
            </AppLayout>
          } />
          <Route path="/admin/responses/:clientId" element={
            <AppLayout>
              <AdminResponses />
            </AppLayout>
          } />
          <Route path="/form/:token" element={<FormFill />} />
          <Route path="/files" element={
            <AppLayout>
              <div className="p-6">
                <h1 className="text-3xl font-bold">Files</h1>
                <p className="text-muted-foreground mt-2">Immigration files coming soon...</p>
              </div>
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="/invite-demo" element={<InviteFlow />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;