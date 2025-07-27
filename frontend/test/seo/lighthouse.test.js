const lighthouseModule = require('lighthouse');
const lighthouse = lighthouseModule.default || lighthouseModule;
const chromeLauncher = require('chrome-launcher');
const spawn = require('cross-spawn');

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
    outputPath: './seo/reports/report.json',
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
    nextProcess.kill();
  }
}

main().catch(console.error);
