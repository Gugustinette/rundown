import { tap } from "node:test/reporters";
import { run } from "node:test";
import process from "node:process";
import path from "node:path";

/**
 * Extend the Node.js test runner to support TypeScript files.
 */
export const test = async (): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		run({ files: [path.resolve(process.cwd(), "playground/test.test.mjs")] })
			.compose(tap)
			.pipe(process.stdout)
			.on("close", (exitCode) => {
				if (exitCode === 0) {
					resolve();
				} else {
					reject(new Error(`Test suite failed with exit code ${exitCode}`));
				}
			})
			.on("error", (error) => {
				reject(new Error(`Failed to run test suite: ${error.message}`));
			});
	});
};
