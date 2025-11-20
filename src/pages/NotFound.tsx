import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

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