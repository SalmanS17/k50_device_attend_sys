import { format, subDays } from "date-fns";

interface DateFilterProps {
  value: string;
  onChange: (date: string) => void;
}

export default function DateFilter({ value, onChange }: DateFilterProps) {
  const presets = [
    { label: "Today", value: format(new Date(), "yyyy-MM-dd") },
    { label: "Yesterday", value: format(subDays(new Date(), 1), "yyyy-MM-dd") },
    { label: "All", value: "" },
  ];

  return (
    <div className="flex items-center gap-2">
      {presets.map((preset) => (
        <button
          key={preset.label}
          onClick={() => onChange(preset.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            value === preset.value
              ? "bg-primary/15 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          {preset.label}
        </button>
      ))}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 rounded-md text-xs bg-muted border border-border text-foreground font-mono"
      />
    </div>
  );
}
