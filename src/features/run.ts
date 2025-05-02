import { rolldown } from "rolldown";

/**
 * Run a given TypeScript file using Rolldown.
 * @param {string} filePath - The path to the TypeScript file to run.
 * @returns {Promise<void>} - A promise that resolves when the file has finished running.
 */
export const run = async (filePath: string): Promise<void> => {
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

	// Run the code using eval
	// biome-ignore lint/security/noGlobalEval: eval is required to run the code
	const result: unknown = eval(code);
	// Check if the result is a promise
	if (result && typeof result === "object" && "then" in result) {
		// If it is a promise, wait for it to resolve
		await result;
	}
	// If it is not a promise, just return
	return;
};
