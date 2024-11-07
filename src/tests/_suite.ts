import 'mocha';
// import { cascadeMatch } from "..";
import { bind } from "../";
import * as _ from 'underscore.string';
import assert from 'assert';

describe("Default Suite", () => {
  after(() => {
    delete process.env.EXT;
  });

  it("cascadeMatch", async () => {
    const env = bind({ getFilter: (name: string)=> { return ()=> {}} });

    assert(env.getFilter('camelize')===_.camelize, "must return 'camelize'");
  });
});
