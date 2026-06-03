import { useMemo } from 'react';
import type { AllocationEntry } from '../types';
import { formatFrequency } from '../utils/frequency';
import { translateService } from '../utils/translations';
import { bandwidthColor } from '../utils/frequency';

interface Props {
  allocations: AllocationEntry[];
  freqMin: number | null;
  freqMax: number | null;
  serviceFilter: string;
  footnotes: { id: string; text: string }[];
}

export default function AllocationTable({
  allocations,
  freqMin,
  freqMax,
  serviceFilter,
  footnotes,
}: Props) {
  const rows = useMemo(() => {
    const result: {
      lf: number;
      uf: number;
      subTable: string;
      service: string;
      category: string;
      footnotes: string[];
    }[] = [];

    for (const entry of allocations) {
      for (const band of entry.bands) {
        if (freqMin !== null && band.uf < freqMin) continue;
        if (freqMax !== null && band.lf > freqMax) continue;
        if (!band.services) continue;

        for (const svc of band.services) {
          if (serviceFilter && svc.desc !== serviceFilter) continue;
          result.push({
            lf: band.lf,
            uf: band.uf,
            subTable: entry.name,
            service: svc.desc,
            category: svc.cat || '',
            footnotes: svc.footnotes || [],
          });
        }
      }
    }
    return result;
  }, [allocations, freqMin, freqMax, serviceFilter]);

  const getFootnoteText = (ids: string[]) => {
    return ids
      .map(id => {
        const fn = footnotes.find(f => f.id === id);
        return fn ? `${id}: ${fn.text.slice(0, 80)}...` : id;
      })
      .join('; ');
  };

  if (rows.length === 0) return null;

  return (
    <div className="table-container">
      <h3 className="chart-title">
        详细列表
        <span className="result-count">（{rows.length} 条记录）</span>
      </h3>
      <div className="table-scroll">
        <table className="allocation-table">
          <thead>
            <tr>
              <th>频率下限</th>
              <th>频率上限</th>
              <th>子表</th>
              <th>服务类型</th>
              <th>优先级</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 500).map((row, i) => (
              <tr key={i}>
                <td className="freq-cell">{formatFrequency(row.lf)}</td>
                <td className="freq-cell">{formatFrequency(row.uf)}</td>
                <td>{row.subTable === '-' ? '—' : row.subTable}</td>
                <td>
                  <span
                    className="service-badge"
                    style={{ backgroundColor: bandwidthColor(row.category, row.service) }}
                  >
                    {translateService(row.service)}
                  </span>
                  <span className="service-en">({row.service})</span>
                </td>
                <td>
                  {row.category === 'p' ? '主要' : row.category === 's' ? '次要' : '—'}
                </td>
                <td className="footnote-cell" title={getFootnoteText(row.footnotes)}>
                  {row.footnotes.length > 0 ? row.footnotes.join(', ') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > 500 && (
          <div className="table-truncated">
            仅显示前 500 条记录，共 {rows.length} 条。请缩小筛选范围。
          </div>
        )}
      </div>
    </div>
  );
}
