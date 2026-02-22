import lighthouseModule from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const URL = 'http://localhost:3000';
const RESULTS_DIR = path.resolve(__dirname, '../test-results');

async function runLighthouse(url: string) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const result = await lighthouseModule(url, {
    port: chrome.port,
    output: 'html',
    logLevel: 'error',
    onlyCategories: ['seo'],
  });

  chrome.kill();
  return result;
}

async function main() {
  const result = await runLighthouse(URL);

  if (!result) {
    console.error('Lighthouse returned no result');
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(RESULTS_DIR, { recursive: true });

  const reportPath = path.join(RESULTS_DIR, 'lighthouse-report.html');
  fs.writeFileSync(reportPath, result.report as string, 'utf-8');

  const seoScore = result.lhr.categories['seo']?.score;
  if (seoScore === null || seoScore === undefined) {
    console.error('SEO category missing from Lighthouse result');
    process.exitCode = 1;
    return;
  }
  const score = seoScore * 100;
  console.log(`✅ SEO score: ${score}/100!`);
  console.log(`Report saved: ${reportPath}`);

  if (score < 90) {
    console.warn('⚠️  SEO score below 90');
    process.exitCode = 1;
  }
}

main().catch((e: unknown) => {
  console.error('Lighthouse failed:', e);
  process.exitCode = 1;
});
