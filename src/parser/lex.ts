import { Token, TokenType } from "./interface";

const reToken = /(\\?\r?\n)|("(?:[^\\\"]|\\.)*")|(`(?:[^`]|``)*`)|([\[\(\{<]:|:[\]\}\)>])|(:?[a-zA-Z0-9\u0080-\uffff]+:?|\.\d+)|([\[\]\(\)\{\}])|([\.\,\;]|[\/<>?:'|\\\-_+=~!@#$%^&*]+)/g;
function walk(
	r: RegExp,
	s: string,
	fMatch: (...matches: string[]) => void,
	fGap: (gap: string) => void
) {
	let l = r.lastIndex;
	r.lastIndex = 0;
	fMatch = fMatch || function() {};
	fGap = fGap || function() {};
	let match,
		last = 0;
	while ((match = r.exec(s))) {
		if (last < match.index) fGap(s.slice(last, match.index));
		fMatch(...match);
		last = r.lastIndex;
	}
	if (last < s.length) fGap(s.slice(last));
	r.lastIndex = l;
	return s;
}
export function lex(s: string) {
	let q: Token[] = [];
	walk(
		reToken,
		s,
		function(m, newline, text, tt, rs, id, b, sy) {
			if (newline) q.push({ type: TokenType.NEWLINE, c: newline });
			if (text) q.push({ type: TokenType.TEXT, c: text.slice(1, -1).replace(/\\"/g, '"') });
			if (tt) q.push({ type: TokenType.TT, c: tt });
			if (rs) q.push({ type: TokenType.SYMBOL, c: rs });
			if (id) q.push({ type: TokenType.ID, c: id });
			if (b) q.push({ type: TokenType.BRACKET, c: b });
			if (sy) q.push({ type: TokenType.SYMBOL, c: sy });
			return "";
		},
		function(space) {}
	);
	return q;
}
