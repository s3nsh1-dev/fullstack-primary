import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ModeContextProvider from "./contexts/ModeContextProvider.tsx";
import AuthContextProvider from "./contexts/AuthContextProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ModeContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ModeContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
