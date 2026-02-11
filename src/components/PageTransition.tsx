import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef, type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      prevPathRef.current = location.pathname;
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 50);
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? "translateY(8px)" : "translateY(0)",
      }}
    >
      {children}
    </div>
  );
}
