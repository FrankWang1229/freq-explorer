import { useState, useCallback } from 'react';

interface Props {
  onFilter: (minHz: number | null, maxHz: number | null) => void;
}

export default function FrequencyFilter({ onFilter }: Props) {
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  const parse = (s: string): number | null => {
    const cleaned = s.trim().replace(/\s+/g, '');
    if (!cleaned) return null;
    const m = cleaned.match(/^([\d.]+)\s*(G?Hz|M?Hz|k?Hz)?$/i);
    if (!m) return null;
    const n = parseFloat(m[1]);
    if (isNaN(n)) return null;
    const unit = (m[2] || 'MHz').toLowerCase();
    const mult: Record<string, number> = {
      'ghz': 1e9, 'mhz': 1e6, 'khz': 1e3, 'hz': 1,
    };
    return n * (mult[unit] || 1e6);
  };

  const apply = useCallback(() => {
    onFilter(parse(minInput), parse(maxInput));
  }, [minInput, maxInput, onFilter]);

  const clear = useCallback(() => {
    setMinInput('');
    setMaxInput('');
    onFilter(null, null);
  }, [onFilter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') apply();
  };

  return (
    <div className="filter-group">
      <label className="filter-label">频率范围</label>
      <div className="freq-input-row">
        <input
          type="text"
          className="freq-input"
          placeholder="如 30 MHz"
          value={minInput}
          onChange={e => setMinInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="freq-sep">–</span>
        <input
          type="text"
          className="freq-input"
          placeholder="如 3 GHz"
          value={maxInput}
          onChange={e => setMaxInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-sm btn-primary" onClick={apply}>筛选</button>
        <button className="btn btn-sm btn-ghost" onClick={clear}>清除</button>
      </div>
    </div>
  );
}
