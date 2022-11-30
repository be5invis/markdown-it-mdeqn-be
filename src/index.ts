import * as MarkdownIt from "markdown-it";

import { createParam } from "./param";
import { renderDisplay, renderInline } from "./renderer";
import { initScope } from "./scope";

export = (md: MarkdownIt, options: any) => {
	const parameters = createParam(options.layoutParams || {});
	const scope = initScope(parameters);

	const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules);
	md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
		const token = tokens[idx];
		const code = token.content.trim();
		const info = token.info ? md.utils.unescapeAll(token.info).trim() : "";
		let langName = "";

		if (info) {
			langName = info.split(/\s+/g)[0];
		}

		switch (langName) {
			case "eqn":
				return renderDisplay(parameters, scope, info.split(/\s+/g).slice(1), code);
		}

		return defaultFence(tokens, idx, options, env, slf);
	};

	const defaultBacktick = md.renderer.rules.code_inline!.bind(md.renderer.rules);
	md.renderer.rules.code_inline = (tokens, idx, options, env, slf) => {
		const token = tokens[idx];
		if (isValidEquation(token.content)) {
			return renderInline(parameters, scope, token.content.slice(4, -1));
		}
		return defaultBacktick(tokens, idx, options, env, slf);
	};
};

function isValidEquation(s: string) {
	return s.slice(0, 3) === "eqn" && isMatchingChar(s[3], s[s.length - 1]);
}
function isMatchingChar(a: string, b: string) {
	return (a === "{" && b === "}") || (a === "[" && b === "]") || (a === "(" && b === ")");
}
