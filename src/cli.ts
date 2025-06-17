import path from "node:path";
import fs from "node:fs";
import { run } from "./features/run";
import { watch } from "./features/watch";
import { startRepl } from "./features/repl";

/**
 * `rundown` command entry point.
 * @param {string[]} args - Command line arguments.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 */
export const cli = async (args: string[]): Promise<void> => {
	// If no arguments are provided, start the REPL
	if (args.length === 0) {
		await startRepl();
		return;
	}

	// Get given file path from command line arguments
	const fileToRun = args[0];
	// Check if the file path is provided
	if (!fileToRun) {
		throw new Error("Please provide a file path to run.");
	}

	// Get the watch flag
	const watchFlag = args.includes("--watch") || args.includes("-w");

	// Resolve the file path to an absolute path
	const filePath = path.resolve(process.cwd(), fileToRun);
	// Check if the file exists
	if (!fs.existsSync(filePath)) {
		throw new Error(`File not found: ${filePath}`);
	}

	if (watchFlag) {
		// Watch and run the file using Rolldown
		await watch(filePath);
	} else {
		// Run the file using Rolldown
		await run(filePath);
	}
};
