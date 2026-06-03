// Frequency formatting and parsing utilities

const UNITS = [
  { suffix: 'EHz', value: 1e18 },
  { suffix: 'PHz', value: 1e15 },
  { suffix: 'THz', value: 1e12 },
  { suffix: 'GHz', value: 1e9 },
  { suffix: 'MHz', value: 1e6 },
  { suffix: 'kHz', value: 1e3 },
  { suffix: 'Hz', value: 1 },
];

export function formatFrequency(hz: number): string {
  if (hz === 0) return '0 Hz';
  for (const { suffix, value } of UNITS) {
    if (hz >= value) {
      const num = hz / value;
      const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
      return `${formatted} ${suffix}`;
    }
  }
  return `${hz} Hz`;
}

export function formatFrequencyRange(lf: number, uf: number): string {
  if (lf === uf) return formatFrequency(lf);
  // If both are in the same unit range, simplify
  for (const { suffix, value } of UNITS) {
    if (lf >= value && uf >= value) {
      const lv = lf / value;
      const uv = uf / value;
      const lfrm = lv % 1 === 0 ? lv.toFixed(0) : lv.toFixed(2);
      const ufrm = uv % 1 === 0 ? uv.toFixed(0) : uv.toFixed(2);
      return `${lfrm} – ${ufrm} ${suffix}`;
    }
  }
  return `${formatFrequency(lf)} – ${formatFrequency(uf)}`;
}

export function parseFrequency(input: string): number | null {
  const cleaned = input.trim().replace(/\s+/g, '');
  if (!cleaned) return null;

  const match = cleaned.match(/^([\d.]+)\s*(EHz|PHz|THz|GHz|MHz|kHz|Hz)?$/i);
  if (!match) return null;

  const num = parseFloat(match[1]);
  if (isNaN(num)) return null;

  const unit = (match[2] || 'MHz').toLowerCase();
  const multipliers: Record<string, number> = {
    'ehz': 1e18, 'phz': 1e15, 'thz': 1e12, 'ghz': 1e9,
    'mhz': 1e6, 'khz': 1e3, 'hz': 1,
  };

  return num * (multipliers[unit] || 1e6);
}

export function bandwidthColor(category: string, serviceName: string): string {
  // Color scheme for different service categories
  const colors: Record<string, string> = {
    'Fixed': '#4C72B0',
    'Fixed Satellite': '#55A868',
    'Fixed-satellite': '#55A868',
    'Mobile': '#C44E52',
    'Mobile Satellite': '#CC6677',
    'Mobile-satellite': '#CC6677',
    'Broadcasting': '#DDCC77',
    'Broadcasting Satellite': '#AA7744',
    'Broadcasting-satellite': '#AA7744',
    'Maritime': '#64B5CD',
    'Aeronautical': '#F4A460',
    'Radionavigation': '#937DB5',
    'Radiolocation': '#6B8E9B',
    'Radio Astronomy': '#82A6CB',
    'Amateur': '#44AA99',
    'Meteorological': '#88CCEE',
    'Earth Exploration': '#999933',
    'Earth exploration': '#999933',
    'Space': '#332288',
    'Standard Frequency': '#117733',
    'Standard frequency': '#117733',
    'ISM': '#888888',
  };

  const key = Object.keys(colors).find(k => serviceName.toLowerCase().startsWith(k.toLowerCase()));
  if (key) return colors[key];

  // Fallback color based on category
  return category === 'p' ? '#4477AA' : '#AA7744';
}
