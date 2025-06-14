import { expect, test, describe } from "vitest";
import { run } from "../src/features/run";

describe("rundown", () => {
	test("should run hello world", async () => {
		const result = await run("./test/fixtures/hello-world.data.ts");
		expect(result).toMatchSnapshot();
	});

	test("should run export function hello world", async () => {
		const result = await run("./test/fixtures/export-function.data.ts");
		expect(result).toMatchSnapshot();
	});
});
