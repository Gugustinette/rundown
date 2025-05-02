import path from "node:path";
import fs from "node:fs";
import { run } from "./features/run";
import { watch } from "./features/watch";

/**
 * `rundown` main entry point.
 * @param {string[]} args - Command line arguments.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 */
const main = async (args: string[]): Promise<void> => {
	// Get given file path from command line arguments
	const fileToRun = args[0];
	// Check if the file path is provided
	if (!fileToRun) {
		throw new Error("Please provide a file path to run.");
	}

	// Get the watch flag
	const watchFlag = args.includes("--watch") || args.includes("-w");

	// Get the file path
	const filePath = path.resolve(process.cwd(), fileToRun);
	// Check if the file exists
	if (!fs.existsSync(filePath)) {
		throw new Error(`File not found: ${filePath}`);
	}

	if (watchFlag) {
		await watch(filePath);
	} else {
		// Run the file using Rolldown
		const result = await run(filePath);
		return result;
	}
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
