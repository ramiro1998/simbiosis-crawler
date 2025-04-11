import assert from 'node:assert';
import { Page } from 'playwright';
import { Functions } from '@crawlers/zod-schema';
import { RfxHomePage } from './pages/rfx-home.page';
import { writeFileSync } from 'node:fs';

export class RfxScript {
  constructor(
    private readonly page: Page,
    private readonly config: Functions.Rfx.RfxInputSchemaDto
  ) {}

  async run(): Promise<Functions.Rfx.RfxOutputSchemaDto> {
    const homePage = new RfxHomePage(this.page);
    await homePage.goto()

    const aboutPage = await homePage.navToAboutUs()
    const ceoImgUrl = await aboutPage.locators.ceoImg.first().getAttribute('src')
    assert(ceoImgUrl)
    
    await aboutPage.locators.coreValues.scrollIntoViewIfNeeded()

    const buffer = await this.page.pdf()
    writeFileSync(`./screen-shot.pdf`, buffer)

    return {
      ceoImgUrl
    };
  }
}
