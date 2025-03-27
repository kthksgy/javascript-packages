import * as os from "node:os";

import { expect, test } from "vitest";

import { execute } from "./execute";

test(execute.name, async function () {
  expect(await execute(["echo", "Hello, World!"])).toStrictEqual([
    null,
    "Hello, World!" + os.EOL,
    null,
  ]);
});
