import * as B from "../../layout/box";
import { Param } from "../../param";
import { Macro, Scope } from "../interface";

export function SpaceMacros(par: Param, macros: Scope<B.Box>) {
	const space = (s: string) => Macro(() => new B.SpBox(par, s));

	macros["nospace"] = space("");
	macros["~"] = space(" ");
	macros["~~"] = space("\u2002");
	macros["~~~"] = space("\u2003");
	macros["quad"] = space("\u2003");
	macros["qquad"] = space("\u2003\u2003");
}
