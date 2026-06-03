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

  // Copy custom data (not in upstream API) and merge index
  const customDir = path.join(import.meta.dirname, '..', 'public', 'custom');
  if (fs.existsSync(customDir)) {
    copyDirSync(customDir, OUT_DIR);
    // Merge custom region entries into the index
    const customTablesDir = path.join(customDir, 'allocations', 'tables');
    if (fs.existsSync(customTablesDir)) {
      const indexData = JSON.parse(
        fs.readFileSync(path.join(allocDir, 'index.json'), 'utf-8')
      );
      for (const file of fs.readdirSync(customTablesDir)) {
        if (file === 'index.json' || !file.endsWith('.json')) continue;
        const regionPath = file.replace('.json', '');
        if (!indexData.entries.some((e: { path: string }) => e.path === regionPath)) {
          indexData.entries.push({ path: regionPath, region: regionPath.toUpperCase() });
        }
      }
      fs.writeFileSync(path.join(allocDir, 'index.json'), JSON.stringify(indexData));
    }
    console.log('Custom data merged.');
  }
}

function copyDirSync(src: string, dest: string) {
  mkdir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
