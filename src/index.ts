#!/usr/bin/env node
import { cli } from "./cli";

// Execute the main function with the command line arguments
cli(process.argv.slice(2))
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
