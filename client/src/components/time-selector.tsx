import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TimeSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
  label: string;
}

export function TimeSelector({ value, onChange, label }: TimeSelectorProps) {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("PM");

  // Sync internal state when external value changes
  useEffect(() => {
    let h = value.getHours();
    const m = value.getMinutes();
    const p = h >= 12 ? "PM" : "AM";
    
    h = h % 12;
    h = h ? h : 12; // convert 0 to 12

    setHours(h);
    setMinutes(m);
    setPeriod(p);
  }, [value]);

  const updateTime = (h: number, m: number, p: "AM" | "PM") => {
    const newDate = new Date();
    let hour24 = h;
    
    if (p === "PM" && h < 12) hour24 += 12;
    if (p === "AM" && h === 12) hour24 = 0;
    
    newDate.setHours(hour24);
    newDate.setMinutes(m);
    newDate.setSeconds(0);
    
    onChange(newDate);
  };

  const adjustHour = (delta: number) => {
    let newH = hours + delta;
    if (newH > 12) newH = 1;
    if (newH < 1) newH = 12;
    updateTime(newH, minutes, period);
  };

  const adjustMinute = (delta: number) => {
    let newM = minutes + delta;
    if (newM > 59) newM = 0;
    if (newM < 0) newM = 55; // 5 minute steps usually
    updateTime(hours, newM, period);
  };

  const togglePeriod = () => {
    updateTime(hours, minutes, period === "AM" ? "PM" : "AM");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h3 className="text-muted-foreground font-medium uppercase tracking-wider text-sm">{label}</h3>
      
      <div className="flex items-center gap-4 bg-black/20 p-4 rounded-3xl border border-white/5">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <button onClick={() => adjustHour(1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <ChevronUp className="w-6 h-6" />
          </button>
          <div className="w-20 h-20 flex items-center justify-center text-5xl font-display font-bold text-white tabular-nums">
            {hours.toString().padStart(2, '0')}
          </div>
          <button onClick={() => adjustHour(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        <span className="text-4xl text-white/30 font-light -mt-2">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <button onClick={() => adjustMinute(5)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <ChevronUp className="w-6 h-6" />
          </button>
          <div className="w-20 h-20 flex items-center justify-center text-5xl font-display font-bold text-white tabular-nums">
            {minutes.toString().padStart(2, '0')}
          </div>
          <button onClick={() => adjustMinute(-5)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Period */}
        <div className="flex flex-col gap-2 ml-4">
          <button 
            onClick={() => period === 'PM' && togglePeriod()}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
              period === "AM" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-white/40 hover:text-white"
            )}
          >
            AM
          </button>
          <button 
            onClick={() => period === 'AM' && togglePeriod()}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-bold transition-all",
              period === "PM" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "text-white/40 hover:text-white"
            )}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}
