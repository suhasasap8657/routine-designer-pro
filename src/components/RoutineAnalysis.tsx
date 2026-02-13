import { RoutineGrid, getCategoryStats, getDayStats, CATEGORIES, DAYS, TIME_SLOTS, Category } from "@/lib/routineTypes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface RoutineAnalysisProps {
  grid: RoutineGrid;
}

const PIE_COLORS = [
  "hsl(207, 70%, 50%)",
  "hsl(160, 55%, 42%)",
  "hsl(35, 85%, 55%)",
  "hsl(250, 40%, 55%)",
  "hsl(340, 60%, 55%)",
  "hsl(20, 80%, 55%)",
  "hsl(180, 40%, 50%)",
  "hsl(210, 10%, 60%)",
];

export function RoutineAnalysis({ grid }: RoutineAnalysisProps) {
  const catStats = getCategoryStats(grid);
  const dayStats = getDayStats(grid);

  const totalFilled = Object.values(catStats).reduce((a, b) => a + b, 0);
  const totalSlots = DAYS.length * TIME_SLOTS.length;

  const pieData = CATEGORIES
    .map((cat, i) => ({
      name: cat.label,
      value: catStats[cat.value as Category],
      color: PIE_COLORS[i],
    }))
    .filter(d => d.value > 0);

  const barData = CATEGORIES.map((cat, i) => ({
    name: cat.label,
    hours: catStats[cat.value as Category],
    fill: PIE_COLORS[i],
  }));

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        <SummaryCard label="Total Hours Planned" value={`${totalFilled}h`} sub={`of ${totalSlots}h available`} />
        <SummaryCard label="Utilization" value={`${totalSlots > 0 ? Math.round((totalFilled / totalSlots) * 100) : 0}%`} sub="weekly coverage" />
        <SummaryCard label="Top Category" value={pieData.length > 0 ? pieData.sort((a, b) => b.value - a.value)[0].name : "—"} sub={pieData.length > 0 ? `${pieData.sort((a, b) => b.value - a.value)[0].value}h` : ""} />
        <SummaryCard label="Active Days" value={`${dayStats.filter(d => d.filled > 0).length}/7`} sub="days with activities" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Distribution Pie */}
        <div className="bg-card border border-border rounded-sm">
          <div className="grid-header text-left text-xs">📊 Category Distribution</div>
          <div className="p-4 h-72">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Hours per Category Bar */}
        <div className="bg-card border border-border rounded-sm">
          <div className="grid-header text-left text-xs">📈 Hours per Category</div>
          <div className="p-4 h-72">
            {totalFilled > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 85%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="hours" radius={[2, 2, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {/* Daily Fill Rate */}
        <div className="bg-card border border-border rounded-sm lg:col-span-2">
          <div className="grid-header text-left text-xs">📅 Daily Schedule Coverage</div>
          <div className="p-4 h-64">
            {totalFilled > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayStats} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 15%, 85%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, TIME_SLOTS.length]} />
                  <Tooltip formatter={(value: number) => [`${value}h`, "Filled"]} />
                  <Bar dataKey="filled" fill="hsl(207, 70%, 50%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="bg-card border border-border rounded-sm">
        <div className="grid-header text-left text-xs">🗂 Summary Table</div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="grid-header text-left">Category</th>
              <th className="grid-header text-right">Hours</th>
              <th className="grid-header text-right">% of Total</th>
              <th className="grid-header text-left">Distribution</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat, i) => {
              const hours = catStats[cat.value as Category];
              const pct = totalFilled > 0 ? (hours / totalFilled) * 100 : 0;
              return (
                <tr key={cat.value} className="hover:bg-grid-cell-hover transition-colors">
                  <td className="px-3 py-2 text-sm border border-grid-line">
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-sm ${cat.color}`} />
                      {cat.label}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-right font-mono-data border border-grid-line">{hours}</td>
                  <td className="px-3 py-2 text-sm text-right font-mono-data border border-grid-line">{pct.toFixed(1)}%</td>
                  <td className="px-3 py-2 border border-grid-line">
                    <div className="w-full bg-muted rounded-sm h-3">
                      <div
                        className={`h-3 rounded-sm transition-all ${cat.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-sm p-3">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl font-bold font-mono-data text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
      Add activities in the Schedule tab to see analysis
    </div>
  );
}
