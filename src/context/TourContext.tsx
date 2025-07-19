// context/TourContext.tsx
import { createContext, useContext, useState } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";
import "./TourContext.css";

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
      showProgress: false,
      showBullets: false,
      exitOnOverlayClick: false,
      nextLabel: "Next",
      prevLabel: "Back",
      doneLabel: "Done",
    });

    tour.start();
  };

  const addStep = (step: any) => {
    const updatedSteps = [...steps, step];
    setSteps(updatedSteps);

    // Restart the tour with updated steps
    tour.setOptions({ steps: [step] }).start();
  };

  const resetSteps = () => setSteps([]);

  return <TourContext.Provider value={{ startTour, addStep, resetSteps }}>{children}</TourContext.Provider>;
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error("useTour must be used within TourProvider");
  return context;
};
