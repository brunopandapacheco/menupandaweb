import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake, Palette, Smartphone, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Cardápio Digital para Confeiteiras
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie um cardápio profissional e personalizado para sua confeitaria. 
            Gerencie seus produtos e impressione seus clientes.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')}>
              Começar Agora
            </Button>
            <Button variant="outline" size="lg">
              Ver Demonstração
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
          <Button size="lg" onClick={() => navigate('/login')}>
            Criar Minha Loja Grátis
          </Button>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;