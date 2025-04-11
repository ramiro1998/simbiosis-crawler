import chromium from '@sparticuz/chromium';
import assert from 'node:assert';
import { Browser, BrowserContext, chromium as playwright } from 'playwright';

interface Payload {
  browser: Browser;
  browserContext: BrowserContext;
  resetBrowser: () => Promise<void>;
}

let browser: null | Browser = null;
let browserContext: null | BrowserContext = null;

export async function getBrowser(): Promise<Payload> {
  const initializeBrowser = async () => {
    browser = await playwright.launch(
      process.env['NODE_ENV'] === 'production'
        ? {
            args: [...chromium.args, '--disable-web-security'],
            executablePath: await chromium.executablePath(),
            headless: true,
          }
        : {
            headless: true,
            args: ['--disable-web-security'],
          }
    );
    browserContext = await browser.newContext({
      viewport: { width: 1000, height: 1200 },
    });
  };

  const resetBrowser = async () => {
    await browserContext?.close();
    await browser?.close();
    await initializeBrowser();
  };

  if (browser == null) {
    await initializeBrowser();
  }

  assert(browser != null, 'browser is nullish.');
  assert(browserContext != null, 'browserContext is nullish.');

  return {
    browser,
    browserContext,
    resetBrowser,
  };
}
