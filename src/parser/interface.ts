import { Box } from "../box";
import { Param } from "../param";

export type Form = string | CompositeForm;
export interface CompositeForm extends Array<Form> {}

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
	withScope(scope: Scope): Builder;
	build(form: Form): Box;
}
