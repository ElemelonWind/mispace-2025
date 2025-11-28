interface OverlayControlsProps {
  overlays: {
    heavyIcebreaker: boolean;
    harborTugs: boolean;
    buoyTenders: boolean;
  };
  onToggle: (overlay: keyof OverlayControlsProps['overlays']) => void;
}

export function OverlayControls({ overlays, onToggle }: OverlayControlsProps) {
  return (
    <div className="space-y-2">
      <label className="text-slate-300">USCG Assets</label>
      <div className="flex gap-4">
        <ToggleButton
          label="Heavy Icebreaker (1)"
          checked={overlays.heavyIcebreaker}
          onChange={() => onToggle('heavyIcebreaker')}
        />
        <ToggleButton
          label="Harbor Tugs (6)"
          checked={overlays.harborTugs}
          onChange={() => onToggle('harborTugs')}
        />
        <ToggleButton
          label="Buoy Tenders (2)"
          checked={overlays.buoyTenders}
          onChange={() => onToggle('buoyTenders')}
        />
      </div>
    </div>
  );
}

interface ToggleButtonProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleButton({ label, checked, onChange }: ToggleButtonProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </div>
      <span className="text-slate-300 text-sm">{label}</span>
    </label>
  );
}
