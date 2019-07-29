import { Box } from "../box";
import { Param } from "../param";

export enum TokenType {
	ID = 1,
	BRACKET = 2,
	SYMBOL = 3,
	TEXT = 4,
	TT = 5,
	SPACE = 6
}
export type Token = { type: TokenType; c: string };

export type Form = Token | Invoke;
export interface Invoke {
	macro: Macro;
	args: Form[];
}
export function Invoke(macro: Macro, ...args: Form[]): Invoke {
	return { macro, args };
}

export function isToken(form: Form): form is Token {
	return (form as any).type;
}

export interface Macro {
	readonly arity: number;
	call(builder: Builder, ...args: Form[]): Box;
}
export function Macro(f: (b: Builder, ...args: Form[]) => Box, arity = f.length - 1): Macro {
	return {
		call: f,
		arity
	};
}

export type Scope = { [key: string]: Macro };
export type MacroRegisterer = (s: Scope) => void;

export interface Builder {
	readonly param: Param;
	build(form: Form): Box;
}

export interface Primitives {
	empty: Macro;
	HCombine: Macro;
	brackEnclosure: Macro;
	parenEnclosure: Macro;
}
