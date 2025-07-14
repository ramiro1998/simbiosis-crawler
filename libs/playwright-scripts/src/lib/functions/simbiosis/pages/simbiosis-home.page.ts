import { Page } from 'playwright';

export class SimbiosisHomePage {
  constructor(private page: Page) { }

  static url = 'https://eservices.nysed.gov/professions/verification-search';

  async goto() {
    await this.page.goto(SimbiosisHomePage.url);
  }

  async searchLicense() {
    const searchByInput = this.page.locator('div.vue-select input[placeholder="Select option"]').first();
    await searchByInput.click();
    await this.page.waitForSelector('ul.vue-dropdown li.vue-dropdown-item');
    await this.page.click('ul.vue-dropdown li.vue-dropdown-item >> text=License Number');
    await this.page.waitForTimeout(200);

    const professionInput = this.page.locator('label:has-text("Profession")')
      .locator('xpath=following-sibling::div')
      .locator('div.vue-select input[placeholder="Select option"]');
    await professionInput.click();

    const doctorOption = this.page.locator('ul.vue-dropdown li.vue-dropdown-item', {
      hasText: 'Doctor (Physician) (060)'
    });
    try {
      await doctorOption.waitFor({ state: 'visible', timeout: 3000 });
      await doctorOption.click();
    } catch {
      await professionInput.click();
      await doctorOption.waitFor({ state: 'visible' });
      await doctorOption.click();
    }

    await this.page.fill('#searchInput', '145661');
    await this.page.click('button:has-text("GO")');
    await this.page.waitForSelector('text=145661');
  }

  async goToDetails() {
    const licenseLink = this.page.locator('a.information', { hasText: '145661' });
    await licenseLink.waitFor({ state: 'visible', timeout: 200 });
    await licenseLink.click();
    await this.page.waitForSelector('div.modal.show', { timeout: 200 });
    await this.page.waitForSelector('div.modal.show >> text=Loading...', { state: 'hidden', timeout: 200 });
  }

}
