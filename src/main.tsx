import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "react-data-grid/lib/styles.css";
import { RuleProvider } from "./context/RuleContext.tsx";
import { TourProvider } from "./context/TourContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <BrowserRouter>
      <RuleProvider>
        <TourProvider>
          <App />
        </TourProvider>
      </RuleProvider>
    </BrowserRouter>
  // </StrictMode>
);
