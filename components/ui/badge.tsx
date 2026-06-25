import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "accent" | "success" | "destructive" | "muted";

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-foreground border border-border",
  primary: "bg-primary/10 text-primary border border-primary/20",
  accent: "bg-accent/15 text-accent border border-accent/30",
  success: "bg-success/15 text-success border border-success/30",
  destructive: "bg-destructive/10 text-destructive border border-destructive/30",
  muted: "bg-muted text-muted-foreground border border-transparent",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
