import { useMemo, useState } from 'react';
import { translateService } from '../utils/translations';
import type { AllocationEntry } from '../types';

interface Props {
  allocations: AllocationEntry[];
  selected: string;
  onChange: (service: string) => void;
}

export default function ServiceFilter({ allocations, selected, onChange }: Props) {
  const [search, setSearch] = useState('');

  const services = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const entry of allocations) {
      for (const band of entry.bands) {
        if (band.services) {
          for (const svc of band.services) {
            if (!seen.has(svc.desc)) {
              seen.add(svc.desc);
              result.push(svc.desc);
            }
          }
        }
      }
    }
    return result.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [allocations]);

  const filtered = useMemo(() => {
    if (!search) return services;
    const q = search.toLowerCase();
    return services.filter(s =>
      s.toLowerCase().includes(q) ||
      translateService(s).includes(q)
    );
  }, [services, search]);

  return (
    <div className="filter-group">
      <label className="filter-label">服务类型</label>
      <input
        type="text"
        className="filter-input"
        placeholder="搜索服务类型..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select
        className="filter-select"
        size={6}
        value={selected}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">全部</option>
        {filtered.map(s => (
          <option key={s} value={s}>
            {translateService(s)} ({s})
          </option>
        ))}
      </select>
    </div>
  );
}
