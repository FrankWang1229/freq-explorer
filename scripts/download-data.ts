#!/usr/bin/env tsx
// Downloads Earth Frequencies API data and saves to public/data/

import * as fs from 'node:fs';
import * as path from 'node:path';

const REMOTE = 'https://www.earthfrequencies.org/api';
const OUT_DIR = path.join(import.meta.dirname, '..', 'public', 'data');

async function fetchJSON(url: string): Promise<unknown> {
  console.log(`  GET ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

function mkdir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  console.log('Downloading Earth Frequencies data...\n');

  // Fetch region index
  const indexUrl = `${REMOTE}/allocations/tables/index.json`;
  const indexData = (await fetchJSON(indexUrl)) as {
    entries: { path: string; region: string }[];
  };
  const regions = indexData.entries;
  console.log(`Found ${regions.length} regions\n`);

  // Save index
  const allocDir = path.join(OUT_DIR, 'allocations', 'tables');
  mkdir(allocDir);
  fs.writeFileSync(path.join(allocDir, 'index.json'), JSON.stringify(indexData));

  // Download allocation tables
  let downloaded = 0;
  for (const { path: regionPath } of regions) {
    try {
      const data = await fetchJSON(
        `${REMOTE}/allocations/tables/${regionPath}/`
      );
      const filePath = path.join(allocDir, `${regionPath}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data));
      downloaded++;
    } catch (e) {
      console.log(`  ✗ ${regionPath}: ${(e as Error).message}`);
    }
  }
  console.log(`\nDownloaded ${downloaded}/${regions.length} allocation tables`);

  // Download footnotes
  const footnotesRegions = ['itu1', 'itu2', 'itu3', 'ca', 'gb', 'eu'];
  for (const region of footnotesRegions) {
    try {
      const data = await fetchJSON(
        `${REMOTE}/allocations/footnotes/${region}/index.json`
      );
      const footDir = path.join(OUT_DIR, 'allocations', 'footnotes', region);
      mkdir(footDir);
      fs.writeFileSync(
        path.join(footDir, 'index.json'),
        JSON.stringify(data)
      );
    } catch (e) {
      console.log(`  Footnotes for ${region}: skipped`);
    }
  }

  console.log(`\nDone! Data saved to ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
