"use client";

import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  iconName?: string;
  description?: string;
  className?: string;
  indicatorColor?: string;
}

const SectionHeader = ({
  title,
  iconName,
  description,
  className,
  indicatorColor = "bg-primary",
}: SectionHeaderProps) => {
  const Icon = iconName ? getIconComponent(iconName) : null;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-2">
        <span className={cn("w-1 h-6 rounded-full", indicatorColor)}></span>
        {Icon && (
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground pl-3">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
