import { spawn } from "node:child_process";

interface ExecutionResult {
	exitCode: number;
	output: string;
}

/**
 * Executes JavaScript code in a Node.js child process and returns the result.
 * @param code The JavaScript code to execute as a string.
 * @param {...any} args - Additional arguments to pass to the Node process.
 * @returns Promise that resolves with the exit code and console output (default exit code is 0).
 */
export async function execute(
	code: string,
	// biome-ignore lint/suspicious/noExplicitAny: Any is used here to allow flexibility in the arguments passed to the Node process
	...args: any
): Promise<ExecutionResult> {
	return new Promise((resolve, reject) => {
		// Get the path to the Node.js executable in the current environment
		const nodePath = process.execPath;
		// Spawn a Node.js process that reads from stdin
		const childProcess = spawn(nodePath, ["--input-type=module", ...args, "-"]);

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

		// Write code to stdin
		childProcess.stdin.write(code);
		// End the stdin stream to signal that the code has been fully written
		childProcess.stdin.end();
	});
}
