import { DaySnapshot } from "@/lib/storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { CATEGORIES, Category } from "@/lib/routineTypes";
import { TrendingUp, Calendar } from "lucide-react";

interface Props {
  history: DaySnapshot[];
}

const PIE_COLORS: Record<string, string> = {
  work: "hsl(207, 70%, 50%)",
  exercise: "hsl(160, 55%, 42%)",
  meals: "hsl(35, 85%, 55%)",
  sleep: "hsl(250, 40%, 55%)",
  personal: "hsl(340, 60%, 55%)",
  study: "hsl(20, 80%, 55%)",
  break: "hsl(180, 40%, 50%)",
  other: "hsl(210, 10%, 60%)",
};

export function HistoryView({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8">
        <div className="text-center space-y-2">
          <Calendar className="w-12 h-12 mx-auto opacity-40" />
          <p className="text-sm">No history yet. Start filling your routine and come back tomorrow!</p>
        </div>
      </div>
    );
  }

  const chartData = history.slice(-30).map(s => ({
    date: s.date.slice(5), // MM-DD
    filled: s.filledSlots,
    pct: Math.round((s.filledSlots / s.totalSlots) * 100),
  }));

  const categoryTrend = history.slice(-14).map(s => ({
    date: s.date.slice(5),
    ...s.categories,
  }));

  const best = history.reduce((a, b) => (a.filledSlots > b.filledSlots ? a : b), history[0]);
  const avg = Math.round(history.reduce((a, b) => a + b.filledSlots, 0) / history.length);
  const totalDays = history.length;

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Days Tracked" value={`${totalDays}`} icon="📅" />
        <StatCard label="Best Day" value={`${best.filledSlots}h`} icon="🏆" sub={best.date} />
        <StatCard label="Daily Average" value={`${avg}h`} icon="📊" />
        <StatCard label="Total Hours" value={`${history.reduce((a, b) => a + b.filledSlots, 0)}h`} icon="⚡" />
      </div>

      {/* Progress over time */}
      <div className="bg-card border border-border rounded-sm">
        <div className="grid-header text-left text-xs flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" /> Daily Progress (Last 30 Days)
        </div>
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(207, 70%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(207, 70%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 85%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value: number) => [`${value}h`, "Hours Filled"]} />
              <Area type="monotone" dataKey="filled" stroke="hsl(207, 70%, 50%)" fill="url(#progressGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Utilization % over time */}
      <div className="bg-card border border-border rounded-sm">
        <div className="grid-header text-left text-xs">📈 Utilization % Over Time</div>
        <div className="p-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 85%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip formatter={(value: number) => [`${value}%`, "Utilization"]} />
              <Line type="monotone" dataKey="pct" stroke="hsl(160, 55%, 42%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown over time */}
      <div className="bg-card border border-border rounded-sm">
        <div className="grid-header text-left text-xs">🗂 Category Trends (Last 14 Days)</div>
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 85%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              {CATEGORIES.map(cat => (
                <Bar key={cat.value} dataKey={cat.value} stackId="a" fill={PIE_COLORS[cat.value]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, sub }: { label: string; value: string; icon: string; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-sm p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        <span>{icon}</span> {label}
      </div>
      <div className="text-2xl font-bold font-mono-data text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}
