import 'mocha';
import { bind } from "../";
// import { bind } from '../../dist'
import * as _ from 'underscore.string';
import * as assert from 'assert';

describe("Default Suite", () => {
  after(() => {
    delete process.env.EXT;
  });

  it("cascadeMatch", async () => {
    const env = bind({ getFilter: (name: string)=> { return ()=> {}} });

    assert(env.getFilter('camelize')===_.camelize, "must return 'camelize'");
  });
});
