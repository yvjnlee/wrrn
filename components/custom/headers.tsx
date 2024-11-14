import React from "react";
import { cn } from "@/lib/utils";

interface SubHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export function SubHeader({ title, actions, className }: SubHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-2", className)}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {actions && <div className="flex space-x-2">{actions}</div>}
    </div>
  );
}
