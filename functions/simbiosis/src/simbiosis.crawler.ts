import { Crawler, CrawlerConfig } from '@crawlers/browser';
import { Scripts } from '@crawlers/playwright-scripts';
import { Functions } from '@crawlers/zod-schema';
import assert = require('assert');

export class SimbiosisCrawler extends Crawler<
  typeof Functions.Simbiosis.SimbiosisInputSchema,
  typeof Functions.Simbiosis.SimbiosisEnvSchema,
  typeof Functions.Simbiosis.SimbiosisOutputSchema
> {
  override async script() {
      assert(this.input && this.env, `Missing input or env`);

      const page = await this.setupBrowser();

      const script = new Scripts.Functions.SimbiosisScript(page, this.input)

      const results = await script.run()

      this.setOutput(results);
    }
  }

  export type SimbiosisCrawlerConfig = CrawlerConfig<typeof Functions.Simbiosis.SimbiosisInputSchema, typeof
    Functions.Simbiosis.SimbiosisEnvSchema, typeof Functions.Simbiosis.SimbiosisOutputSchema>;