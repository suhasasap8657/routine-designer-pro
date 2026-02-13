import { useState } from "react";
import { Category, CATEGORIES, RoutineEntry } from "@/lib/routineTypes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

interface CellEditorProps {
  day: string;
  timeSlot: string;
  existing: RoutineEntry | null;
  onSave: (entry: RoutineEntry) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function CellEditor({ day, timeSlot, existing, onSave, onDelete, onClose }: CellEditorProps) {
  const [activity, setActivity] = useState(existing?.activity || "");
  const [category, setCategory] = useState<Category>(existing?.category || "work");

  const handleSave = () => {
    if (!activity.trim()) return;
    onSave({
      id: existing?.id || `${day}-${timeSlot}-${Date.now()}`,
      activity: activity.trim(),
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-sm shadow-lg w-80 animate-cell-pop" onClick={e => e.stopPropagation()}>
        <div className="bg-primary px-3 py-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-primary-foreground">
            {day} — {timeSlot}
          </span>
          <button onClick={onClose} className="text-primary-foreground/70 hover:text-primary-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Activity</label>
            <Input
              value={activity}
              onChange={e => setActivity(e.target.value)}
              placeholder="e.g. Team standup"
              className="h-8 text-sm"
              autoFocus
              onKeyDown={e => e.key === "Enter" && handleSave()}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`text-xs px-2 py-1.5 rounded-sm border transition-all ${
                    category === cat.value
                      ? `${cat.color} text-primary-foreground border-transparent font-medium`
                      : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleSave} className="flex-1 h-7 text-xs gap-1">
              <Check className="w-3.5 h-3.5" /> Save
            </Button>
            {existing && (
              <Button size="sm" variant="destructive" onClick={onDelete} className="h-7 text-xs">
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
