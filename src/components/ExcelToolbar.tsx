import { FileSpreadsheet, Plus, Trash2, Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExcelToolbarProps {
  onClearAll: () => void;
  onAutoFill: () => void;
  activeTab: "grid" | "analysis";
  onTabChange: (tab: "grid" | "analysis") => void;
}

export function ExcelToolbar({ onClearAll, onAutoFill, activeTab, onTabChange }: ExcelToolbarProps) {
  return (
    <div className="bg-card border-b border-border">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-primary">
        <FileSpreadsheet className="w-5 h-5 text-primary-foreground" />
        <span className="text-sm font-semibold text-primary-foreground tracking-wide">
          Routine Planner
        </span>
        <span className="text-xs text-primary-foreground/70 ml-1">— Weekly Schedule</span>
      </div>
      
      {/* Tab bar */}
      <div className="flex items-center border-b border-border">
        <button
          onClick={() => onTabChange("grid")}
          className={`px-4 py-1.5 text-sm font-medium border-r border-border transition-colors ${
            activeTab === "grid"
              ? "bg-card text-foreground border-b-2 border-b-primary"
              : "bg-muted text-muted-foreground hover:bg-card"
          }`}
        >
          📋 Schedule
        </button>
        <button
          onClick={() => onTabChange("analysis")}
          className={`px-4 py-1.5 text-sm font-medium border-r border-border transition-colors ${
            activeTab === "analysis"
              ? "bg-card text-foreground border-b-2 border-b-primary"
              : "bg-muted text-muted-foreground hover:bg-card"
          }`}
        >
          📊 Analysis
        </button>
      </div>

      {/* Action toolbar */}
      <div className="excel-toolbar">
        <Button variant="ghost" size="sm" onClick={onAutoFill} className="text-xs h-7 gap-1">
          <Plus className="w-3.5 h-3.5" />
          Auto-Fill Sample
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-7 gap-1 text-destructive hover:text-destructive">
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </Button>
        <div className="flex-1" />
        <span className="text-xs text-muted-foreground font-mono-data">
          Click any cell to add activity
        </span>
      </div>
    </div>
  );
}
