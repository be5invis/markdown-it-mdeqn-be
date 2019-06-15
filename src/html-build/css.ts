export default function css(props: { [key: string]: number | string }) {
	let s = "";
	for (const key in props) {
		if (s) s += "; ";
		s += `${key}:${props[key]}`;
	}
	return s;
}

export function em(x: number) {
	return x + "em";
}
