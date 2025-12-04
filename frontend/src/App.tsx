import { useState, useEffect } from 'react';
import { IceMapViewer } from './components/IceMapViewer';
import { DaySlider } from './components/DaySlider';
import { OverlayControls } from './components/OverlayControls';
import { NarrativePanel } from './components/NarrativePanel';
import { flipGridDataVertically, generateMockGridData, generateAssetPositions } from './utils';
import ice24 from './files/ice_concentration_24h_flipped.json';
import ice48 from './files/ice_concentration_48h_flipped.json';
import ice72 from './files/ice_concentration_72h_flipped.json';
import ice96 from './files/ice_concentration_96h_flipped.json';

export default function App() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [overlays, setOverlays] = useState({
    heavyIcebreaker: true,
    harborTugs: true,
    buoyTenders: true,
  });

  const [gridData, setGridData] = useState<Record<number, number[][]>>({
    0: generateMockGridData(0),
    1: generateMockGridData(1),
    2: generateMockGridData(2),
    3: generateMockGridData(3),
  });

  const assetPositions = generateAssetPositions(selectedDay);

  const toggleOverlay = (overlay: keyof typeof overlays) => {
    setOverlays(prev => ({
      ...prev,
      [overlay]: !prev[overlay],
    }));
  };

  // Load the files once on mount
  useEffect(() => {
    const parsed = {
      0: flipGridDataVertically(ice24),
      1: flipGridDataVertically(ice48),
      2: flipGridDataVertically(ice72),
      3: flipGridDataVertically(ice96),
    };
    setGridData(parsed);
  }, []);

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
            gridData={gridData[selectedDay]}
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
