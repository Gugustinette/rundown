import { spawn } from "node:child_process";
import type { ExecutionResult } from "../utils/execute";

/**
 * Run the Node test runner with a custom loader for TypeScript files.
 * @param {string[]} args - Additional arguments to pass to the Node process.
 * @returns {Promise<void>} - A promise that resolves when the test runner has finished executing.
 */
export const test = async (args: string[]): Promise<ExecutionResult> => {
	return new Promise((resolve, reject) => {
		// Get the path to the Node.js executable in the current environment
		const nodePath = process.execPath;
		// Spawn a Node.js process with the custom loader for TypeScript files
		const childProcess = spawn(
			nodePath,
			["--import", "./dist/loader.mjs", ...args],
			{
				stdio: "inherit", // Inherit stdio from the parent process
			},
		);

		// Verify childProcess.stdout, childProcess.stderr, and childProcess.stdin are defined
		if (!childProcess.stdout || !childProcess.stderr || !childProcess.stdin) {
			reject(new Error("Child process stdio streams are not defined"));
			return;
		}

		let output = "";

		// Capture stdout
		childProcess.stdout.on("data", (data) => {
			output += data.toString();
			console.log(data.toString());
		});

		// Capture stderr
		childProcess.stderr.on("data", (data) => {
			output += data.toString();
			console.error(data.toString());
		});

		// Handle process completion
		childProcess.on("close", (exitCode) => {
			resolve({
				exitCode: exitCode ?? 0,
				output: output,
			});
		});

		// Handle potential errors
		childProcess.on("error", (error) => {
			reject(new Error(`Failed to start child process: ${error.message}`));
		});

		childProcess.stdin.on("error", (error) => {
			reject(
				new Error(`Error writing to child process stdin: ${error.message}`),
			);
		});
	});
};
