import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RequestsProvider } from "@/context/RequestsContext";

createRoot(document.getElementById("root")!).render(
  <RequestsProvider>
    <App />
  </RequestsProvider>
);
