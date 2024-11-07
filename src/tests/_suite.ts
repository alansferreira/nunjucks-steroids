import 'mocha';
import filters from "../";
// import { bind } from '../../dist'
import * as _ from 'underscore.string';
import * as assert from 'assert';
import { Environment } from 'nunjucks';
import { randomUUID } from 'crypto';

describe("Default Suite", () => {
  after(() => {
    delete process.env.EXT;
  });

  it("filters test", async () => {
    const env = filters(
      new Environment(null, {
        tags: {
          variableStart: '{{'
        },
      })
    ) as Environment;

    assert(env.getFilter('camelize')===_.camelize, "must return 'camelize'");
    const rendered = env.renderString([
      `pascalCase: my name    => {{ 'my name'      | pascalCase }}  // MyName`,
      `encode64:   foo        => {{ 'foo'          | encode64 }}    // Zm9v`,
      `decode64:   Zm9v       => {{ 'Zm9v'         | decode64 }}    // foo`,
      `encodeHex:  foo        => {{ 'foo'          | encodeHex }}   // 666f6f`,
      `decodeHex:  666f6f     => {{ '666f6f'       | decodeHex }}   // foo`,

      `uuid: {% uuid %}`,

      `# see https://github.com/vercel/ms?tab=readme-ov-file#examples`,
      `duration:   36000      => {{ 36000          | duration }}    // 36s`,
      `duration:   4 seconds  => {{ '4 seconds'    | duration(true) }}    // 4000`,
      `duration:   4s         => {{ '4s'           | duration }}    // 4000`,

      `# see https://day.js.org/docs/en/manipulate/manipulate`,
      `# parse from custom format > add one day > reformat`,
      `date:       01/02/2000 => {{ '01/02/2000'   | date('DD/MM/YYYY') | date('add', 1, 'd') | date('format', 'YYYY-MM-DD') }} // 2000-02-02`,
    ].join('\n'), {});
    assert(rendered)
  });
});
