import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/app-layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
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
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/form/:token" element={<FormFill />} />
            <Route path="/invite-demo" element={<InviteFlow />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <AppLayout>
                  <Clients />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients/:clientId" element={
              <ProtectedRoute>
                <AppLayout>
                  <ClientDetail />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/clients" element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminClients />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/responses/:clientId" element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminResponses />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/files" element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Files</h1>
                    <p className="text-muted-foreground mt-2">Immigration files coming soon...</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;