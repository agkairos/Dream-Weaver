import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
}

export function GlassCard({ className, children, gradient, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 shadow-xl",
        "bg-slate-900/40 backdrop-blur-xl",
        gradient && "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
