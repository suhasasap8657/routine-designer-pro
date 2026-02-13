import { useState, useCallback } from "react";
import { ExcelToolbar } from "@/components/ExcelToolbar";
import { RoutineGridView } from "@/components/RoutineGrid";
import { RoutineAnalysis } from "@/components/RoutineAnalysis";
import { createEmptyGrid, RoutineGrid, RoutineEntry, DAYS, TIME_SLOTS } from "@/lib/routineTypes";

const SAMPLE_DATA: { day: string; slot: string; entry: RoutineEntry }[] = [
  { day: "Monday", slot: "06:00", entry: { id: "1", activity: "Wake up / Stretch", category: "personal" } },
  { day: "Monday", slot: "07:00", entry: { id: "2", activity: "Breakfast", category: "meals" } },
  { day: "Monday", slot: "08:00", entry: { id: "3", activity: "Deep Work", category: "work" } },
  { day: "Monday", slot: "09:00", entry: { id: "4", activity: "Team Standup", category: "work" } },
  { day: "Monday", slot: "10:00", entry: { id: "5", activity: "Project Tasks", category: "work" } },
  { day: "Monday", slot: "11:00", entry: { id: "6", activity: "Code Review", category: "work" } },
  { day: "Monday", slot: "12:00", entry: { id: "7", activity: "Lunch", category: "meals" } },
  { day: "Monday", slot: "13:00", entry: { id: "8", activity: "Study Session", category: "study" } },
  { day: "Monday", slot: "14:00", entry: { id: "9", activity: "Meetings", category: "work" } },
  { day: "Monday", slot: "15:00", entry: { id: "10", activity: "Break", category: "break" } },
  { day: "Monday", slot: "16:00", entry: { id: "11", activity: "Gym", category: "exercise" } },
  { day: "Monday", slot: "17:00", entry: { id: "12", activity: "Dinner Prep", category: "meals" } },
  { day: "Monday", slot: "18:00", entry: { id: "13", activity: "Reading", category: "personal" } },
  { day: "Monday", slot: "21:00", entry: { id: "14", activity: "Sleep", category: "sleep" } },
  { day: "Monday", slot: "22:00", entry: { id: "15", activity: "Sleep", category: "sleep" } },
  { day: "Tuesday", slot: "06:00", entry: { id: "16", activity: "Morning Run", category: "exercise" } },
  { day: "Tuesday", slot: "07:00", entry: { id: "17", activity: "Breakfast", category: "meals" } },
  { day: "Tuesday", slot: "08:00", entry: { id: "18", activity: "Deep Work", category: "work" } },
  { day: "Tuesday", slot: "09:00", entry: { id: "19", activity: "Client Call", category: "work" } },
  { day: "Tuesday", slot: "12:00", entry: { id: "20", activity: "Lunch", category: "meals" } },
  { day: "Tuesday", slot: "16:00", entry: { id: "21", activity: "Yoga", category: "exercise" } },
  { day: "Wednesday", slot: "08:00", entry: { id: "22", activity: "Sprint Planning", category: "work" } },
  { day: "Wednesday", slot: "09:00", entry: { id: "23", activity: "Development", category: "work" } },
  { day: "Wednesday", slot: "10:00", entry: { id: "24", activity: "Development", category: "work" } },
  { day: "Wednesday", slot: "12:00", entry: { id: "25", activity: "Lunch", category: "meals" } },
  { day: "Wednesday", slot: "15:00", entry: { id: "26", activity: "Study", category: "study" } },
  { day: "Thursday", slot: "07:00", entry: { id: "27", activity: "Gym", category: "exercise" } },
  { day: "Thursday", slot: "08:00", entry: { id: "28", activity: "Work", category: "work" } },
  { day: "Thursday", slot: "12:00", entry: { id: "29", activity: "Lunch", category: "meals" } },
  { day: "Friday", slot: "08:00", entry: { id: "30", activity: "Wrap-up", category: "work" } },
  { day: "Friday", slot: "12:00", entry: { id: "31", activity: "Lunch", category: "meals" } },
  { day: "Friday", slot: "15:00", entry: { id: "32", activity: "Free Time", category: "personal" } },
  { day: "Saturday", slot: "09:00", entry: { id: "33", activity: "Hiking", category: "exercise" } },
  { day: "Saturday", slot: "12:00", entry: { id: "34", activity: "Brunch", category: "meals" } },
  { day: "Sunday", slot: "10:00", entry: { id: "35", activity: "Meal Prep", category: "meals" } },
  { day: "Sunday", slot: "14:00", entry: { id: "36", activity: "Study", category: "study" } },
  { day: "Sunday", slot: "21:00", entry: { id: "37", activity: "Sleep", category: "sleep" } },
  { day: "Sunday", slot: "22:00", entry: { id: "38", activity: "Sleep", category: "sleep" } },
];

const Index = () => {
  const [grid, setGrid] = useState<RoutineGrid>(createEmptyGrid);
  const [activeTab, setActiveTab] = useState<"grid" | "analysis">("grid");

  const handleUpdateCell = useCallback((day: string, slot: string, entry: RoutineEntry | null) => {
    setGrid(prev => ({
      ...prev,
      [day]: { ...prev[day], [slot]: entry },
    }));
  }, []);

  const handleClearAll = useCallback(() => setGrid(createEmptyGrid()), []);

  const handleAutoFill = useCallback(() => {
    const newGrid = createEmptyGrid();
    for (const item of SAMPLE_DATA) {
      newGrid[item.day][item.slot] = item.entry;
    }
    setGrid(newGrid);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ExcelToolbar
        onClearAll={handleClearAll}
        onAutoFill={handleAutoFill}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === "grid" ? (
        <RoutineGridView grid={grid} onUpdateCell={handleUpdateCell} />
      ) : (
        <RoutineAnalysis grid={grid} />
      )}
    </div>
  );
};

export default Index;
