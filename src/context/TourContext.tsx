// context/TourContext.tsx
import { createContext, useContext, useState } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

interface TourContextType {
  startTour: () => void;
  addStep: (step: any) => void;
  resetSteps: () => void;
}

const TourContext = createContext<TourContextType | null>(null);

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const [tour] = useState(() => introJs());
  const [steps, setSteps] = useState<any[]>([
    {
      element: "#nav-manage",
      intro: "This is where you manage your uploaded files.",
    },
    {
      element: "#nav-configure",
      intro: "Configure validation rules here.",
    },
    {
      element: "#btn-upload",
      intro: "Click here to upload a data file.",
    },
  ]);

  const startTour = () => {
    tour.setOptions({
      steps,
      showProgress: true,
      showBullets: false,
      exitOnOverlayClick: false,
      nextLabel: "Next",
      prevLabel: "Back",
      doneLabel: "Done",
    });

    tour.onafterchange(() => {
      // Add Tailwind-like styles to the tooltip DOM manually
      const tooltip = document.querySelector(".introjs-tooltip") as HTMLElement;
      if (tooltip) {
        tooltip.style.borderRadius = "0.75rem"; // rounded-xl
        tooltip.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)"; // shadow-xl
        tooltip.style.padding = "1rem"; // p-4
        tooltip.style.backgroundColor = "#fff"; // bg-white
        tooltip.style.color = "#1f2937"; // text-gray-800
        tooltip.style.fontSize = "1rem"; // text-base
        tooltip.style.fontFamily = "'Inter', sans-serif"; // use your global font
      }

      const buttons = document.querySelectorAll(".introjs-button") as NodeListOf<HTMLButtonElement>;
      buttons.forEach((btn) => {
        btn.style.borderRadius = "0.375rem"; // rounded-md
        btn.style.padding = "0.5rem 1rem"; // px-4 py-2
        btn.style.backgroundColor = "#8b5cf6"; // bg-purple-500
        btn.style.color = "#fff"; // text-white
        btn.style.border = "none";
        btn.style.margin = "0 0.25rem";
      });

      const title = document.querySelector(".introjs-tooltip-title") as HTMLElement;
      if (title) {
        title.style.fontWeight = "600"; // font-semibold
        title.style.fontSize = "1.125rem"; // text-lg
        title.style.color = "#4c1d95"; // text-purple-900
        title.style.marginBottom = "0.5rem"; // mb-2
      }
    });

    tour.start();
  };

  const addStep = (step: any) => {
    const updatedSteps = [...steps, step];
    setSteps(updatedSteps);

    // Restart the tour with updated steps
    tour.setOptions({ steps: updatedSteps }).start();
  };

  const resetSteps = () => setSteps([]);

  return <TourContext.Provider value={{ startTour, addStep, resetSteps }}>{children}</TourContext.Provider>;
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error("useTour must be used within TourProvider");
  return context;
};
