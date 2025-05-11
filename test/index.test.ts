import { expect, test, describe } from "vitest";
import { cli } from "../src/cli";

describe("rundown", () => {
	test("should run the file without watch", async () => {
		const args = ["./test/fixtures/index.data.ts"];
		const result = await cli(args);
		expect(result).toBeUndefined();
	});
});
