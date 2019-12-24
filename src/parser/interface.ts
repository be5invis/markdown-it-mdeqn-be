import { Box } from "../box";

export enum TokenType {
	ID = 1,
	BRACKET = 2,
	SYMBOL = 3,
	TEXT = 4,
	TT = 5,
	SPACE = 6
}
export type Token = { type: TokenType; c: string };

export interface Macro<F> {
	readonly arity: number;
	call(...args: F[]): Box;
}
export function Macro<F>(f: (...args: F[]) => Box, arity = f.length - 1): Macro<F> {
	return {
		call: f,
		arity
	};
}

export type Scope<F> = { [key: string]: Macro<F> };
export type MacroRegisterer<F> = (s: Scope<F>) => void;

export interface Primitives<F> {
	empty(): F;
	hCombine(...args: F[]): F;
	brackEnclosure(arg: F): F;
	parenEnclosure(arg: F): F;
	processToken(arg: Token): F;
}
