import { useState, useEffect, useMemo } from 'react';
import { formatFrequency } from '../utils/frequency';

interface Band {
  freq: string;
  freqUp: number;
  freqDown: number;
  bw: string;
  channels: string;
  power: string;
  note: string;
  key: string;
}

interface Category {
  category: string;
  bands: Band[];
}

const CATEGORY_COLORS: Record<string, string> = {
  '专用对讲机': '#E74C3C',
  '共用对讲机': '#E67E22',
  '公众对讲机': '#27AE60',
  '公安 PDT': '#8E44AD',
  '铁路 GSM-R': '#2980B9',
  '民航 VHF': '#16A085',
  '水上 VHF': '#1ABC9C',
  'NB-IoT': '#2C3E50',
  'ISM': '#7F8C8D',
  '卫星通信': '#D35400',
  'Starlink': '#0A84FF',
  '北斗': '#FF2D55',
  '其他 GNSS': '#30D158',
};

function getColor(category: string): string {
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (category.startsWith(key)) return color;
  }
  return '#95A5A6';
}

export default function SpecialBands() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}custom/special-bands/cn.json`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allBands = useMemo(() => {
    return categories.flatMap(cat =>
      cat.bands.map(b => ({ ...b, category: cat.category }))
    ).sort((a, b) => a.freqUp - b.freqUp);
  }, [categories]);

  const minFreq = useMemo(() => {
    if (allBands.length === 0) return 1e6;
    return allBands[0].freqUp;
  }, [allBands]);

  const maxFreq = useMemo(() => {
    if (allBands.length === 0) return 6e9;
    return allBands[allBands.length - 1].freqDown;
  }, [allBands]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <span>加载专网数据...</span>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="special-bands-section">
      <h3 className="chart-title">中国专用无线电业务频段</h3>

      {/* Spectrum overview */}
      <div className="special-spectrum-bar">
        {allBands.map((b, i) => {
          const left = ((b.freqUp - minFreq) / (maxFreq - minFreq)) * 100;
          const width = Math.max(0.2, ((b.freqDown - b.freqUp) / (maxFreq - minFreq)) * 100);
          return (
            <div
              key={i}
              className="sp-bar-segment"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: getColor(b.category),
              }}
              title={`${b.category}: ${b.freq} — ${b.note}`}
            />
          );
        })}
      </div>
      <div className="special-spectrum-labels">
        <span>{formatFrequency(minFreq)}</span>
        <span>{formatFrequency(maxFreq)}</span>
      </div>

      {/* Category sections */}
      {categories.map(cat => (
        <div key={cat.category} className="special-category">
          <h4 className="special-cat-title">
            <span
              className="sp-cat-dot"
              style={{ backgroundColor: getColor(cat.category) }}
            />
            {cat.category}
          </h4>
          <div className="table-scroll">
            <table className="special-table">
              <thead>
                <tr>
                  <th>频率范围</th>
                  <th>带宽</th>
                  <th>信道</th>
                  <th>功率</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {cat.bands.map((b, i) => (
                  <tr key={i}>
                    <td className="freq-cell">{b.freq}</td>
                    <td>{b.bw}</td>
                    <td className="channel-cell">{b.channels}</td>
                    <td>{b.power}</td>
                    <td className="note-cell">{b.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <p className="op-source">
        数据来源：工信部频率规划文件 · 国家无线电办公室（截至 2025 年）
      </p>
    </div>
  );
}
