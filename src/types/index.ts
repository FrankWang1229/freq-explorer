// Earth Frequencies API data types

export interface ServiceEntry {
  desc: string;
  cat: 'p' | 's' | '';
  footnotes?: string[];
}

export interface FrequencyBand {
  lf: number;
  uf: number;
  footnotes?: string[];
  services?: ServiceEntry[];
}

export interface AllocationEntry {
  name: string;
  bands: FrequencyBand[];
}

export interface RegionIndexEntry {
  path: string;
  region: string;
}

export interface Footnote {
  id: string;
  text: string;
}
