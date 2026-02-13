import { FileSpreadsheet, Plus, Trash2, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExcelToolbarProps {
  onClearAll: () => void;
  onAutoFill: () => void;
  activeTab: "grid" | "analysis" | "history";
  onTabChange: (tab: "grid" | "analysis" | "history") => void;
}

export function ExcelToolbar({ onClearAll, onAutoFill, activeTab, onTabChange }: ExcelToolbarProps) {
  return (
    <div className="bg-card border-b border-border">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-gradient-to-r from-primary to-primary/80">
        <FileSpreadsheet className="w-5 h-5 text-primary-foreground" />
        <span className="text-sm font-bold text-primary-foreground tracking-wide">
          Routine Planner
        </span>
        <span className="text-xs text-primary-foreground/60 ml-1">— Build Your Empire</span>
      </div>
      
      {/* Tab bar */}
      <div className="flex items-center border-b border-border bg-muted/50">
        {([
          { key: "grid" as const, label: "📋 Schedule" },
          { key: "analysis" as const, label: "📊 Analysis" },
          { key: "history" as const, label: "📈 History" },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-5 py-2 text-sm font-medium border-r border-border transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground border-b-2 border-b-primary shadow-sm"
                : "text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
          💾 Auto-saved • Click any cell to add activity
        </span>
      </div>
    </div>
  );
}
