import type { ReactNode } from "react";

export const designTokens = {
  colors: {
    ink: "#18181b",
    muted: "#71717a",
    surface: "#ffffff",
    background: "#f8fafc",
    primary: "#0f766e",
    warning: "#d97706",
    border: "#e4e4e7"
  },
  radius: {
    sm: 6,
    md: 8
  }
};

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, onClick, type = "button", disabled, variant = "primary" }: ButtonProps) {
  const styles = {
    primary: "bg-zinc-950 text-white hover:bg-zinc-800",
    secondary: "bg-white text-zinc-950 ring-1 ring-zinc-200 hover:bg-zinc-50",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
      {children}
    </span>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-zinc-950">{value}</div>
    </div>
  );
}
