import { Form, Invoke, Macro, Primitives, Scope, Token, TokenType } from "./interface";

export class Compiler {
	constructor(
		private q: Token[],
		private readonly macros: Scope,
		private readonly primitives: Primitives
	) {}
	private j = 0;

	public expr() {
		let terms: Form[] = [];
		const token = this.q[this.j];
		while (token && !this.isEndBracket(token)) {
			if (this.macros[token.c] && this.macros[token.c].arity) {
				let macroName = token.c;
				let theMacro = this.macros[macroName];
				terms = this.macroCall(theMacro, macroName, terms);
			} else {
				terms.push(this.term());
			}
		}
		if (terms.length === 0) return Invoke(this.primitives.empty);
		if (terms.length === 1) return terms[0];
		return Invoke(this.primitives.HCombine, ...terms);
	}

	private isEndBracket(token: Token) {
		return (
			token.type === TokenType.BRACKET &&
			(token.c === ")" || token.c === "]" || token.c === "}")
		);
	}

	private macroCall(theMacro: Macro, macroName: string, terms: Form[]) {
		let arity = theMacro.arity;
		this.j++;
		if (/^:/.test(macroName)) {
			terms = terms.slice(0, -arity).concat(Invoke(theMacro, ...terms.slice(-arity)));
		} else if (/:$/.test(macroName)) {
			let parameters = [];
			for (let i = 0; i < arity; i++) {
				parameters.push(this.term());
			}
			terms.push(Invoke(theMacro, ...parameters));
		} else {
			let parameters;
			if (terms.length) {
				parameters = [terms[terms.length - 1]];
				terms.length -= 1;
			} else {
				parameters = [Invoke(this.primitives.empty)];
			}
			for (let i = 1; i < arity; i++) {
				parameters.push(this.term());
			}
			terms.push(Invoke(theMacro, ...parameters));
		}
		return terms;
	}

	public term() {
		let token = this.q[this.j];
		if (token.type === TokenType.BRACKET && token.c === "(") return this.parenGroup();
		if (token.type === TokenType.BRACKET && token.c === "[") return this.brackGroup();
		if (token.type === TokenType.BRACKET && token.c === "{") return this.braceGroup();
		return token;
	}

	private braceGroup() {
		this.j++;
		let r = this.expr();
		if (!this.q[this.j] || this.q[this.j].c !== "}") throw new Error("Mismatch bracket!");
		this.j++;
		return r;
	}

	private brackGroup() {
		this.j++;
		let r = this.expr();
		if (!this.q[this.j] || this.q[this.j].c !== "]") throw new Error("Mismatch bracket!");
		this.j++;
		return Invoke(this.primitives.brackEnclosure, r);
	}

	private parenGroup() {
		this.j++;
		let r = this.expr();
		if (!this.q[this.j] || this.q[this.j].c !== ")") throw new Error("Mismatch bracket!");
		this.j++;
		return Invoke(this.primitives.parenEnclosure, r);
	}
}
