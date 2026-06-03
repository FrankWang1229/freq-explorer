import { useState, useEffect, useMemo } from 'react';
import { formatFrequency } from '../utils/frequency';

interface OperatorBand {
  band: string;
  tech: string;
  duplex: string;
  freq: string;
  freqUp: number;
  freqDown: number;
  bw: string;
  note: string;
}

interface Operator {
  operator: string;
  nameEn: string;
  color: string;
  bands: OperatorBand[];
}

export default function OperatorBands() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOp, setSelectedOp] = useState<string>('');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}custom/operator-bands/cn.json`)
      .then(res => res.json())
      .then(data => {
        setOperators(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allBands = useMemo(() => {
    const result: (OperatorBand & { operator: string; color: string })[] = [];
    for (const op of operators) {
      for (const band of op.bands) {
        if (selectedOp && op.operator !== selectedOp) continue;
        result.push({ ...band, operator: op.operator, color: op.color });
      }
    }
    return result.sort((a, b) => a.freqUp - b.freqUp);
  }, [operators, selectedOp]);

  // Frequency range for visualization
  const { minFreq, maxFreq } = useMemo(() => {
    if (allBands.length === 0) return { minFreq: 600e6, maxFreq: 5e9 };
    return {
      minFreq: Math.min(...allBands.map(b => b.freqUp)),
      maxFreq: Math.max(...allBands.map(b => b.freqDown)),
    };
  }, [allBands]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>加载运营商数据...</span>
      </div>
    );
  }

  if (operators.length === 0) return null;

  return (
    <div className="operator-bands-section">
      <h3 className="chart-title">中国运营商 4G/5G 频段分配</h3>

      {/* Filters */}
      <div className="operator-filters">
        <button
          className={`op-filter-btn ${selectedOp === '' ? 'active' : ''}`}
          onClick={() => setSelectedOp('')}
        >
          全部
        </button>
        {operators.map(op => (
          <button
            key={op.operator}
            className={`op-filter-btn ${selectedOp === op.operator ? 'active' : ''}`}
            style={{
              borderColor: selectedOp === op.operator ? op.color : 'transparent',
              backgroundColor: selectedOp === op.operator ? op.color + '18' : undefined,
            }}
            onClick={() => setSelectedOp(selectedOp === op.operator ? '' : op.operator)}
          >
            <span className="op-dot" style={{ backgroundColor: op.color }} />
            {op.operator}
          </button>
        ))}
      </div>

      {/* Spectrum overview bars */}
      <div className="op-spectrum-bar">
        {allBands.map((b, i) => {
          const left = ((b.freqUp - minFreq) / (maxFreq - minFreq)) * 100;
          const width = Math.max(0.3, ((b.freqDown - b.freqUp) / (maxFreq - minFreq)) * 100);
          return (
            <div
              key={i}
              className="op-bar-segment"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: b.color,
                opacity: b.tech === '5G NR' ? 1 : 0.55,
              }}
              title={`${b.operator} ${b.band} (${b.tech}): ${b.freq}`}
            />
          );
        })}
      </div>
      <div className="op-spectrum-labels">
        <span>{formatFrequency(minFreq)}</span>
        <span style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)' }}>1 GHz</span>
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>2.5 GHz</span>
        <span style={{ position: 'absolute', left: '75%', transform: 'translateX(-50%)' }}>4 GHz</span>
        <span>{formatFrequency(maxFreq)}</span>
      </div>

      {/* Legend */}
      <div className="op-legend">
        <div className="legend-item">
          <span className="legend-swatch" style={{ backgroundColor: '#333', opacity: 1 }} />
          5G NR（实心）
        </div>
        <div className="legend-item">
          <span className="legend-swatch" style={{ backgroundColor: '#333', opacity: 0.55 }} />
          4G LTE（半透明）
        </div>
      </div>

      {/* Detailed table */}
      <div className="table-scroll">
        <table className="operator-table">
          <thead>
            <tr>
              <th>运营商</th>
              <th>频段</th>
              <th>制式</th>
              <th>双工</th>
              <th>频率范围</th>
              <th>带宽</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            {(selectedOp ? allBands : allBands).map((b, i) => (
              <tr key={i}>
                <td>
                  <span className="op-name-badge" style={{ backgroundColor: b.color }}>
                    {b.operator}
                  </span>
                </td>
                <td className="band-cell">{b.band}</td>
                <td>
                  <span className={`tech-badge ${b.tech === '5G NR' ? 'tech-5g' : 'tech-4g'}`}>
                    {b.tech}
                  </span>
                </td>
                <td className="duplex-cell">{b.duplex}</td>
                <td className="freq-cell">{b.freq}</td>
                <td>{b.bw}</td>
                <td className="note-cell">{b.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="op-source">
        数据来源：工信部频谱分配公告 · 3GPP 标准 · 运营商年报（截至 2025 年）
      </p>
    </div>
  );
}
