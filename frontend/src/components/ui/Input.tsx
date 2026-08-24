import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ icon, className = "", ...props }) => {
  return (
    <div className="relative flex items-center w-full">
      {icon && <div className="absolute left-3 text-muted-foreground pointer-events-none">{icon}</div>}
      <input
        className={`h-10 w-full rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15 ${
          icon ? "pl-9" : "px-3"
        } ${className}`}
        {...props}
      />
    </div>
  );
};
