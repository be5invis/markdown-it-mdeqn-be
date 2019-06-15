export { default as css, em } from "./css";

function escapeHtml(unsafe: string) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function joinProps(props: { [key: string]: number | string }) {
	let s = "";
	for (const key in props) {
		if (s) s += " ";
		s += `${key}="${escapeHtml(props[key] + "")}"`;
	}
	return s;
}

export function Node(tag: string) {
	return function(props: { [key: string]: number | string }, ...children: string[]) {
		if (!children || !children.length) {
			return `<${tag} ${joinProps(props)}/>`;
		} else {
			return `<${tag} ${joinProps(props)}>${children.join("")}</${tag}>`;
		}
	};
}
export function text(s: string) {
	return escapeHtml(s);
}
export type HtmlProps = { [key: string]: number | string };
