import { useRef, useState, useMemo } from 'react';
import type { AllocationEntry, ServiceEntry } from '../types';
import { formatFrequency, bandwidthColor } from '../utils/frequency';
import { translateService } from '../utils/translations';

interface Props {
  allocations: AllocationEntry[];
  freqMin: number | null;
  freqMax: number | null;
  serviceFilter: string;
}

interface FlatBand {
  lf: number;
  uf: number;
  subTable: string;
  services: ServiceEntry[];
  footnotes?: string[];
}

export default function SpectrumChart({ allocations, freqMin, freqMax, serviceFilter }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<FlatBand | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const flatBands = useMemo(() => {
    const result: FlatBand[] = [];
    for (const entry of allocations) {
      for (const band of entry.bands) {
        if (!band.services || band.services.length === 0) continue;
        const svcs = band.services;
        if (serviceFilter) {
          const match = svcs.some(s => s.desc === serviceFilter);
          if (!match) continue;
        }
        result.push({
          lf: band.lf,
          uf: band.uf,
          subTable: entry.name,
          services: svcs,
          footnotes: band.footnotes,
        });
      }
    }
    return result;
  }, [allocations, serviceFilter]);

  // Compute frequency bounds
  const { dataMin, dataMax } = useMemo(() => {
    if (flatBands.length === 0) return { dataMin: 1e4, dataMax: 3e11 };
    const min = freqMin ?? Math.min(...flatBands.map(b => b.lf), 1e4);
    const max = freqMax ?? Math.max(...flatBands.map(b => b.uf), 3e11);
    return { dataMin: Math.max(min, 1), dataMax: Math.min(max, 1e12) };
  }, [flatBands, freqMin, freqMax]);

  // Filter bands by frequency range
  const visibleBands = useMemo(() => {
    return flatBands.filter(b => b.uf >= dataMin && b.lf <= dataMax);
  }, [flatBands, dataMin, dataMax]);

  // Logarithmic mapping
  const logMin = Math.log10(dataMin);
  const logMax = Math.log10(dataMax);
  const logRange = logMax - logMin || 1;

  const freqToX = (hz: number) => {
    const clamped = Math.max(hz, dataMin);
    return ((Math.log10(clamped) - logMin) / logRange) * 100;
  };

  // SVG dimensions
  const margin = { top: 20, right: 20, bottom: 40, left: 110 };
  const chartWidth = 900;
  const chartHeight = Math.max(300, visibleBands.length * 28 + margin.top + margin.bottom);
  const svgWidth = chartWidth + margin.left + margin.right;
  const svgHeight = chartHeight;
  const plotWidth = chartWidth - margin.left - margin.right;

  // Generate frequency axis ticks
  const ticks = useMemo(() => {
    const t: { value: number; label: string }[] = [];
    const steps = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12];
    for (const hz of steps) {
      if (hz >= dataMin && hz <= dataMax) {
        t.push({ value: hz, label: formatFrequency(hz) });
      }
    }
    return t;
  }, [dataMin, dataMax]);

  if (allocations.length === 0) return null;
  if (visibleBands.length === 0) {
    return <div className="empty-state">所选范围内无匹配频段</div>;
  }

  return (
    <div className="chart-container" ref={containerRef}>
      <h3 className="chart-title">频谱分配图</h3>
      <div className="chart-wrapper" style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '500px' }}>
        <svg width={svgWidth} height={svgHeight} className="spectrum-svg">
          {/* Frequency axis */}
          <g transform={`translate(${margin.left}, 0)`}>
            {/* X-axis line */}
            <line x1={0} y1={margin.top} x2={plotWidth} y2={margin.top} stroke="#ccc" />
            {/* Ticks */}
            {ticks.map(t => {
              const x = freqToX(t.value) * plotWidth / 100;
              return (
                <g key={t.value} transform={`translate(${x}, ${margin.top})`}>
                  <line y1={-5} y2={0} stroke="#999" />
                  <text y={16} textAnchor="middle" fontSize={11} fill="#666">{t.label}</text>
                </g>
              );
            })}
            {/* Axis label */}
            <text x={plotWidth / 2} y={margin.top + 32} textAnchor="middle" fontSize={12} fill="#888">
              频率（对数刻度）
            </text>
          </g>

          {/* Bands */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {visibleBands.map((band, i) => {
              const x = Math.max(0, freqToX(band.lf) * plotWidth / 100);
              const w = Math.max(2, freqToX(band.uf) * plotWidth / 100 - x);
              const y = i * 28;
              const h = 22;
              const color = bandwidthColor(band.services[0]?.cat || '', band.services[0]?.desc || '');

              return (
                <g
                  key={`${band.lf}-${band.uf}-${i}`}
                  className="band-group"
                  onMouseEnter={e => {
                    setHovered(band);
                    const rect = containerRef.current?.getBoundingClientRect();
                    setTooltipPos({
                      x: e.clientX - (rect?.left ?? 0) + 12,
                      y: e.clientY - (rect?.top ?? 0) - 10,
                    });
                  }}
                  onMouseMove={e => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    setTooltipPos({
                      x: e.clientX - (rect?.left ?? 0) + 12,
                      y: e.clientY - (rect?.top ?? 0) - 10,
                    });
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx={3}
                    fill={color}
                    opacity={band.services[0]?.cat === 's' ? 0.5 : 0.85}
                    stroke={band.services[0]?.cat === 's' ? color : 'none'}
                    strokeWidth={1}
                    strokeDasharray={band.services[0]?.cat === 's' ? '4 2' : 'none'}
                  />
                  {w > 80 && (
                    <text
                      x={x + 6}
                      y={y + h / 2 + 1}
                      fontSize={11}
                      fill="#fff"
                      dominantBaseline="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {translateService(band.services[0]?.desc || '')}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="chart-tooltip"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="tooltip-freq">
            {formatFrequency(hovered.lf)} – {formatFrequency(hovered.uf)}
          </div>
          <div className="tooltip-services">
            {hovered.services.map((s, i) => (
              <div key={i} className="tooltip-service">
                <span
                  className="tooltip-badge"
                  style={{ backgroundColor: bandwidthColor(s.cat, s.desc) }}
                />
                {translateService(s.desc)}
                <span className="tooltip-cat">
                  {s.cat === 'p' ? ' [主要]' : s.cat === 's' ? ' [次要]' : ''}
                </span>
              </div>
            ))}
          </div>
          {hovered.subTable !== '-' && (
            <div className="tooltip-sub">{hovered.subTable}</div>
          )}
        </div>
      )}
    </div>
  );
}
