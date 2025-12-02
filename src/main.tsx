import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Garantir que o elemento root exista
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento #root não encontrado no HTML");
}

const root = createRoot(rootElement);

// Adicionar tratamento de erro global
window.addEventListener('error', (event) => {
  console.error('Erro global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promessa rejeitada não tratada:', event.reason);
});

try {
  root.render(<App />);
} catch (error) {
  console.error('Erro ao renderizar o app:', error);
  // Fallback básico
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Erro ao carregar a aplicação</h1>
      <p>Por favor, recarregue a página.</p>
      <button onclick="location.reload()">Recarregar</button>
    </div>
  `;
}