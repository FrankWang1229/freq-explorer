import { useState, useCallback } from 'react';
import RegionSelector from './components/RegionSelector';
import FrequencyFilter from './components/FrequencyFilter';
import ServiceFilter from './components/ServiceFilter';
import SpectrumChart from './components/SpectrumChart';
import AllocationTable from './components/AllocationTable';
import { useAllocationData } from './hooks/useAllocationData';
import './App.css';

function App() {
  const [region, setRegion] = useState('');
  const [freqMin, setFreqMin] = useState<number | null>(null);
  const [freqMax, setFreqMax] = useState<number | null>(null);
  const [serviceFilter, setServiceFilter] = useState('');

  const { regions, allocations, footnotes, loading, error } = useAllocationData(region);

  const handleFreqFilter = useCallback((min: number | null, max: number | null) => {
    setFreqMin(min);
    setFreqMax(max);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>全球无线电频谱查询</h1>
        <p className="subtitle">
          基于 Earth Frequencies 开源数据 · 覆盖 {regions.length} 个国家/区域
        </p>
      </header>

      <div className="filters-bar">
        <RegionSelector
          regions={regions}
          selected={region}
          onChange={setRegion}
        />
        <FrequencyFilter onFilter={handleFreqFilter} />
      </div>

      {!region && (
        <div className="empty-state welcome">
          <div className="welcome-icon">📡</div>
          <h2>选择国家或区域开始查询</h2>
          <p>支持按国家、频率范围、服务类型筛选无线电频谱分配数据</p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <span>加载中...</span>
        </div>
      )}

      {error && (
        <div className="error-msg">
          {error}
          <button className="btn btn-sm btn-primary" onClick={() => setRegion(region)}>重试</button>
        </div>
      )}

      {region && !loading && !error && (
        <div className="main-content">
          <div className="sidebar">
            <ServiceFilter
              allocations={allocations}
              selected={serviceFilter}
              onChange={setServiceFilter}
            />
          </div>
          <div className="content">
            <SpectrumChart
              allocations={allocations}
              freqMin={freqMin}
              freqMax={freqMax}
              serviceFilter={serviceFilter}
            />
            <AllocationTable
              allocations={allocations}
              freqMin={freqMin}
              freqMax={freqMax}
              serviceFilter={serviceFilter}
              footnotes={footnotes}
            />
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>
          数据来源：
          <a href="https://www.earthfrequencies.org" target="_blank" rel="noopener">
            Earth Frequencies
          </a>
          （CC BY-SA 4.0 / MIT）
          · ITU Radio Regulations
        </p>
      </footer>
    </div>
  );
}

export default App;
