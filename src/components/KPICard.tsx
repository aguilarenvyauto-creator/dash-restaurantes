import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  suffix?: string;
  animated?: boolean;
}

export function KPICard({ title, value, icon: Icon, trend, suffix = "", animated = true }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ""));

  useEffect(() => {
    if (!animated || isNaN(numericValue)) return;

    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue, animated]);

  const displayText = animated && !isNaN(numericValue) 
    ? `${displayValue.toLocaleString()}${suffix}`
    : value;

  return (
    <div className="glass-card p-6 hover-lift group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors glow-effect">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-primary glow-text">
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-foreground tracking-tight">
        {displayText}
      </p>
    </div>
  );
}
