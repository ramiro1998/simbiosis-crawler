import { Page } from 'playwright';
import path from 'path';

export class SimbiosisAboutPage {
  constructor(private page: Page) { }

  async savePdf() {
    const downloadPath = path.resolve(__dirname, '../../../../../downloads/details.pdf');
    await this.page.pdf({ path: downloadPath, format: 'A4' });
  }
}
