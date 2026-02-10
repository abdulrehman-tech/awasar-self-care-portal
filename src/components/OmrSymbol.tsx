import { useLanguage } from "@/contexts/LanguageContext";

interface OmrSymbolProps {
  className?: string;
  size?: number;
}

/**
 * Inline Omani Rial currency symbol component.
 * Uses the dark version by default, with a light (white) version available via className.
 * Size is relative to current text (defaults to matching text height).
 */
export default function OmrSymbol({ className = "", size }: OmrSymbolProps) {
  return (
    <svg
      viewBox="0 0 729.6 365.93"
      fill="currentColor"
      aria-label="OMR"
      className={`inline-block align-middle ${className}`}
      style={{ height: size ? `${size}px` : "0.85em", width: "auto" }}
    >
      <path d="M241.67,213.77c-.63-49.2,11.44-95.41,35.76-137.75C313.47,13.28,353.02-6.48,421.55,28.87c10.67,5.5,53.6,35.43,57.81,44.54,5.03,10.87-27.48,103.87-29.11,122.3-34.69-37.51-99.37-98.66-154.85-69.62-45.05,23.58-12.02,62.54,11.46,87.68h409.36l-26.41,47.64h-332.5c-.31,1.8.87,3.3,2.53,4.6,12.44,9.72,80.97,39.54,94.75,39.54h210.71l-26.89,48.94H13.37l26.91-48.94h253.38l-37.11-44.13H64.75l26.41-47.64h150.51Z" />
    </svg>
  );
}

/**
 * Currency display helper: renders "amount OMR_SYMBOL/period"
 */
export function OmrCurrency({ amount, period, className }: { amount: string | number; period?: string; className?: string }) {
  return (
    <span className={className}>
      {amount} <OmrSymbol />{period && <span className="text-xs font-normal text-muted-foreground">/{period}</span>}
    </span>
  );
}
