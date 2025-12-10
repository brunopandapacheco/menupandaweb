import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { CacheProvider } from "@/hooks/useCache";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import CardapioPublico from "./pages/cardapio/[slug]";
import CardapioDemo from "./pages/CardapioDemo";
import TestConnection from "./pages/TestConnection";
import TestDatabase from "./pages/TestDatabase";
import TestLogo from "./pages/TestLogo";
import TestCardapioPublico from "./pages/TestCardapioPublico";
import DebugEnv from "./pages/DebugEnv";
import NotFound from "./pages/NotFound";
import { EnvironmentError } from "./components/EnvironmentError";
import { ErrorBoundary } from "./pages/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificação das variáveis de ambiente
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Se não tiver as variáveis, mostra erro
  if (!supabaseUrl || !supabaseAnonKey) {
    return <EnvironmentError />;
  }

  // Aguardar hidratação no cliente
  if (!isClient) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fef2f2'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f4f6', 
            borderTop: '4px solid #ec4899', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <CacheProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />} />
                {/* ROTA DO CARDÁPIO PÚBLICO - IMPORTANTE! */}
                <Route path="/cardapio/:slug" element={<CardapioPublico />} />
                <Route path="/demo" element={<CardapioDemo />} />
                <Route path="/test" element={<TestConnection />} />
                <Route path="/test-db" element={<TestDatabase />} />
                <Route path="/test-logo" element={<TestLogo />} />
                <Route path="/test-cardapio" element={<TestCardapioPublico />} />
                <Route path="/debug-env" element={<DebugEnv />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
};

export default App;