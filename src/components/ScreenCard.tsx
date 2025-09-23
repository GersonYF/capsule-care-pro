import { ReactNode } from "react";

interface ScreenCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const ScreenCard = ({ title, children, className = "" }: ScreenCardProps) => {
  return (
    <div className={`bg-primary rounded-3xl p-6 text-white min-h-[600px] w-full max-w-sm mx-auto ${className}`}>
      <h1 className="text-xl font-semibold mb-6 leading-tight">{title}</h1>
      <div className="bg-white rounded-2xl p-4 text-foreground min-h-[480px] flex flex-col">
        {children}
      </div>
      
      {/* Bottom Navigation */}
      <div className="flex justify-around mt-4 px-4">
        <div className="flex flex-col items-center text-white/80">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <span className="text-xs">Inicio</span>
        </div>
        <div className="flex flex-col items-center text-white/80">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <span className="text-xs">Calendario</span>
        </div>
        <div className="flex flex-col items-center text-white/80">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
          </div>
          <span className="text-xs">Historial</span>
        </div>
      </div>
    </div>
  );
};