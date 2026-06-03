// API utility - fetches Earth Frequencies data
// Tries local data first, falls back to remote API

import type { AllocationEntry, Footnote } from '../types';

const LOCAL_BASE = '/data';
const REMOTE_BASE = 'https://www.earthfrequencies.org/api';

async function fetchJSON<T>(localPath: string, remotePath: string): Promise<T> {
  // Try local data first
  let res = await fetch(`${LOCAL_BASE}${localPath}`);
  if (!res.ok) {
    res = await fetch(`${REMOTE_BASE}${remotePath}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
  }
  return res.json();
}

export async function fetchRegionIndex(): Promise<
  { path: string; region: string }[]
> {
  const data = await fetchJSON<{
    entries: { path: string; region: string }[];
  }>('/allocations/tables/index.json', '/allocations/tables/index.json');
  return data.entries;
}

export async function fetchAllocations(
  region: string
): Promise<AllocationEntry[]> {
  const data = await fetchJSON<{ entries: AllocationEntry[] }>(
    `/allocations/tables/${region}.json`,
    `/allocations/tables/${region}/`
  );
  return data.entries;
}

export async function fetchFootnotes(region: string): Promise<Footnote[]> {
  try {
    const data = await fetchJSON<{ footnotes?: Footnote[] } | Footnote[]>(
      `/allocations/footnotes/${region}/index.json`,
      `/allocations/footnotes/${region}/index.json`
    );
    return Array.isArray(data) ? data : data.footnotes || [];
  } catch {
    return [];
  }
}
