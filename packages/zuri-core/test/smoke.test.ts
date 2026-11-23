import { describe, expect, it } from "vitest";

import { ZURI_CORE_VERSION } from "../src/index";

describe("zuri-core", () => {
  it("reports its version", () => {
    expect(ZURI_CORE_VERSION).toBe("0.0.0");
  });
});
