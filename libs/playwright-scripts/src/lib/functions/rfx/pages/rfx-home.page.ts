import {
  Locators,
  PlaywrightPage,
  Selectors,
} from '../../../shared/playwright.page';
import { RfxAboutUsPage } from './rfx-about.page';

export class RfxHomePage
  extends PlaywrightPage
  implements Selectors, Locators
{
  public static override url = 'https://rfxsolutions.com';

  static get selectors() {
    return {
      aboutUs: '[href="about"]',
    };
  }

  get locators() {
    return {
      aboutUs: this.page.locator(RfxHomePage.selectors.aboutUs),
    };
  }

  async navToAboutUs () {
    await this.locators.aboutUs.click()
    await this.page.waitForURL(RfxAboutUsPage.url)
    return new RfxAboutUsPage(this.page)
  }
}
