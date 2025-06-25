import { fileURLToPath } from "node:url";
import { rolldown } from "rolldown";
import { builtinModules, register } from "node:module";
import type { LoadHook } from "node:module";

const tsExtensions = new Set([".ts", ".tsx", ".mts", ".cts"]);
const builtinModulesSet = new Set(builtinModules);

/**
 * Custom loader for Node.js that transforms TypeScript files using Rolldown.
 * @param url The URL of the module to load.
 * @param context The context in which the module is being loaded.
 * @param nextLoad The next load hook in the chain.
 * @throws If the transformation fails or if the output is empty.
 * @returns An object containing the transformed module code and format.
 */
export const load: LoadHook = async (url, context, nextLoad) => {
	// Check if the URL has a file: scheme before converting
	if (!url.startsWith("file:")) {
		return nextLoad(url, context);
	}

	const filePath = fileURLToPath(url);
	const extension = `.${filePath.split(".").slice(-1)[0]}`;

	if (tsExtensions.has(extension)) {
		try {
			const bundle = await rolldown({
				input: filePath,
				external: (id) => {
					// Handle Node.js built-in modules
					if (builtinModulesSet.has(id) || id.startsWith("node:")) {
						return true;
					}
					// Handle npm packages (not relative or absolute paths)
					return !id.startsWith(".") && !id.startsWith("/");
				},
				resolve: {
					extensions: [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx"],
				},
			});

			const { output } = await bundle.generate({
				format: "esm",
			});

			// Verify that the output is not empty
			if (!output || output.length === 0) {
				throw new Error("No output chunk found");
			}

			return {
				format: "module",
				source: output[0].code,
				shortCircuit: true,
			};
		} catch (error) {
			throw new Error(
				`Failed to transform ${filePath}: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		}
	}

	return nextLoad(url, context);
};

// Fix the register call - use import.meta.url as parent URL
register("./loader.mjs", import.meta.url);
