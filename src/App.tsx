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
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [showEnvironmentError, setShowEnvironmentError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar se as variáveis de ambiente estão configuradas
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';
    
    console.log('🔍 App.tsx - Verificação de ambiente:');
    console.log('MODE:', import.meta.env.MODE);
    console.log('PROD:', import.meta.env.PROD);
    console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
    
    // Pequeno delay para garantir que as variáveis sejam carregadas
    setTimeout(() => {
      // Em produção, se não tiver as variáveis, mostrar erro
      if (isProduction && (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://seu-projeto.supabase.co')) {
        console.log('❌ Mostrando EnvironmentError');
        setShowEnvironmentError(true);
      } else if (!supabaseUrl || !supabaseAnonKey) {
        // Em desenvolvimento, mostrar erro se não estiver configurado
        console.log('❌ Variáveis não configuradas em desenvolvimento');
        setShowEnvironmentError(true);
      } else {
        console.log('✅ Renderizando aplicação normal');
      }
      setIsChecking(false);
    }, 100);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando configurações...</p>
        </div>
      </div>
    );
  }

  if (showEnvironmentError) {
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;