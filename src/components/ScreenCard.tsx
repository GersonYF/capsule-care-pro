import { ReactNode } from "react";

interface ScreenCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const ScreenCard = ({ title, children, className = "" }: ScreenCardProps) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
