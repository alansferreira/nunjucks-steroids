import * as assert from "assert";
// import { cascadeMatch } from "..";
import { bind } from "../";
import * as _ from 'underscore.string';

describe("Default Suite", () => {
  after(() => {
    delete process.env.EXT;
  });

  it("cascadeMatch", async () => {
    const env = bind({ getFilter: (name: string)=> { return ()=> {}} });

    assert(env.getFilter('camelize')===_.camelize, "must return 'camelize'");
  });
});
