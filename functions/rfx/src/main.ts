import { type HttpFunction, cloudEvent } from '@google-cloud/functions-framework';
import { Functions } from '@crawlers/zod-schema';

import { RfxCrawler, RfxCrawlerConfig } from './rfx.crawler';

const sharedConfig: Omit<RfxCrawlerConfig, 'trigger' | 'req' | 'res' | 'event'> = {
  retryCount: 3,
  timeoutMs: 30000,
  EnvSchema: Functions.Rfx.RfxEnvSchema,
  InputSchema: Functions.Rfx.RfxInputSchema,
  OutputSchema: Functions.Rfx.RfxOutputSchema,
}

/**
* @description entry point for triggering this function using an http request
* @warning When changing "Rfx" to something else, make sure to also update the "entryPoint" inside the "project.json"
*/
export const Rfx: HttpFunction = async (req, res) => {
  const config: RfxCrawlerConfig = {
  trigger: 'http',
    req,
    res,
    ...sharedConfig
  }

  const crawler = new RfxCrawler(config)
  await crawler.run()
};

/**
* @description entry point for triggering this function using an event-arc cloud event
*/
cloudEvent('RfxCloudEvent', async (cloudEvent) => {
  const config: RfxCrawlerConfig = {
    trigger: 'cloudevent',
    event: cloudEvent,
    ...sharedConfig
  }

  const crawler = new RfxCrawler(config)
  await crawler.run()
  return crawler.output
})