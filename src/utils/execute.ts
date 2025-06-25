import { spawn } from "node:child_process";

export interface ExecutionResult {
	exitCode: number;
	output: string;
}

/**
 * Executes a command in a Node.js child process and returns the result.
 * @param args Arguments to pass to the Node process.
 * @param input Optional string to write to stdin.
 * @returns Promise that resolves with the exit code and console output.
 */
export async function rawExecute(
	args: string[],
	input?: string,
): Promise<ExecutionResult> {
	return new Promise((resolve, reject) => {
		const nodePath = process.execPath;
		const childProcess = spawn(nodePath, args, {
			stdio: input ? "pipe" : "inherit",
		});

		let output = "";

		if (childProcess.stdout) {
			childProcess.stdout.on("data", (data) => {
				output += data.toString();
				console.log(data.toString());
			});
		}
		if (childProcess.stderr) {
			childProcess.stderr.on("data", (data) => {
				output += data.toString();
				console.error(data.toString());
			});
		}

		childProcess.on("close", (exitCode) => {
			resolve({
				exitCode: exitCode ?? 0,
				output: output,
			});
		});
		childProcess.on("error", (error) => {
			reject(new Error(`Failed to start child process: ${error.message}`));
		});
		if (childProcess.stdin) {
			childProcess.stdin.on("error", (error) => {
				reject(
					new Error(`Error writing to child process stdin: ${error.message}`),
				);
			});
			if (input) {
				childProcess.stdin.write(input);
				childProcess.stdin.end();
			}
		}
	});
}

/**
 * Executes JavaScript code in a Node.js child process and returns the result.
 * @param code The JavaScript code to execute as a string.
 * @param {string[]} args - Additional arguments to pass to the Node process.
 * @returns Promise that resolves with the exit code and console output (default exit code is 0).
 */
export async function execute(
	code: string,
	args?: string[],
): Promise<ExecutionResult> {
	// Use --input-type=module and "-" for stdin as before
	return rawExecute(["--input-type=module", ...(args ?? []), "-"], code);
}
