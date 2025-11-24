import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import CardapioPublico from "./pages/cardapio/[slug]";
import CardapioDemo from "./pages/CardapioDemo";
import TestConnection from "./pages/TestConnection";
import TestDatabase from "./pages/TestDatabase";
import TestLogo from "./pages/TestLogo";
import NotFound from "./pages/NotFound";
import { EnvironmentError } from "./components/EnvironmentError";

const queryClient = new QueryClient();

const App = () => {
  // Verificação das variáveis de ambiente
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Se não tiver as variáveis, mostra erro
  if (!supabaseUrl || !supabaseAnonKey) {
    return <EnvironmentError />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />} />
            <Route path="/cardapio/:slug" element={<CardapioPublico />} />
            <Route path="/demo" element={<CardapioDemo />} />
            <Route path="/test" element={<TestConnection />} />
            <Route path="/test-db" element={<TestDatabase />} />
            <Route path="/test-logo" element={<TestLogo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;