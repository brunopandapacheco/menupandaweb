import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake, Palette, Smartphone, Users, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Alerta de Configuração */}
        {!isSupabaseConfigured && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Configuração Necessária
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                O Supabase não está configurado. Para usar o sistema, você precisa:
              </p>
              <ol className="list-decimal list-inside text-orange-700 space-y-2">
                <li>Criar uma conta gratuita no <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                <li>Criar um novo projeto</li>
                <li>Ir em Settings &gt; API no dashboard</li>
                <li>Copiar a URL e a chave "anon"</li>
                <li>Editar o arquivo <code className="bg-orange-100 px-2 py-1 rounded">.env.local</code> com seus dados</li>
                <li>Reiniciar o servidor de desenvolvimento</li>
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Cardápio Digital para Confeiteiras
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie um cardápio profissional e personalizado para sua confeitaria. 
            Gerencie seus produtos e impressione seus clientes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              disabled={!isSupabaseConfigured}
            >
              {isSupabaseConfigured ? 'Começar Agora' : 'Configure o Supabase Primeiro'}
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Cake className="w-8 h-8 text-pink-600 mb-2" />
              <CardTitle>Gestão de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Cadastre e gerencie todos os seus produtos com preços, descrições e fotos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Design Personalizável</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Escolha cores, fontes e layouts que combinam com sua marca.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Smartphone className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Responsivo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seu cardápio fica perfeito em celulares, tablets e computadores.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Fácil para Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Interface intuitiva com pedidos diretos pelo WhatsApp.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4">
            Pronta para transformar sua confeitaria?
          </h2>
          <p className="text-gray-600 mb-6">
            Junte-se a centenas de confeiteiras que já usam nossa plataforma.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            disabled={!isSupabaseConfigured}
          >
            {isSupabaseConfigured ? 'Criar Minha Loja Grátis' : 'Configure o Supabase Primeiro'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;