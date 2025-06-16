/**
 * Mostly copied from https://github.com/privatenumber/tsx/blob/master/src/patch-repl.ts
 */
import repl, { type REPLServer, type REPLEval } from "node:repl";
import oxc from "oxc-transform";

const patchEval = (nodeRepl: REPLServer) => {
	const { eval: defaultEval } = nodeRepl;
	const preEval: REPLEval = async function (code, context, filename, callback) {
		let codeToRun = code;
		try {
			const { code: transformedCode } = oxc.transform("index.ts", code, {
				target: "esnext",
				define: {
					require: "global.require",
				},
			});
			codeToRun = transformedCode;
		} catch {
			console.error(
				"Failed to transform code with oxc. Consider opening an issue at https://github.com/Gugustinette/rundown/issues with the code you tried to run.",
			);
		}

		return defaultEval.call(this, codeToRun, context, filename, callback);
	};

	// @ts-expect-error overwriting read-only property
	nodeRepl.eval = preEval;
};

const { start } = repl;
repl.start = function (...args) {
	const nodeRepl = Reflect.apply(start, this, args);
	patchEval(nodeRepl);
	return nodeRepl;
};
