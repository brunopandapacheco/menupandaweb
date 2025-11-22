import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Garantir que o elemento root exista
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento #root não encontrado no HTML");
}

const root = createRoot(rootElement);
root.render(<App />);