import { RoutineGrid, createEmptyGrid, DAYS, TIME_SLOTS } from "./routineTypes";

const GRID_KEY = "routine_grid";
const HISTORY_KEY = "routine_history";

export interface DaySnapshot {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  filledSlots: number;
  totalSlots: number;
  categories: Record<string, number>;
}

export function saveGrid(grid: RoutineGrid) {
  try {
    localStorage.setItem(GRID_KEY, JSON.stringify(grid));
  } catch {}
}

export function loadGrid(): RoutineGrid {
  try {
    const raw = localStorage.getItem(GRID_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return createEmptyGrid();
}

export function saveSnapshot(grid: RoutineGrid) {
  const today = new Date().toISOString().slice(0, 10);
  const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });
  
  const categories: Record<string, number> = {};
  let filledSlots = 0;

  for (const day of DAYS) {
    for (const slot of TIME_SLOTS) {
      const entry = grid[day]?.[slot];
      if (entry) {
        filledSlots++;
        categories[entry.category] = (categories[entry.category] || 0) + 1;
      }
    }
  }

  const snapshot: DaySnapshot = {
    date: today,
    dayOfWeek,
    filledSlots,
    totalSlots: DAYS.length * TIME_SLOTS.length,
    categories,
  };

  const history = loadHistory();
  // Replace today's snapshot if exists
  const idx = history.findIndex(s => s.date === today);
  if (idx >= 0) history[idx] = snapshot;
  else history.push(snapshot);
  
  // Keep last 90 days
  const trimmed = history.slice(-90);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function loadHistory(): DaySnapshot[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
