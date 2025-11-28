import { useState } from 'react';
import { IceMapViewer } from './components/IceMapViewer';
import { DaySlider } from './components/DaySlider';
import { OverlayControls } from './components/OverlayControls';
import { NarrativePanel } from './components/NarrativePanel';
import { generateMockGridData, generateMockAssetPositions } from './utils';

export default function App() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [overlays, setOverlays] = useState({
    heavyIcebreaker: true,
    harborTugs: true,
    buoyTenders: true,
  });
  const gridData = generateMockGridData(selectedDay);
  const assetPositions = generateMockAssetPositions(selectedDay);

  const toggleOverlay = (overlay: keyof typeof overlays) => {
    setOverlays(prev => ({
      ...prev,
      [overlay]: !prev[overlay],
    }));
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white">Great Lakes Ice Forecast System</h1>
              <p className="text-slate-400 text-sm">USNIC - USCG Operational Dashboard</p>
            </div>
          </div>
        </header>

        {/* Map Viewer */}
        <div className="flex-1 relative">
          <IceMapViewer 
            day={selectedDay} 
            overlays={overlays}
            gridData={gridData}
            assetPositions={assetPositions}
          />
        </div>

        {/* Controls */}
        <div className="bg-slate-800 border-t border-slate-700 px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <DaySlider value={selectedDay} onChange={setSelectedDay} />
            <OverlayControls overlays={overlays} onToggle={toggleOverlay} />
          </div>
        </div>
      </div>

      {/* Narrative Side Panel */}
      <NarrativePanel day={selectedDay} />
    </div>
  );
}
