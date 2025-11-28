import { useEffect, useRef } from 'react';
import type { AssetPositions } from '../utils';

interface IceMapViewerProps {
  day: number;
  overlays: {
    heavyIcebreaker: boolean;
    harborTugs: boolean;
    buoyTenders: boolean;
  };
  gridData: number[][];
  assetPositions: AssetPositions;
}

export function IceMapViewer({ day, overlays, gridData, assetPositions }: IceMapViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    // Calculate square size based on smaller dimension
    const size = Math.min(canvasWidth, canvasHeight);
    const offsetX = (canvasWidth - size) / 2;
    const offsetY = (canvasHeight - size) / 2;

    // Clear canvas with background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Save context and translate to centered square
    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Draw grid data (ice coverage and water temperature)
    drawGridData(ctx, size, gridData, offsetX, offsetY);

    // Draw grid lines for reference
    drawGrid(ctx, size, size);

    // Draw USCG assets
    if (overlays.heavyIcebreaker) {
      drawHeavyIcebreaker(ctx, size, size, assetPositions.heavyIcebreaker);
    }
    
    if (overlays.harborTugs) {
      drawHarborTugs(ctx, size, size, assetPositions.harborTugs);
    }
    
    if (overlays.buoyTenders) {
      drawBuoyTenders(ctx, size, size, assetPositions.buoyTenders);
    }

    ctx.restore();

    // Draw legend (positioned relative to square)
    drawLegend(ctx, canvasWidth, canvasHeight, overlays);

  }, [day, overlays, gridData, assetPositions]);

  return (
    <div className="w-full h-full relative bg-slate-900">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded border border-slate-700">
        <p className="text-white">
          Forecast Day: <span className="text-blue-400">{day === 0 ? 'Today' : `+${day} Day${day > 1 ? 's' : ''}`}</span>
        </p>
      </div>
    </div>
  );
}

function drawGridData(ctx, cssSize, gridData, offsetX, offsetY) {
  const gridSize = gridData.length;
  const dpr = window.devicePixelRatio;

  const pixelSize = Math.floor(cssSize * dpr);
  const imageData = ctx.createImageData(pixelSize, pixelSize);
  const data = imageData.data;

  for (let py = 0; py < pixelSize; py++) {
    for (let px = 0; px < pixelSize; px++) {
      // Convert device pixel → CSS pixel → grid cell
      const x = px / dpr;
      const y = py / dpr;

      const gridX = Math.floor((x / cssSize) * gridSize);
      const gridY = Math.floor((y / cssSize) * gridSize);

      const pixelIndex = (py * pixelSize + px) * 4;

      const value = gridData[gridY][gridX];

      let r = 30, g = 41, b = 59, a = 255; // Default: dark slate (land)

      if (value === 100) {
        // Land
        r = 30; g = 41; b = 59;
      } else if (value < 0) {
        // Ice coverage (negative values)
        const iceCoverage = Math.abs(value); // 0 to 1
        // White ice with intensity based on coverage
        const intensity = 150 + (iceCoverage * 105); // 150-255
        r = intensity;
        g = intensity;
        b = 255; // Keep blue tint for ice
        a = Math.floor(150 + (iceCoverage * 105)); // More coverage = more opaque
      } else {
        // Water temperature (positive values)
        // Map temperature to color: cold (blue) to warm (cyan/green)
        const temp = Math.min(value, 10); // Cap at 10°C for color scale
        const normalized = temp / 10; // 0 to 1
        
        // Cold water: dark blue
        // Warmer water: lighter blue/cyan
        r = Math.floor(15 + (normalized * 50)); // 15-65
        g = Math.floor(30 + (normalized * 100)); // 30-130
        b = Math.floor(100 + (normalized * 100)); // 100-200
        a = 255;
      }

      data[pixelIndex]     = r;
      data[pixelIndex + 1] = g;
      data[pixelIndex + 2] = b;
      data[pixelIndex + 3] = a;
    }
  }

  ctx.putImageData(imageData, offsetX * window.devicePixelRatio, offsetY * window.devicePixelRatio);
}


function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Draw subtle grid lines
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  const gridLines = 10;
  for (let i = 0; i <= gridLines; i++) {
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, (height / gridLines) * i);
    ctx.lineTo(width, (height / gridLines) * i);
    ctx.stroke();
    
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo((width / gridLines) * i, 0);
    ctx.lineTo((width / gridLines) * i, height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawHeavyIcebreaker(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  positions: { x: number; y: number; label: string }[]
) {
  const scale = width / 1024; // Scale from 1024x1024 grid to canvas size

  positions.forEach(gridPos => {
    // Convert grid coordinates to canvas coordinates
    const x = gridPos.x * scale;
    const y = gridPos.y * scale;
    
    // Draw icebreaker icon
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    
    // Ship hull
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x + 15, y);
    ctx.lineTo(x + 15, y + 8);
    ctx.lineTo(x - 15, y + 8);
    ctx.lineTo(x - 15, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px sans-serif';
    ctx.fillText(gridPos.label, x - 28, y + 25);
  });
}

function drawHarborTugs(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  positions: { x: number; y: number }[]
) {
  const scale = width / 1024;

  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1.5;

  positions.forEach(gridPos => {
    const x = gridPos.x * scale;
    const y = gridPos.y * scale;
    
    // Small tug icon
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Direction indicator
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + 5, y - 11);
    ctx.lineTo(x - 5, y - 11);
    ctx.closePath();
    ctx.fill();
  });
}

