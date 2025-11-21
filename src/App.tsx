import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import CardapioPublico from "./pages/cardapio/[slug]";
import NotFound from "./pages/NotFound";
import { EnvironmentError } from "./components/EnvironmentError";

const queryClient = new QueryClient();

const App = () => {
  // Verificar se as variáveis de ambiente estão configuradas
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
  
  console.log('🔍 App.tsx - Verificação de ambiente:');
  console.log('MODE:', import.meta.env.MODE);
  console.log('PROD:', import.meta.env.PROD);
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  
  // Em produção, se não tiver as variáveis, mostrar erro
  if (isProduction && (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://seu-projeto.supabase.co')) {
    console.log('❌ Mostrando EnvironmentError');
    return <EnvironmentError />;
  }

  console.log('✅ Renderizando aplicação normal');
  
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;