import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  console.log('🔧 Vite Config - Mode:', mode);
  console.log('🔧 Vite Config - Is Production:', isProduction);
  
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
      // Garantir que o build funcione no Vercel
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          // Separar bibliotecas grandes em chunks separados
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
          },
          // Garantir nomes de arquivo consistentes
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    },
    // Configurações para Vercel
    define: {
      global: 'globalThis',
      // Garantir que as variáveis de ambiente sejam injetadas
      'import.meta.env.PROD': JSON.stringify(isProduction),
      'import.meta.env.MODE': JSON.stringify(mode),
    },
    // Otimização para Vercel
    optimizeDeps: {
      include: ['react', 'react-dom', '@supabase/supabase-js']
    }
  };
});