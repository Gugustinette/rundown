import { watch as rolldownWatch } from "rolldown";
import { run } from "./run";

/**
 * Watch a TypeScript file for changes and run it using Rolldown.
 * @param {string} filePath - The path to the TypeScript file to run.
 * @param {...any} args - Additional arguments to pass to the Node process.
 * @returns {Promise<void>} - A promise that resolves when the watcher has finished running.
 */
export const watch = async (
	filePath: string,
	args: string[],
): Promise<void> => {
	const watcher = rolldownWatch({
		input: filePath,
		output: {
			format: "esm",
		},
		watch: {
			// Prevent the watcher from writing the output to disk
			skipWrite: true,
		},
	});

	watcher.on("event", async (event) => {
		if (event.code === "START") {
			// Clear the console
			console.clear();
			// Run the file using Rolldown
			await run(filePath, args);
		}
	});

	// Wait for the user to press Ctrl+C (uses await)
	// This is a workaround to keep the process running
	// while the watcher is active
	await new Promise<void>((resolve) => {
		process.on("SIGINT", () => {
			watcher.close();
			resolve();
		});
	});
};
