import { useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("animate-fade-in");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("animate-fade-out");
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("animate-fade-in");
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div className={transitionStage} style={{ animationDuration: "0.2s" }}>
      {children}
    </div>
  );
}
