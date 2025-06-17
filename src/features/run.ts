import { rolldown } from "rolldown";
import { execute } from "../utils/execute";

/**
 * Run a given TypeScript file using Rolldown.
 * @param {string} filePath - The path to the TypeScript file to run.
 * @param {...any} args - Additional arguments to pass to the Node process.
 * @returns {Promise<string>} - A promise that resolves with the code's output when the file has finished running.
 */
// biome-ignore lint/suspicious/noExplicitAny: Any is used here to allow flexibility in the arguments passed to the Node process
export const run = async (filePath: string, ...args: any): Promise<string> => {
	// Setup bundle
	const bundle = await rolldown({
		// Input options (https://rolldown.rs/reference/config-options#inputoptions)
		input: filePath,
	});

	// Generate bundle in memory
	const rolldownOutput = await bundle.generate({
		// Output options (https://rolldown.rs/reference/config-options#outputoptions)
		format: "esm",
	});

	// Verify that the output is not empty
	if (!rolldownOutput.output[0]) {
		throw new Error("No output chunk found");
	}
	// Get the output chunk
	const outputChunk = rolldownOutput.output[0];
	const code = outputChunk.code;

	// Run the code
	const result = await execute(code, ...args);
	// Return the output
	return result.output;
};
