import * as B from "../box";
import { Param } from "../param";

import { Macro, Scope } from "./interface";

export function CompositeMacros(par: Param, macros: Scope<B.Box>) {
	macros.over = Macro((left, right) => new B.FracBox(par, left, right));
	macros.tover = Macro((left, right) => {
		return new B.RaiseBox(
			par,
			par.FRAC_MIDDLE - par.FRAC_PADDING_DEN * par.SS_SIZE,
			new B.ScaleBox(
				par,
				par.SS_SIZE,
				new B.RaiseBox(
					par,
					-par.FRAC_MIDDLE + par.FRAC_PADDING_DEN,
					new B.FracBox(par, left, right),
					true
				)
			),
			true
		);
	});
	macros.above = Macro((upper, lower) => {
		let upperParts = [upper],
			lowerParts = [lower];
		if (upper instanceof B.StackBox) upperParts = upper.parts;
		if (lower instanceof B.StackBox) lowerParts = lower.parts;
		return new B.StackBox(par, upperParts.concat(lowerParts));
	});
	macros.sqrt = macros["sqrt:"] = Macro(operand => new B.SqrtBox(par, operand));
	macros.root = Macro(
		(left, right) =>
			new B.HBox(par, [
				new B.KernBox(
					par,
					par.ROOT_KERN,
					new B.RaiseBox(
						par,
						par.ROOT_RISE,
						new B.SupSubPile(par, new B.CBox(par, ""), left, null)
					)
				),
				new B.SqrtBox(par, right)
			])
	);

	macros["^"] = Macro((base, sup) => {
		if (base instanceof B.SupSubBox && !base.sup) {
			return new B.SupSubBox(par, base.base, sup, base.sub);
		} else {
			return new B.SupSubBox(par, base, sup, null);
		}
	});
	macros["_"] = Macro((base, sub) => {
		if (base instanceof B.SupSubBox && !base.sub) {
			return new B.SupSubBox(par, base.base, base.sup, sub);
		} else {
			return new B.SupSubBox(par, base, null, sub);
		}
	});
	macros["^^"] = Macro((base, sup) => {
		if (base instanceof B.LimitsBox && !base.sup) {
			return new B.LimitsBox(par, base.base, sup, base.sub);
		} else {
			return new B.LimitsBox(par, base, sup, null);
		}
	});
	macros["__"] = Macro((base, sub) => {
		if (base instanceof B.LimitsBox && !base.sub) {
			return new B.LimitsBox(par, base.base, base.sup, sub);
		} else {
			return new B.LimitsBox(par, base, null, sub);
		}
	});
}
