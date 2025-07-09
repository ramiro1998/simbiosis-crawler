import { type HttpFunction, cloudEvent } from '@google-cloud/functions-framework';
import { Functions } from '@crawlers/zod-schema';

import { SimbiosisCrawler, SimbiosisCrawlerConfig } from './simbiosis.crawler';

const sharedConfig: Omit<SimbiosisCrawlerConfig, 'trigger' | 'req' | 'res' | 'event'> = {
  retryCount: 3,
  timeoutMs: 30000,
  EnvSchema: Functions.Simbiosis.SimbiosisEnvSchema,
  InputSchema: Functions.Simbiosis.SimbiosisInputSchema,
  OutputSchema: Functions.Simbiosis.SimbiosisOutputSchema,
}

/**
* @description entry point for triggering this function using an http request
* @warning When changing "Simbiosis" to something else, make sure to also update the "entryPoint" inside the "project.json"
*/
export const Simbiosis: HttpFunction = async (req, res) => {
  const config: SimbiosisCrawlerConfig = {
  trigger: 'http',
    req,
    res,
    ...sharedConfig
  }

  const crawler = new SimbiosisCrawler(config)
  await crawler.run()
};

/**
* @description entry point for triggering this function using an event-arc cloud event
*/
cloudEvent('SimbiosisCloudEvent', async (cloudEvent) => {
  const config: SimbiosisCrawlerConfig = {
    trigger: 'cloudevent',
    event: cloudEvent,
    ...sharedConfig
  }

  const crawler = new SimbiosisCrawler(config)
  await crawler.run()
  return crawler.output
})