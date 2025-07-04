import { rawExecute } from "../utils/execute";
import type { ExecutionResult } from "../utils/execute";

/**
 * Run the Node test runner with a custom loader for TypeScript files.
 * @param {string[]} args - Additional arguments to pass to the Node process.
 * @returns {Promise<void>} - A promise that resolves when the test runner has finished executing.
 */
export const test = async (args: string[]): Promise<ExecutionResult> => {
	// Resolve the loader path from the package
	const loaderPath = require.resolve("./loader.mjs");

	// Use rawExecute to spawn Node with the loader and args
	return rawExecute(["--import", loaderPath, ...args]);
};
