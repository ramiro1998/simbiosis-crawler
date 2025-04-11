import { Crawler, CrawlerConfig } from '@crawlers/browser';
import { Functions } from '@crawlers/zod-schema';
import { Scripts } from '@crawlers/playwright-scripts';
import assert = require('assert');

export class RfxCrawler extends Crawler<
  typeof Functions.Rfx.RfxInputSchema,
  typeof Functions.Rfx.RfxEnvSchema,
  typeof Functions.Rfx.RfxOutputSchema
> {
  override async script() {
      assert(this.input && this.env, `Missing input or env`);

      const page = await this.setupBrowser();

      const script = new Scripts.Functions.RfxScript(page, this.input)

      const results = await script.run()

      this.setOutput(results);
    }
  }

  export type RfxCrawlerConfig = CrawlerConfig<typeof Functions.Rfx.RfxInputSchema, typeof
    Functions.Rfx.RfxEnvSchema, typeof Functions.Rfx.RfxOutputSchema>;