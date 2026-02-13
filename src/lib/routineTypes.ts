export type Category = 
  | "work" 
  | "exercise" 
  | "meals" 
  | "sleep" 
  | "personal" 
  | "study" 
  | "break" 
  | "other";

export interface RoutineEntry {
  id: string;
  activity: string;
  category: Category;
}

export interface RoutineGrid {
  [day: string]: {
    [timeSlot: string]: RoutineEntry | null;
  };
}

export const CATEGORIES: { value: Category; label: string; color: string }[] = [
  { value: "work", label: "Work", color: "bg-cat-work" },
  { value: "exercise", label: "Exercise", color: "bg-cat-exercise" },
  { value: "meals", label: "Meals", color: "bg-cat-meals" },
  { value: "sleep", label: "Sleep", color: "bg-cat-sleep" },
  { value: "personal", label: "Personal", color: "bg-cat-personal" },
  { value: "study", label: "Study", color: "bg-cat-study" },
  { value: "break", label: "Break", color: "bg-cat-break" },
  { value: "other", label: "Other", color: "bg-cat-other" },
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
];

export function createEmptyGrid(): RoutineGrid {
  const grid: RoutineGrid = {};
  for (const day of DAYS) {
    grid[day] = {};
    for (const slot of TIME_SLOTS) {
      grid[day][slot] = null;
    }
  }
  return grid;
}

export function getCategoryStats(grid: RoutineGrid) {
  const stats: Record<Category, number> = {
    work: 0, exercise: 0, meals: 0, sleep: 0,
    personal: 0, study: 0, break: 0, other: 0,
  };
  
  for (const day of DAYS) {
    for (const slot of TIME_SLOTS) {
      const entry = grid[day]?.[slot];
      if (entry) {
        stats[entry.category]++;
      }
    }
  }
  return stats;
}

export function getDayStats(grid: RoutineGrid) {
  return DAYS.map(day => {
    const filled = TIME_SLOTS.filter(slot => grid[day]?.[slot] !== null).length;
    return { day: day.slice(0, 3), filled, total: TIME_SLOTS.length };
  });
}
