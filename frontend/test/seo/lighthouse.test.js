import lighthouseModule from 'lighthouse';
import spawn from 'cross-spawn';
import treeKill from 'tree-kill';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lighthouse = lighthouseModule;
const TEST_RESULTS_DIR = path.resolve(__dirname, '../test-results');

function waitForServer(url, timeout = 30000, interval = 500) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) return resolve();
          retry();
        })
        .on('error', retry);
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(new Error('Server did not respond in time.'));
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
}

async function launchNextDev() {
  const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
  await waitForServer('http://localhost:3000');
  return child;
}

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    port: chrome.port,
    output: 'html',
    logLevel: 'error',
    onlyCategories: ['seo'],
  };

  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  return runnerResult;
}

async function saveReport(runnerResult) {
  if (!fs.existsSync(TEST_RESULTS_DIR)) {
    fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
  }

  const htmlFilePath = path.join(TEST_RESULTS_DIR, `lighthouse-report.html`);

  fs.writeFileSync(htmlFilePath, runnerResult.report, 'utf-8');

  console.log(`Lighthouse report saved to: ${htmlFilePath}`);
}

async function main() {
  const nextProcess = await launchNextDev();

  try {
    const url = 'http://localhost:3000';
    const runnerResult = await runLighthouse(url);
    await saveReport(runnerResult);

    const score = runnerResult.lhr.categories.seo.score * 100;
    console.log('SEO score:', score);

    if (score < 90) {
      console.warn('⚠️ SEO score is below 90%! Consider improving your site.');
      process.exitCode = 1;
    }
  } catch (e) {
    console.error('Lighthouse test failed:', e);
    process.exitCode = 1;
  } finally {
    treeKill(nextProcess.pid, 'SIGKILL', (err) => {
      if (err) {
        console.error('Failed to kill Next.js dev server:', err);
      } else {
        console.log('✅ Next.js dev server stopped');
      }
    });
  }
}

main().catch(console.error);
