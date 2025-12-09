
import React from 'react';

interface ChartData {
  date: number;
  value: number;
}

interface MiniChartProps {
  data: ChartData[];
  color?: string;
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({ data, color = '#00AFFF', height = 100 }) => {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900/50 rounded-lg border border-dashed border-zinc-800 text-xs text-zinc-600 font-mono p-4">
        Dados insuficientes para gráfico
      </div>
    );
  }

  // Ordenar por data
  const sortedData = [...data].sort((a, b) => a.date - b.date);
  
  // Encontrar min/max para escalar
  const minVal = Math.min(...sortedData.map(d => d.value));
  const maxVal = Math.max(...sortedData.map(d => d.value));
  const range = maxVal - minVal || 1;

  const width = 100; // SVG coordinate space %
  
  // Criar pontos do SVG
  const points = sortedData.map((d, i) => {
    const x = (i / (sortedData.length - 1)) * 100; // 0 a 100
    // Inverter Y (SVG 0 é topo)
    // Deixar 10% de margem em cima e embaixo
    const normalizedVal = (d.value - minVal) / range;
    const y = 90 - (normalizedVal * 80); 
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${points} 100,100 0,100`;

  return (
    <div className="w-full relative" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {/* Gradient Def */}
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <polygon points={areaPoints} fill="url(#chartGradient)" />

        {/* Line */}
        <polyline 
            points={points} 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        {/* Dots */}
        {sortedData.map((d, i) => {
           const x = (i / (sortedData.length - 1)) * 100;
           const normalizedVal = (d.value - minVal) / range;
           const y = 90 - (normalizedVal * 80);
           return (
               <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" stroke={color} strokeWidth="0.5" />
           );
        })}
      </svg>
      
      {/* Labels Overlay */}
      <div className="absolute top-0 right-0 text-[10px] font-bold text-white bg-black/50 px-1 rounded">Max: {maxVal}</div>
      <div className="absolute bottom-0 right-0 text-[10px] font-bold text-zinc-500 bg-black/50 px-1 rounded">Min: {minVal}</div>
    </div>
  );
};
