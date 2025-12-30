import { format } from "date-fns";
import { motion } from "framer-motion";
import { GlassCard } from "./ui/glass-card";
import { Sparkles, AlarmClock, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CycleResult {
  time: Date;
  cycles: number;
  duration: number; // in hours
  quality: "optimal" | "good" | "sufficient";
}

interface ResultsDisplayProps {
  results: CycleResult[];
  mode: "wakeup" | "bedtime";
}

export function ResultsDisplay({ results, mode }: ResultsDisplayProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "optimal": return "text-emerald-400";
      case "good": return "text-blue-400";
      case "sufficient": return "text-orange-400";
      default: return "text-slate-400";
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case "optimal": return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "good": return "bg-blue-500/10 text-blue-300 border-blue-500/20";
      case "sufficient": return "bg-orange-500/10 text-orange-300 border-orange-500/20";
      default: return "";
    }
  };

  return (
    <div className="w-full space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          {mode === "wakeup" ? "Best times to fall asleep" : "Best times to wake up"}
        </h2>
        <p className="text-muted-foreground">
          Calculated for 90-minute sleep cycles + 15 min to fall asleep
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard 
              className={cn(
                "p-5 hover:-translate-y-1 transition-transform cursor-default group",
                result.quality === "optimal" && "ring-2 ring-emerald-500/30 bg-emerald-500/5"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider",
                  getQualityBadge(result.quality)
                )}>
                  {result.quality}
                </span>
                {result.quality === "optimal" && (
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-display font-bold text-white">
                  {format(result.time, "h:mm")}
                </span>
                <span className="text-xl text-white/50 font-medium">
                  {format(result.time, "a")}
                </span>
              </div>

              <div className="space-y-1 mt-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Moon className="w-4 h-4 text-purple-400" />
                  <span>{result.cycles} Sleep Cycles</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <AlarmClock className="w-4 h-4 text-blue-400" />
                  <span>{result.duration} Hours of Sleep</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
