import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type StampTone = "primary" | "accent" | "success" | "muted" | "primary-dark";
export type StampSize = "sm" | "md" | "lg";

const toneClasses: Record<StampTone, { ring: string; icon: string; inset: string }> = {
  primary: {
    ring: "border-primary/50 group-hover:border-primary",
    icon: "text-primary",
    inset: "border-primary/20",
  },
  accent: {
    ring: "border-accent/50 group-hover:border-accent",
    icon: "text-accent",
    inset: "border-accent/20",
  },
  success: {
    ring: "border-success/50 group-hover:border-success",
    icon: "text-success",
    inset: "border-success/20",
  },
  muted: {
    ring: "border-muted-foreground/50 group-hover:border-muted-foreground",
    icon: "text-muted-foreground",
    inset: "border-muted-foreground/20",
  },
  "primary-dark": {
    ring: "border-primary-dark/50 group-hover:border-primary-dark",
    icon: "text-primary-dark",
    inset: "border-primary-dark/20",
  },
};

const sizeClasses: Record<StampSize, { wrap: string; icon: string }> = {
  sm: { wrap: "w-12 h-12", icon: "w-5 h-5" },
  md: { wrap: "w-16 h-16", icon: "w-6 h-6" },
  lg: { wrap: "w-24 h-24", icon: "w-8 h-8" },
};

export interface StampIconProps {
  icon: LucideIcon;
  tone?: StampTone;
  size?: StampSize;
  className?: string;
  /** Initial tilt before hover straightens to 0deg */
  rotate?: "-rotate-6" | "-rotate-3" | "rotate-0" | "rotate-3" | "rotate-6";
}

/**
 * Passport-stamp motif: dashed circular ring that straightens on hover.
 * Wrap in an element with `group` for hover interaction.
 */
export function StampIcon({
  icon: Icon,
  tone = "primary",
  size = "md",
  className,
  rotate = "-rotate-3",
}: StampIconProps) {
  const t = toneClasses[tone];
  const s = sizeClasses[size];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full border-2 border-dashed transition-all duration-300",
        s.wrap,
        t.ring,
        rotate,
        "group-hover:rotate-0",
        className
      )}
    >
      <div className={cn("absolute inset-2 rounded-full border", t.inset)} />
      <Icon className={cn(s.icon, t.icon)} />
    </div>
  );
}

export default StampIcon;
