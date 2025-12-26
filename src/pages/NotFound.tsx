import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Página não encontrada</p>
        <p className="text-gray-500 mb-6">A página que você está procurando não existe.</p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/login')}>
            Fazer Login
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;