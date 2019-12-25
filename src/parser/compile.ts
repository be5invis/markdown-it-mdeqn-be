import * as Boxes from "../layout/box";
import { Param } from "../param";

import {
	DisplayCell,
	DisplayCellType,
	Macro,
	Primitives,
	Scope,
	Token,
	TokenType
} from "./interface";

export class Compiler {
	constructor(
		private q: Token[],
		private readonly macros: Scope<Boxes.Box>,
		private readonly primitives: Primitives<Boxes.Box>
	) {}
	private j = 0;

	public display() {
		let cells: DisplayCell[][] = [];
		cells.push([{ type: DisplayCellType.CELL, cell: this.inline() }]);
		while (this.j < this.q.length) {
			const token = this.q[this.j];
			if (!token || !this.isEndExpression(token)) break;
			this.j++;

			const cellContent = this.inline();
			if (token.type === TokenType.NEWLINE) {
				cells.push([{ type: DisplayCellType.CELL, cell: cellContent }]);
			} else if (token.c === "#") {
				cells[cells.length - 1].push({
					type: DisplayCellType.CROSS_REF,
					cell: cellContent
				});
			} else {
				cells[cells.length - 1].push({ type: DisplayCellType.CELL, cell: cellContent });
			}
		}
		return cells;
	}

	public inline() {
		let terms: Boxes.Box[] = [];
		while (this.j < this.q.length) {
			const token = this.q[this.j];
			if (!token || this.isEndBracket(token) || this.isEndExpression(token)) break;
			if (token.type === TokenType.NEWLINE) {
				this.j++;
				continue;
			}
			if (this.macros[token.c]) {
				let macroName = token.c;
				let theMacro = this.macros[macroName];
				terms = this.macroCall(theMacro, macroName, terms);
			} else {
				terms.push(this.term());
			}
		}
		if (terms.length === 0) return this.primitives.empty();
		if (terms.length === 1) return terms[0];
		return this.primitives.hCombine(...terms);
	}

	private isEndBracket(token: Token) {
		return (
			token.type === TokenType.BRACKET &&
			(token.c === ")" || token.c === "]" || token.c === "}")
		);
	}
	private isEndExpression(token: Token) {
		return (
			(token.type === TokenType.NEWLINE && token.c[0] !== "\\") ||
			(token.type === TokenType.SYMBOL && (token.c === "&" || token.c === "#"))
		);
	}

	private macroCall(theMacro: Macro<Boxes.Box>, macroName: string, terms: Boxes.Box[]) {
		let arity = theMacro.arity;
		this.j++;
		if (arity) {
			if (/^:/.test(macroName)) {
				terms = terms.slice(0, -arity).concat(theMacro.call(...terms.slice(-arity)));
			} else if (/:$/.test(macroName)) {
				let parameters = [];
				for (let i = 0; i < arity; i++) {
					parameters.push(this.term());
				}
				terms.push(theMacro.call(...parameters));
			} else {
				let parameters;
				if (terms.length) {
					parameters = [terms[terms.length - 1]];
					terms.length -= 1;
				} else {
					parameters = [this.primitives.empty()];
				}
				for (let i = 1; i < arity; i++) {
					parameters.push(this.term());
				}
				terms.push(theMacro.call(...parameters));
			}
		} else {
			terms.push(theMacro.call());
		}
		return terms;
	}

	public term() {
		const token = this.q[this.j];
		if (token.type === TokenType.BRACKET && token.c === "(") return this.parenGroup();
		if (token.type === TokenType.BRACKET && token.c === "[") return this.brackGroup();
		if (token.type === TokenType.BRACKET && token.c === "{") return this.braceGroup();
		this.j++;
		return this.primitives.processToken(token);
	}

	private braceGroup() {
		this.j++;
		let r = this.inline();
		if (!this.q[this.j] || this.q[this.j].c !== "}") throw new Error("Mismatch bracket!");
		this.j++;
		return r;
	}

	private brackGroup() {
		this.j++;
		let r = this.inline();
		if (!this.q[this.j] || this.q[this.j].c !== "]") throw new Error("Mismatch bracket!");
		this.j++;
		return this.primitives.brackEnclosure(r);
	}

	private parenGroup() {
		this.j++;
		let r = this.inline();
		if (!this.q[this.j] || this.q[this.j].c !== ")") throw new Error("Mismatch bracket!");
		this.j++;
		return this.primitives.parenEnclosure(r);
	}
}

export class BoxPrimitives implements Primitives<Boxes.Box> {
	constructor(private param: Param) {}
	public empty() {
		return new Boxes.CBox(this.param, "");
	}
	public hCombine(...boxes: Boxes.Box[]) {
		return new Boxes.HBox(this.param, boxes);
	}
	public brackEnclosure(box: Boxes.Box) {
		return new Boxes.BBox(
			this.param,
			new Boxes.BracketStart(this.param, "["),
			box,
			new Boxes.BracketEnd(this.param, "]")
		);
	}
	public parenEnclosure(box: Boxes.Box) {
		return new Boxes.BBox(
			this.param,
			new Boxes.BracketStart(this.param, "("),
			box,
			new Boxes.BracketEnd(this.param, ")")
		);
	}
	public processToken(token: Token) {
		if (token.type === TokenType.ID && /^[a-zA-Z]/.test(token.c)) {
			return new Boxes.VarBox(this.param, token.c);
		} else if (token.type === TokenType.ID && /^[0-9]/.test(token.c)) {
			// A number
			return new Boxes.NumberBox(this.param, token.c);
		} else if (token.type === TokenType.TEXT) {
			return new Boxes.CBox(this.param, token.c.slice(1, -1));
		} else if (token.type === TokenType.TT) {
			return new Boxes.CodeBox(this.param, token.c.slice(1, -1).replace(/``/g, "`"));
		} else if (token.type === TokenType.SYMBOL) {
			return new Boxes.OpBox(this.param, token.c, "Bin");
		} else {
			return new Boxes.CBox(this.param, token.c);
		}
	}
}
