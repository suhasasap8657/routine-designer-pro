import { Flame, TrendingUp, Zap, Trophy, Target } from "lucide-react";
import { DaySnapshot } from "@/lib/storage";

const QUOTES = [
  { text: "Success is the sum of small efforts repeated day in and day out.", icon: TrendingUp },
  { text: "Your routine determines your future. Discipline equals freedom.", icon: Flame },
  { text: "Every hour you plan is an hour you own. Stay locked in.", icon: Zap },
  { text: "The grind doesn't stop. Winners build systems, not wishes.", icon: Trophy },
  { text: "You're not behind — you're building. Keep stacking.", icon: Target },
  { text: "Rich people have routines. Broke people have excuses.", icon: Flame },
  { text: "Outwork yesterday. Every single day.", icon: TrendingUp },
  { text: "Consistency compounds. Your future self will thank you.", icon: Zap },
];

interface Props {
  history: DaySnapshot[];
  currentFilled: number;
  totalSlots: number;
}

export function MotivationalBanner({ history, currentFilled, totalSlots }: Props) {
  const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];
  const Icon = quote.icon;

  const streak = getStreak(history);
  const todayPct = totalSlots > 0 ? Math.round((currentFilled / totalSlots) * 100) : 0;
  const yesterdaySnap = history.length >= 2 ? history[history.length - 2] : null;
  const yesterdayPct = yesterdaySnap ? Math.round((yesterdaySnap.filledSlots / yesterdaySnap.totalSlots) * 100) : 0;
  const delta = todayPct - yesterdayPct;

  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/30 to-secondary/10 border-b border-border px-4 py-3 flex items-center gap-4">
      <div className="flex items-center gap-2 text-primary">
        <Icon className="w-5 h-5" />
        <p className="text-sm font-medium italic text-foreground/80 flex-1">"{quote.text}"</p>
      </div>
      <div className="flex items-center gap-4 ml-auto shrink-0">
        {streak > 0 && (
          <div className="flex items-center gap-1 text-xs font-semibold text-secondary">
            <Flame className="w-3.5 h-3.5" />
            {streak} day streak
          </div>
        )}
        {yesterdaySnap && (
          <div className={`text-xs font-mono-data font-semibold ${delta >= 0 ? "text-secondary" : "text-destructive"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs yesterday
          </div>
        )}
        <div className="text-xs font-mono-data text-muted-foreground">
          Today: {todayPct}%
        </div>
      </div>
    </div>
  );
}

function getStreak(history: DaySnapshot[]): number {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].filledSlots > 0) streak++;
    else break;
  }
  return streak;
}
