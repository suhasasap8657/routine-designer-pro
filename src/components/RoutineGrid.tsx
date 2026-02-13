import { useState } from "react";
import { RoutineGrid as GridType, DAYS, TIME_SLOTS, CATEGORIES, RoutineEntry } from "@/lib/routineTypes";
import { CellEditor } from "./CellEditor";

interface RoutineGridProps {
  grid: GridType;
  onUpdateCell: (day: string, slot: string, entry: RoutineEntry | null) => void;
}

function getCatColor(category: string) {
  return CATEGORIES.find(c => c.value === category)?.color || "bg-cat-other";
}

export function RoutineGridView({ grid, onUpdateCell }: RoutineGridProps) {
  const [editing, setEditing] = useState<{ day: string; slot: string } | null>(null);

  return (
    <div className="overflow-auto flex-1">
      <table className="w-full border-collapse min-w-[900px]">
        <thead>
          <tr>
            <th className="grid-header w-20 sticky left-0 z-10 bg-grid-header-bg">Time</th>
            {DAYS.map(day => (
              <th key={day} className="grid-header">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map(slot => (
            <tr key={slot}>
              <td className="grid-header sticky left-0 z-10 bg-grid-header-bg font-mono-data text-xs font-normal">
                {slot}
              </td>
              {DAYS.map(day => {
                const entry = grid[day]?.[slot];
                return (
                  <td
                    key={`${day}-${slot}`}
                    onClick={() => setEditing({ day, slot })}
                    className={`grid-cell min-w-[110px] h-10 ${
                      entry ? `${getCatColor(entry.category)} text-primary-foreground` : ""
                    }`}
                  >
                    {entry && (
                      <span className="text-xs font-medium truncate block">
                        {entry.activity}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <CellEditor
          day={editing.day}
          timeSlot={editing.slot}
          existing={grid[editing.day]?.[editing.slot] || null}
          onSave={(entry) => {
            onUpdateCell(editing.day, editing.slot, entry);
            setEditing(null);
          }}
          onDelete={() => {
            onUpdateCell(editing.day, editing.slot, null);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Formula bar style footer */}
      <div className="border-t border-border bg-muted px-3 py-1.5 flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          {DAYS.reduce((acc, day) => acc + TIME_SLOTS.filter(s => grid[day]?.[s]).length, 0)} / {DAYS.length * TIME_SLOTS.length} slots filled
        </span>
        <div className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <span key={cat.value} className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className={`w-2.5 h-2.5 rounded-sm ${cat.color}`} />
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