function drawBuoyTenders(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  positions: { x: number; y: number; label: string }[]
) {
  const scale = width / 1024;

  ctx.fillStyle = '#10b981';
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 2;

  positions.forEach(gridPos => {
    const x = gridPos.x * scale;
    const y = gridPos.y * scale;
    
    // Tender icon (square with triangle)
    ctx.fillRect(x - 8, y - 4, 16, 8);
    ctx.strokeRect(x - 8, y - 4, 16, 8);
    
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x + 6, y - 4);
    ctx.lineTo(x - 6, y - 4);
    ctx.closePath();
    ctx.fill();
  });
}

function drawLegend(ctx: CanvasRenderingContext2D, width: number, height: number, overlays: any) {
  const legendX = width - 220;
  const legendY = height - 240;

  // Legend background
  ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
  ctx.fillRect(legendX, legendY, 210, 230);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  ctx.strokeRect(legendX, legendY, 210, 230);

  ctx.font = '14px sans-serif';
  ctx.fillStyle = '#f1f5f9';
  ctx.fillText('Legend', legendX + 10, legendY + 22);

  let yOffset = 50;
  
  // Ice coverage gradient
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '11px sans-serif';
  ctx.fillText('Ice Coverage', legendX + 10, legendY + yOffset);
  yOffset += 20;

  // Draw ice gradient
  const gradientWidth = 190;
  const gradientHeight = 12;
  for (let i = 0; i < gradientWidth; i++) {
    const coverage = i / gradientWidth;
    const intensity = 150 + (coverage * 105);
    ctx.fillStyle = `rgba(${intensity}, ${intensity}, 255, ${0.6 + coverage * 0.4})`;
    ctx.fillRect(legendX + 10 + i, legendY + yOffset - 8, 1, gradientHeight);
  }
  
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '9px sans-serif';
  ctx.fillText('0%', legendX + 10, legendY + yOffset + 10);
  ctx.fillText('100%', legendX + 175, legendY + yOffset + 10);
  yOffset += 30;

  // Water temperature gradient
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '11px sans-serif';
  ctx.fillText('Water Temperature', legendX + 10, legendY + yOffset);
  yOffset += 20;

  // Draw temperature gradient
  for (let i = 0; i < gradientWidth; i++) {
    const normalized = i / gradientWidth;
    const r = Math.floor(15 + (normalized * 50));
    const g = Math.floor(30 + (normalized * 100));
    const b = Math.floor(100 + (normalized * 100));
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(legendX + 10 + i, legendY + yOffset - 8, 1, gradientHeight);
  }
  
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '9px sans-serif';
  ctx.fillText('0°C', legendX + 10, legendY + yOffset + 10);
  ctx.fillText('10°C', legendX + 170, legendY + yOffset + 10);
  yOffset += 35;

  // Asset icons
  const assetItems = [
    { color: '#ef4444', label: 'Heavy Icebreaker', show: overlays.heavyIcebreaker, type: 'ship' },
    { color: '#f59e0b', label: 'Harbor Tug', show: overlays.harborTugs, type: 'circle' },
    { color: '#10b981', label: 'Buoy Tender', show: overlays.buoyTenders, type: 'square' },
  ];

  assetItems.forEach(item => {
    if (item.show) {
      ctx.fillStyle = item.color;
      
      if (item.type === 'ship') {
        // Ship icon
        ctx.beginPath();
        ctx.moveTo(legendX + 15, legendY + yOffset - 10);
        ctx.lineTo(legendX + 25, legendY + yOffset - 5);
        ctx.lineTo(legendX + 25, legendY + yOffset);
        ctx.lineTo(legendX + 5, legendY + yOffset);
        ctx.lineTo(legendX + 5, legendY + yOffset - 5);
        ctx.closePath();
        ctx.fill();
      } else if (item.type === 'circle') {
        ctx.beginPath();
        ctx.arc(legendX + 15, legendY + yOffset - 5, 7, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === 'square') {
        ctx.fillRect(legendX + 9, legendY + yOffset - 9, 12, 8);
      }
      
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '11px sans-serif';
      ctx.fillText(item.label, legendX + 40, legendY + yOffset);
      yOffset += 25;
    }
  });
}
