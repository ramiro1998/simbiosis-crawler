import {
  CloudEvent,
  Request,
  Response,
} from '@google-cloud/functions-framework';
import sparticuzChromium from '@sparticuz/chromium';
import { HttpStatusCode } from 'axios';
import { Browser, BrowserContext, chromium, Page } from 'playwright';
import { z } from 'zod';
import assert from 'node:assert';

export class Crawler<
  IN_SCHEMA extends GenericZodSchema,
  ENV_SCHEMA extends GenericZodSchema,
  OUT_SCHEMA extends GenericZodSchema
> {
  #config: CrawlerConfig<IN_SCHEMA, ENV_SCHEMA, OUT_SCHEMA>;

  #browser: Browser | undefined;
  #browserContext: BrowserContext | undefined;
  #page: Page | undefined;

  env: z.infer<ENV_SCHEMA> | undefined;
  input: z.infer<IN_SCHEMA> | undefined;
  output: z.infer<OUT_SCHEMA> | undefined;

  get #InputSchema() {
    return this.#config.InputSchema;
  }
  get #OutputSchema() {
    return this.#config.OutputSchema;
  }
  get #EnvSchema() {
    return this.#config.EnvSchema;
  }

  constructor(config: CrawlerConfig<IN_SCHEMA, ENV_SCHEMA, OUT_SCHEMA>) {
    this.#config = config;
  }

  public async resetBrowserContext() {
    if (this.#browserContext) {
      assert(
        this.#browser,
        `Unable to reset browser context, browser undefined`
      );
      await this.#browserContext.close();
      this.#browserContext = await this.#browser.newContext();
    }
  }

  public async closePage() {
    if (this.#page) {
      try {
        await this.#page.close();
        this.#page = undefined;
      } catch (e) {
        // swallow
        console.error(e)
      }
    }

    if (this.#browserContext) {
      try {
        await this.#browserContext.close();
        this.#browserContext = undefined;
      } catch (e) {
        // swallow
        console.error(e)
      }
    }

    if (this.#browser) {
      try {
        await this.#browser.close();
        this.#browser = undefined;
      } catch (e) {
        console.warn(e);
      }
    }
  }

  public cloudEventToJson(event: CloudEvent<any>): z.infer<IN_SCHEMA> {
    assert(
      event.data?.message != null,
      'Unable to extract payload from cloud event'
    );
    return JSON.parse(atob(event.data.message.data));
  }

  public setup() {
    switch (this.#config.trigger) {
      case 'http': {
        assert(this.#config.req.method === 'POST', 'Bad Request');
        const input = this.#InputSchema.parse(this.#config.req.body);
        this.input = input;
        break;
      }

      case 'cloudevent': {
        const message = this.cloudEventToJson(this.#config.event);
        const input = this.#InputSchema.parse(message);
        this.input = input;
        break;
      }

      default: {
        throw new Error('Unhandled GCF trigger');
      }
    }

    const env = this.#EnvSchema.parse(process.env);
    this.env = env;
  }

  public async crawl() {
    await this.script();
  }

  #handleHostPageErrors(page: Page) {
    page.on('console', message => {
      if (message.type() === 'error') {
        console.warn(message.text());
      }
      if (message.type() === 'warn') {
        console.warn(message.text());
      }
    });

    page.on('pageerror', e => {
      console.warn(e);
    });
  }

  async setupBrowser(): Promise<Page> {
    const headless = process.env['HEADED_BROWSER_MODE'] !== 'true';
    this.#browser = await chromium.launch(
      process.env['NODE_ENV'] === 'production'
        ? {
          args: [...sparticuzChromium.args, '--disable-web-security'],
          executablePath: await sparticuzChromium.executablePath(),
          headless,
        }
        : {
          headless,
          args: ['--disable-web-security'],
        }
    );
    this.#browserContext = await this.#browser.newContext();
    this.#page = await this.#browserContext.newPage();
    this.#handleHostPageErrors(this.#page);
    return this.#page;
  }

  async setOutput(results: z.input<OUT_SCHEMA>) {
    const parseResults = this.#OutputSchema.safeParse(results);

    if (parseResults.success) {
      this.output = parseResults.data;
    } else {
      console.error(parseResults);
      throw new Error(`Results failed schema validation.`);
    }
  }

  async complete() {
    await this.closePage();

    if (this.#config.trigger === 'http') {
      this.#config.res.status(HttpStatusCode.Ok).send(this.output);
    }

    return this.output;
  }

  async run() {
    try {
      this.setup();
      await this.crawl();
      await this.complete();
    } finally {
      await this.closePage();
    }
  }

  public async script(): Promise<void> {
    assert(false, `Implement crawler script before calling crawl method.`);
  }
}

type GenericZodSchema = z.ZodObject<any>;

export interface CrawlerSharedConfig<
  IN_SCHEMA extends GenericZodSchema,
  ENV_SCHEMA extends GenericZodSchema,
  OUT_SCHEMA extends GenericZodSchema
> {
  retryCount?: number;
  timeoutMs?: number;
  resetBrowserContext?: boolean;
  InputSchema: IN_SCHEMA;
  EnvSchema: ENV_SCHEMA;
  OutputSchema: OUT_SCHEMA;
}

export interface CrawlerHttpConfig<
  IN_SCHEMA extends GenericZodSchema,
  ENV_SCHEMA extends GenericZodSchema,
  OUT_SCHEMA extends GenericZodSchema
> extends CrawlerSharedConfig<IN_SCHEMA, ENV_SCHEMA, OUT_SCHEMA> {
  trigger: 'http';
  req: Request;
  res: Response;
}

export interface CrawlerCloudEventConfig<
  IN_SCHEMA extends GenericZodSchema,
  ENV_SCHEMA extends GenericZodSchema,
  OUT_SCHEMA extends GenericZodSchema
> extends CrawlerSharedConfig<IN_SCHEMA, ENV_SCHEMA, OUT_SCHEMA> {
  trigger: 'cloudevent';
  event: CloudEvent<unknown>;
}

export type CrawlerConfig<
  IN_SCHEMA extends GenericZodSchema,
  ENV_SCHEMA extends GenericZodSchema,
  OUT_SCHEMA extends GenericZodSchema
> =
  | CrawlerHttpConfig<IN_SCHEMA, ENV_SCHEMA, OUT_SCHEMA>
  | CrawlerCloudEventConfig<IN_SCHEMA, ENV_SCHEMA, OUT_SCHEMA>;
