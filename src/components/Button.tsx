import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  secondary?: boolean;
}

export default function Button({ children, onClick, secondary = false, className = "", disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`primary-button ${secondary ? "secondary-button" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
