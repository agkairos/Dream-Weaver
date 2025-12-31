import { useState } from "react";
import { addMinutes, subMinutes, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Clock, Info, History } from "lucide-react";
import { TimeSelector } from "@/components/time-selector";
import { GlassCard } from "@/components/ui/glass-card";
import { ResultsDisplay } from "@/components/results-display";
import { useCreateCalculation, useCalculations } from "@/hooks/use-calculations";
import { cn } from "@/lib/utils";

type Mode = "wakeup" | "bedtime";

interface CalculationResult {
  time: Date;
  cycles: number;
  duration: number;
  quality: "optimal" | "good" | "sufficient";
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("wakeup"); // "wakeup" = I want to wake up at...
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  
  const createCalculation = useCreateCalculation();
  const { data: history } = useCalculations();

  const calculateSleep = () => {
    const cycles = [6, 5, 4, 3]; // Preferred cycle counts
    const timeToFallAsleep = 15; // minutes
    const cycleLength = 90; // minutes

    const calculatedResults: CalculationResult[] = cycles.map(cycleCount => {
      const totalMinutes = (cycleCount * cycleLength) + timeToFallAsleep;
      let time: Date;
      
      if (mode === "wakeup") {
        // User picked wake up time -> Calculate bedtime (backwards)
        // We subtract the sleep duration from the wake up time
        // Note: The logic in prompt said "Mode A (Bedtime): User picks wake up time". 
        // I'm aligning variable names to user intention:
        // mode="wakeup" -> User says "I want to wake up at X", so we show Bedtimes.
        time = subMinutes(selectedTime, totalMinutes);
      } else {
        // User picked bedtime -> Calculate wake time (forwards)
        time = addMinutes(selectedTime, totalMinutes);
      }

      let quality: "optimal" | "good" | "sufficient" = "sufficient";
      if (cycleCount >= 5) quality = "optimal";
      if (cycleCount === 4) quality = "good";

      return {
        time,
        cycles: cycleCount,
        duration: (cycleCount * cycleLength) / 60,
        quality
      };
    });

    // In 'wakeup' mode (calculating bedtimes), earlier bedtimes mean MORE sleep.
    // In 'bedtime' mode (calculating wake times), later wake times mean MORE sleep.
    // We want to sort by optimal first usually, but chronological might be better UI.
    // Let's sort by time ascending.
    calculatedResults.sort((a, b) => a.time.getTime() - b.time.getTime());

    setResults(calculatedResults);

    // Save to history
    createCalculation.mutate({
      mode,
      targetTime: format(selectedTime, "HH:mm"),
    });
  };

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    setResults(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6 ring-1 ring-white/10 shadow-lg shadow-primary/20">
          <Moon className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-3xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Sleep Calculator
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Optimize your rest with the power of 90-minute sleep cycles.
          Wake up feeling refreshed and energized.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Calculator Column */}
        <div className="lg:col-span-8 space-y-8">
          <GlassCard className="p-8">
            {/* Mode Switcher */}
            <div className="flex bg-black/20 p-1 rounded-xl mb-8">
              <button
                onClick={() => handleModeSwitch("wakeup")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all",
                  mode === "wakeup" 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Sun className="w-4 h-4" />
                I want to wake up at...
              </button>
              <button
                onClick={() => handleModeSwitch("bedtime")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all",
                  mode === "bedtime" 
                    ? "bg-primary text-white shadow-lg" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Moon className="w-4 h-4" />
                I'm going to bed at...
              </button>
            </div>

            {/* Time Picker */}
            <TimeSelector 
              value={selectedTime} 
              onChange={(date) => {
                setSelectedTime(date);
                setResults(null); // Clear results on edit to encourage re-calculation
              }}
              label={mode === "wakeup" ? "Set Wake Up Time" : "Set Bed Time"}
            />

            {/* Calculate Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={calculateSleep}
                className="
                  group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg
                  shadow-[0_0_20px_rgba(255,255,255,0.3)] 
                  hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] 
                  hover:scale-105 active:scale-95 transition-all duration-300
                "
              >
                <span className="flex items-center gap-2">
                  Calculate Sleep Cycles
                  <SparkleIcon className="w-5 h-5 text-purple-600 transition-transform group-hover:rotate-12" />
                </span>
              </button>
            </div>
          </GlassCard>

          {/* Results Section */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <ResultsDisplay results={results} mode={mode} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* History Card */}
          {/* <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4 text-white/90">
              <History className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Recent Calculations</h3>
            </div>
            <div className="space-y-3">
              {history?.length === 0 && (
                <p className="text-sm text-white/40 italic">No recent history</p>
              )}
              {history?.slice(0, 5).map((entry, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/60">
                    {entry.mode === 'wakeup' ? 'Wake up at' : 'Bed at'}
                  </span>
                  <span className="font-mono text-primary font-medium">
                    {entry.targetTime}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard> */}

          {/* Tips Card */}
          <GlassCard className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <div className="flex items-center gap-2 mb-4 text-white/90">
              <Info className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-lg">Sleep Hygiene</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">1</span>
                <p className="text-sm text-white/70">Stick to a consistent sleep schedule, even on weekends.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">2</span>
                <p className="text-sm text-white/70">Avoid screens (blue light) at least 1 hour before bed.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">3</span>
                <p className="text-sm text-white/70">Keep your bedroom cool, dark, and quiet.</p>
              </li>
            </ul>
          </GlassCard>
          
          <div className="text-center">
            <button 
              onClick={() => {
                const now = new Date();
                const nextCycle = addMinutes(now, 105); // 15 + 90
                setSelectedTime(now);
                // Trigger calculation logic for "Now" functionality could go here
              }}
              className="text-xs text-white/30 hover:text-white/80 transition-colors uppercase tracking-widest font-bold"
            >
              Set time to now
            </button>
          </div>
        </div>
      </div>
      <a
        href="/privacy-policy"
        style={{
          display: "inline-block",
          textDecoration: "none",
          fontSize: "0.60rem",
          marginTop: "3rem",  
        }}
      >
       © AGÊNCIA KAIRÓS Privacy Policy
      </a>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M9.75 9.75l-2.25 2.25 2.25 2.25 2.25-2.25-2.25-2.25z" />
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 18a8.25 8.25 0 110-16.5 8.25 8.25 0 010 16.5z" clipRule="evenodd" />
    </svg>
  );
}
