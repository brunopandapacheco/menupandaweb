import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [dyadComponentTagger(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Configurações específicas para produção
      sourcemap: isProduction ? false : true,
      minify: isProduction ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar bibliotecas grandes em chunks separados
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
          }
        }
      }
    },
    // Configurações para Vercel
    define: {
      global: 'globalThis',
    }
  };
});