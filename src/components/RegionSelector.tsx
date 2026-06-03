import { translateRegion } from '../utils/translations';

interface Region {
  path: string;
  region: string;
}

interface Props {
  regions: Region[];
  selected: string;
  onChange: (region: string) => void;
}

export default function RegionSelector({ regions, selected, onChange }: Props) {
  // Group: ITU regions first, then countries alphabetically
  const ituRegions = regions.filter(
    (r) => r.path.startsWith('itu') || r.path === 'eu'
  );
  const countries = regions.filter(
    (r) => !r.path.startsWith('itu') && r.path !== 'eu'
  );

  return (
    <div className="filter-group">
      <label className="filter-label">国家 / 区域</label>
      <select
        className="filter-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- 请选择 --</option>
        {ituRegions.length > 0 && (
          <optgroup label="ITU 区域">
            {ituRegions.map((r) => (
              <option key={r.path} value={r.path}>
                {translateRegion(r.path).name || r.region}
              </option>
            ))}
          </optgroup>
        )}
        {countries.length > 0 && (
          <optgroup label="国家">
            {countries.map((r) => (
              <option key={r.path} value={r.path}>
                {translateRegion(r.path).name || r.region}
              </option>
            ))}
          </optgroup>
        )}
      </select>
    </div>
  );
}
