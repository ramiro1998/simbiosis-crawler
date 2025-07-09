import assert from 'node:assert';
import { Page } from 'playwright';
import { Functions } from '@crawlers/zod-schema';
import { SimbiosisHomePage } from './pages/simbiosis-home.page';
import { writeFileSync } from 'node:fs';

export class SimbiosisScript {
  constructor(
    private readonly page: Page,
    private readonly config: Functions.Simbiosis.SimbiosisInputSchemaDto
  ) { }

  async run(): Promise<Functions.Simbiosis.SimbiosisOutputSchemaDto> {
    console.log('run() started');
    const homePage = new SimbiosisHomePage(this.page);
    await homePage.goto();
    await homePage.searchLicense();
    await homePage.goToDetails();
    const buffer = await this.page.pdf()
    writeFileSync(`./downloads/details.pdf`, buffer);

    return {
      status: 'success',
      message: 'Pdf generated and saved in downloads/details.pdf'
    };
  }
}
