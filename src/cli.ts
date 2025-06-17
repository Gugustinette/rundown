import path from "node:path";
import fs from "node:fs";
import { run } from "./features/run";
import { watch } from "./features/watch";
import { startRepl } from "./features/repl";
import { test } from "./features/test";

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

	// If args contains the --test flag, run the test suite
	if (args.includes("--test") || args.includes("-t")) {
		await test();
		return;
	}

	// Get given file path from command line arguments
	const fileToRun = args.find((arg) => !arg.startsWith("-"));
	// Check if the file path is provided
	if (!fileToRun) {
		throw new Error("Please provide a file path to run.");
	}

	// Parse flags
	const watchFlag = args.includes("--watch") || args.includes("-w");

	// Remove rundown arguments from the list
	const passedArgs = args.filter((arg) => !["--watch", "-w"].includes(arg));
	// Remove the file path from the list of arguments
	passedArgs.splice(passedArgs.indexOf(fileToRun), 1);

	// Resolve the file path to an absolute path
	const filePath = path.resolve(process.cwd(), fileToRun);
	// Check if the file exists
	if (!fs.existsSync(filePath)) {
		throw new Error(`File not found: ${filePath}`);
	}

	if (watchFlag) {
		// Watch and run the file using Rolldown
		await watch(filePath, passedArgs);
	} else {
		// Run the file using Rolldown
		await run(filePath, passedArgs);
	}
};
