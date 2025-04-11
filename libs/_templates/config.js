
const { execSync } = require('child_process');
const assert = require('node:assert');
const { kebabCase } = require('lodash');

const ConfigTypes = Object.freeze({
  Crawler: 'crawler'
});

module.exports.ConfigTypes = ConfigTypes

module.exports.configBuilder = function (
  /** @type {ConfigTypes} */
  configType
) {
  switch (configType) {
    case ConfigTypes.Crawler: {
      return {
        description:
          'Generates a google cloud function project that can be used to crawl a webpage.',
        prompts: [
          {
            type: 'input',
            name: 'name',
            message:
              'What would you like to name your function? use Pascal casing (e.g., TestFunction).',
          },
        ],
        actions: [
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/vite.config.ts',
            templateFile: 'libs/_templates/crawler/vite.config.ts.hbs',
          },
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/tsconfig.spec.json',
            templateFile: 'libs/_templates/crawler/tsconfig.spec.json.hbs',
          },
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/tsconfig.json',
            templateFile: 'libs/_templates/crawler/tsconfig.json',
          },
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/tsconfig.app.json',
            templateFile: 'libs/_templates/crawler/tsconfig.app.json.hbs',
          },
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/project.json',
            templateFile: 'libs/_templates/crawler/project.json.hbs',
          },
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/package.json',
            templateFile: 'libs/_templates/crawler/package.json.hbs',
          },
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/.eslintrc',
            templateFile: 'libs/_templates/crawler/.eslintrc',
          },

          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/src/{{kebabCase name}}.crawler.ts',
            templateFile:
              'libs/_templates/crawler/src/template.crawler.ts.hbs',
          },
          {
            type: 'add',
            path: 'functions/{{kebabCase name}}/src/main.ts',
            templateFile: 'libs/_templates/crawler/src/main.ts.hbs',
          },
          // libs/zod-schema/src/lib/functions
          {
            type: 'add',
            path: 'libs/zod-schema/src/lib/functions/{{kebabCase name}}/{{kebabCase name}}-env.schema.ts',
            templateFile:
              'libs/_templates/crawler/src/schema/template-env.schema.ts.hbs',
          },
          {
            type: 'add',
            path: 'libs/zod-schema/src/lib/functions/{{kebabCase name}}/{{kebabCase name}}-in.schema.ts',
            templateFile:
              'libs/_templates/crawler/src/schema/template-in.schema.ts.hbs',
          },
          {
            type: 'add',
            path: 'libs/zod-schema/src/lib/functions/{{kebabCase name}}/{{kebabCase name}}-out.schema.ts',
            templateFile:
              'libs/_templates/crawler/src/schema/template-out.schema.ts.hbs',
          },
          {
            type: 'add',
            path: 'libs/zod-schema/src/lib/functions/{{kebabCase name}}/index.ts',
            template: `export * from './{{kebabCase name}}-env.schema';\rexport * from './{{kebabCase name}}-in.schema';\rexport * from './{{kebabCase name}}-out.schema'\r`,
          },
          {
            type: 'append',
            pattern: /(\/\/ TEMPLATE ENTRYPOINT - DO NOT DELETE)/g,
            template: `export * as {{name}} from './{{kebabCase name}}/index';`,
            path: 'libs/zod-schema/src/lib/functions/index.ts',
          },

          // libs/playwright-scripts/src/lib/functions
          {
            type: 'append',
            pattern: /(\/\/ TEMPLATE ENTRYPOINT - DO NOT DELETE)/g,
            template: `export * from './{{kebabCase name}}';`,
            path: 'libs/playwright-scripts/src/lib/functions/index.ts',
          },

          {
            type: 'add',
            template: `export * from './{{kebabCase name}}.script';export * from './pages';`,
            path: 'libs/playwright-scripts/src/lib/functions/{{kebabCase name}}/index.ts',
          },

          {
            type: 'add',
            templateFile: `libs/_templates/crawler/src/scripts/script.ts.hbs`,
            path: 'libs/playwright-scripts/src/lib/functions/{{kebabCase name}}/{{kebabCase name}}.script.ts',
          },

          {
            type: 'add',
            template: `export * from './{{kebabCase name}}-home.page';export * from './{{kebabCase name}}-about.page';`,
            path: 'libs/playwright-scripts/src/lib/functions/{{kebabCase name}}/pages/index.ts',
          },
          
          {
            type: 'add',
            templateFile: `libs/_templates/crawler/src/scripts/home.page.ts.hbs`,
            path: 'libs/playwright-scripts/src/lib/functions/{{kebabCase name}}/pages/{{kebabCase name}}-home.page.ts',
          },

          {
            type: 'add',
            templateFile: `libs/_templates/crawler/src/scripts/about.page.ts.hbs`,
            path: 'libs/playwright-scripts/src/lib/functions/{{kebabCase name}}/pages/{{kebabCase name}}-about.page.ts',
          },

          async answers => {
            assert(answers.name, `Name is required to generate a crawler.`);
            execSync(`npx nx reset`, { stdio: 'inherit' });
            execSync(`echo  🔎 Successfully generated crawler ${answers.name}`, {
              stdio: 'inherit',
            });
          },
        ],
      }
    }
    default: {
      throw new Error(`${configType} has no config.`)
    }
  }
};
