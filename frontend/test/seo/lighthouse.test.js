import lighthouseModule from 'lighthouse';
import spawn from 'cross-spawn';
import treeKill from 'tree-kill';
import * as chromeLauncher from 'chrome-launcher';

lighthouseModule.default = undefined;
const lighthouse = lighthouseModule;

async function launchNextDev() {
  const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });

  await new Promise((resolve) => setTimeout(resolve, 7000));

  return child;
}

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    port: chrome.port,
    output: 'json',
  };

  const runnerResult = await lighthouse(url, options);

  await chrome.kill();

  return runnerResult.lhr;
}

async function main() {
  const nextProcess = await launchNextDev();

  try {
    const url = 'http://localhost:3000';
    const report = await runLighthouse(url);

    console.log('SEO score:', report.categories.seo.score * 100);

    if (report.categories.seo.score < 0.9) {
      console.warn('SEO score is below 90%! Consider improving your site.');
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
        console.log('Next.js dev server stopped');
      }
    });
  }
}

main().catch(console.error);
