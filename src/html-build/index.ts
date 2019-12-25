import { css } from "./css";

export { em } from "./css";

function escapeHtml(unsafe: string) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function joinProps(props: HtmlProps) {
	let s = "";
	for (const key in props) {
		if (s) s += " ";
		s += `${key}="${escapeHtml(props[key] + "")}"`;
	}
	return s;
}

export function Node(tag: string) {
	return function(...args: (HtmlProps | string)[]) {
		let props: HtmlProps = {};
		let children: string[] = [];
		for (const arg of args) {
			if (typeof arg === "string") {
				children.push(arg);
			} else {
				for (const key in arg) props[key] = arg[key];
			}
		}
		if (!children.length) {
			return `<${tag} ${joinProps(props)}></${tag}>`;
		} else {
			return `<${tag} ${joinProps(props)}>${children.join("")}</${tag}>`;
		}
	};
}
export function text(s: string) {
	return escapeHtml(s);
}
export type HtmlProps = { [key: string]: number | string };
export function style(args: HtmlProps) {
	return { style: css(args) };
}
