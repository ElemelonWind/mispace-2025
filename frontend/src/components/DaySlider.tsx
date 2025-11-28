interface DaySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function DaySlider({ value, onChange }: DaySliderProps) {
  const days = [
    { value: 0, label: 'Today' },
    { value: 1, label: '+1 Day' },
    { value: 2, label: '+2 Days' },
    { value: 3, label: '+3 Days' },
  ];

  return (
    <div className="space-y-2">
      <label className="text-slate-300">Forecast Day</label>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="3"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between mt-2">
          {days.map((day) => (
            <button
              key={day.value}
              onClick={() => onChange(day.value)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                value === day.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
