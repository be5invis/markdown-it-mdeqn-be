import { paramCase } from "param-case";

export function css(props: { [key: string]: number | string }) {
	let s = "";
	for (const key in props) {
		if (s) s += "; ";
		s += `${paramCase(key)}:${props[key]}`;
	}
	return s;
}

export function em(x: number) {
	return x + "em";
}
