import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ModeContextProvider from "./contexts/ModeContextProvider.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModeContextProvider>
      <App />
    </ModeContextProvider>
  </StrictMode>
);
