import path from "node:path";
import { rolldown } from "rolldown";

/**
 * `rundown` main entry point.
 * @param {string[]} args - Command line arguments.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 */
const main = async (args: string[]): Promise<void> => {
	// Get the file to run
	const fileToRun = args[0];
	const filePath = path.resolve(process.cwd(), fileToRun);

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

// Execute the main function with the command line arguments
main(process.argv.slice(2))
	.then(() => {
		// Exit the process with a success code
		process.exit(0);
	})
	.catch((error) => {
		// Log the error message to the console
		console.error(error.message);
		// Exit the process with a failure code
		process.exit(1);
	});
