import assert from 'assert';
import { Locator, Page } from 'playwright';

export abstract class Selectors {
  public static selectors: Record<string, string>;
}

export abstract class Locators {
  public static locators: Record<string, Locator>;
}

export class PlaywrightPage {
  public static url = 'https://playwright.dev/';
  pdfBuffer: Buffer | null = null;

  get SubClass(): this {
    // @ts-expect-error ignore
    return this.constructor;
  }

  get url(): string {
    return this.SubClass.url;
  }

  constructor(public page: Page) {
    this.page = page;
  }

  async goto() {
    assert(this.url, `Set page's static public url.`);
    const resp = this.page.waitForResponse(this.url);
    await this.page.goto(this.url);
    await resp;
  }
}
