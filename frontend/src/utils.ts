export interface AssetPositions {
    heavyIcebreaker: { x: number; y: number; label: string }[];
    harborTugs: { x: number; y: number }[];
    buoyTenders: { x: number; y: number; label: string }[];
  }
  
  // Generate 1024x1024 grid of values
  // Negative: ice coverage (-1 = 100%, -0.5 = 50%)
  // Positive: water temperature in °C
  export function generateMockGridData(day: number): number[][] {
    const grid: number[][] = [];
    const size = 1024;
  
    for (let y = 0; y < size; y++) {
      const row: number[] = [];
      for (let x = 0; x < size; x++) {
        // Normalize coordinates
        const nx = x / size;
        const ny = y / size;
  
        // Define Great Lakes regions (simplified)
        let value = 5; // Default water temp (5°C)
  
        // Lake Superior region (top left)
        if (isInLakeSuperior(nx, ny)) {
          // More ice in Lake Superior, increasing over days
          const iceIntensity = 0.3 + (day * 0.15);
          const distanceFromCenter = Math.sqrt(Math.pow(nx - 0.25, 2) + Math.pow(ny - 0.3, 2));
          
          if (distanceFromCenter < 0.15) {
            // Heavy ice in center
            value = -0.7 - (day * 0.1);
          } else if (distanceFromCenter < 0.2) {
            // Moderate ice
            value = -0.4 - (day * 0.08);
          } else {
            // Cold water or light ice
            value = Math.random() < iceIntensity ? -0.2 - (day * 0.05) : 1 + Math.random() * 2;
          }
        }
        // Lake Michigan region (left center)
        else if (isInLakeMichigan(nx, ny)) {
          const iceIntensity = 0.15 + (day * 0.1);
          value = Math.random() < iceIntensity ? -0.3 - (day * 0.05) : 3 + Math.random() * 3;
        }
        // Lake Huron region (center)
        else if (isInLakeHuron(nx, ny)) {
          const iceIntensity = 0.25 + (day * 0.12);
          value = Math.random() < iceIntensity ? -0.5 - (day * 0.07) : 2 + Math.random() * 3;
        }
        // Lake Erie region (bottom center)
        else if (isInLakeErie(nx, ny)) {
          const iceIntensity = 0.2 + (day * 0.1);
          const distanceFromCenter = Math.sqrt(Math.pow(nx - 0.6, 2) + Math.pow(ny - 0.7, 2));
          
          if (distanceFromCenter < 0.1) {
            value = -0.4 - (day * 0.08);
          } else {
            value = Math.random() < iceIntensity ? -0.25 - (day * 0.05) : 4 + Math.random() * 3;
          }
        }
        // Lake Ontario region (bottom right)
        else if (isInLakeOntario(nx, ny)) {
          const iceIntensity = 0.15 + (day * 0.08);
          value = Math.random() < iceIntensity ? -0.3 - (day * 0.05) : 4 + Math.random() * 4;
        }
        // Land - use a special value outside range
        else {
          value = 100; // Land marker
        }
  
        row.push(value);
      }
      grid.push(row);
    }
  
    return grid;
  }
  
  function isInLakeSuperior(nx: number, ny: number): boolean {
    // Elliptical region for Lake Superior
    const cx = 0.25, cy = 0.3, rx = 0.18, ry = 0.12;
    return Math.pow((nx - cx) / rx, 2) + Math.pow((ny - cy) / ry, 2) < 1;
  }
  
  function isInLakeMichigan(nx: number, ny: number): boolean {
    // Vertical ellipse for Lake Michigan
    const cx = 0.22, cy = 0.6, rx = 0.08, ry = 0.18;
    return Math.pow((nx - cx) / rx, 2) + Math.pow((ny - cy) / ry, 2) < 1;
  }
  
  function isInLakeHuron(nx: number, ny: number): boolean {
    // Central region for Lake Huron
    const cx = 0.45, cy = 0.5, rx = 0.12, ry = 0.15;
    return Math.pow((nx - cx) / rx, 2) + Math.pow((ny - cy) / ry, 2) < 1;
  }
  
  function isInLakeErie(nx: number, ny: number): boolean {
    // Horizontal ellipse for Lake Erie
    const cx = 0.6, cy = 0.7, rx = 0.16, ry = 0.06;
    return Math.pow((nx - cx) / rx, 2) + Math.pow((ny - cy) / ry, 2) < 1;
  }
  
  function isInLakeOntario(nx: number, ny: number): boolean {
    // Smaller horizontal ellipse for Lake Ontario
    const cx = 0.78, cy = 0.65, rx = 0.1, ry = 0.05;
    return Math.pow((nx - cx) / rx, 2) + Math.pow((ny - cy) / ry, 2) < 1;
  }
  
  export function generateAssetPositions(day: number): AssetPositions {
    // Positions in 1024x1024 grid coordinates
    // USCGC Mackinaw moves to areas of heavy ice over time
    const mackinawPositions = [
      { x: 456, y: 420, label: 'MACKINAW' }, // Day 0: Near Sault Ste. Marie (Huron)
      { x: 380, y: 450, label: 'MACKINAW' }, // Day 1: Moving toward Lake Huron center
      { x: 280, y: 340, label: 'MACKINAW' }, // Day 2: Lake Superior entrance
      { x: 220, y: 300, label: 'MACKINAW' }, // Day 3: Western Lake Superior
    ];
  
    // 6 harbor tugs at major ports (relatively fixed positions)
    const harborTugs = [
      { x: 173, y: 268 },  // Duluth (Lake Superior)
      { x: 410, y: 473 },  // Chicago (Lake Michigan)
      { x: 630, y: 567 },  // Sault Ste. Marie (between Superior and Huron)
      { x: 677, y: 710 },  // Detroit (Lake Erie)
      { x: 320, y: 757 },  // Cleveland (Lake Erie)
      { x: 820, y: 660 },  // Buffalo (Lake Ontario)
    ];
  
    // 2 buoy tenders - positioned in thinner ice areas
    const buoyTenders = [
      { x: 496, y: 320, label: 'BT-1' }, // Lake Huron
      { x: 827, y: 655, label: 'BT-2' }, // Lake Ontario
    ];
  
    return {
      heavyIcebreaker: [mackinawPositions[day]],
      harborTugs,
      buoyTenders,
    };
  }

  export function flipGridDataVertically(gridData: number[][]): number[][] {
    const flippedData: number[][] = [];
    const numRows = gridData.length;
    for (let y = numRows - 1; y >= 0; y--) {
      flippedData.push([...gridData[y]]);
    }
    return flippedData;
  }