import 'mocha';
import { bind } from "../";
// import { bind } from '../../dist'
import * as _ from 'underscore.string';
import * as assert from 'assert';
import { Environment } from 'nunjucks';

describe("Default Suite", () => {
  after(() => {
    delete process.env.EXT;
  });

  it("cascadeMatch", async () => {
    const env = bind(
      new Environment(null, {
        tags: {
          variableStart: '{{'
        },
      })
    ) as Environment;

    assert(env.getFilter('camelize')===_.camelize, "must return 'camelize'");

    const rendered = env.renderString([
      `pascalCase: my name  => {{ 'my name'      | pascalCase }}  // MyName`,
      `encode64:   foo      => {{ 'foo'          | encode64 }}    // Zm9v`,
      `decode64:   Zm9v     => {{ 'Zm9v'         | decode64 }}    // foo`,
      `encodeHex:  foo      => {{ 'foo'          | encodeHex }}   // 666f6f`,
      `decodeHex:  666f6f   => {{ '666f6f'       | decodeHex }}   // foo`,
      `duration:   36000    => {{ 36000          | duration }}    // 36s`,
      `duration:   4s       => {{ '4s'           | duration }}    // 4000`,
    ].join('\n'), {});
    assert(rendered)
  });
});
