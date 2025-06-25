import { rawExecute } from "../utils/execute";
import type { ExecutionResult } from "../utils/execute";

/**
 * Run the Node test runner with a custom loader for TypeScript files.
 * @param {string[]} args - Additional arguments to pass to the Node process.
 * @returns {Promise<void>} - A promise that resolves when the test runner has finished executing.
 */
export const test = async (args: string[]): Promise<ExecutionResult> => {
	// Use rawExecute to spawn Node with the loader and args
	return rawExecute(["--import", "./dist/loader.mjs", ...args]);
};
