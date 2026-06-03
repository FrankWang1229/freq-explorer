import { useState, useEffect, useCallback } from 'react';
import type { AllocationEntry, Footnote } from '../types';
import { fetchAllocations, fetchFootnotes, fetchRegionIndex } from '../utils/api';

interface AllocationDataState {
  regions: { path: string; region: string }[];
  allocations: AllocationEntry[];
  footnotes: Footnote[];
  loading: boolean;
  error: string | null;
}

export function useAllocationData(selectedRegion: string) {
  const [state, setState] = useState<AllocationDataState>({
    regions: [],
    allocations: [],
    footnotes: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    fetchRegionIndex()
      .then((entries) => setState((s) => ({ ...s, regions: entries })))
      .catch(() => {
        // Fallback: use hardcoded list
        setState((s) => ({
          ...s,
          regions: [
            { path: 'itu1', region: 'ITU Region 1' },
            { path: 'itu2', region: 'ITU Region 2' },
            { path: 'itu3', region: 'ITU Region 3' },
            { path: 'eu', region: 'European Union' },
            { path: 'us', region: 'United States' },
            { path: 'ca', region: 'Canada' },
            { path: 'gb', region: 'United Kingdom' },
            { path: 'de', region: 'Germany' },
            { path: 'fr', region: 'France' },
            { path: 'jp', region: 'Japan' },
            { path: 'cn', region: 'China' },
          ],
        }));
      });
  }, []);

  const loadRegion = useCallback(async (region: string) => {
    if (!region) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [allocations, footnotes] = await Promise.all([
        fetchAllocations(region),
        fetchFootnotes(region),
      ]);
      setState((s) => ({ ...s, allocations, footnotes, loading: false }));
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: `加载失败: ${(e as Error).message}`,
      }));
    }
  }, []);

  useEffect(() => {
    loadRegion(selectedRegion);
  }, [selectedRegion, loadRegion]);

  return { ...state, reload: () => loadRegion(selectedRegion) };
}
