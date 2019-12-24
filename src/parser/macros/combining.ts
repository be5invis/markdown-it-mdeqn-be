import * as B from "../../box";
import { Param } from "../../param";
import { Macro, Scope } from "../interface";

export function CombiningMacros(par: Param, macros: Scope<B.Box>) {
	const comb = (s: string) =>
		Macro((b: B.Box) => {
			if (b instanceof B.CBox) {
				b.append(s);
				return b;
			} else {
				return b;
			}
		});

	macros.grave = comb("\u0300");
	macros.acute = comb("\u0301");
	macros.hat = comb("\u0302");
	macros.tilde = comb("\u0303");
	macros.bar = comb("\u0304");
	macros.overbar = comb("\u0305");
	macros.breve = comb("\u0306");
	macros.ovdot = comb("\u0307");
	macros.ovddot = comb("\u0308");
	macros.ovhook = comb("\u0309");
	macros.ocirc = comb("\u030A");
	macros.check = comb("\u030C");
	macros.candra = comb("\u0310");
	macros.oturnedcomma = comb("\u0312");
	macros.ocommatopright = comb("\u0315");
	macros.droang = comb("\u031A");
	macros.not = comb("\u0338");
	macros.leftharpoonaccent = comb("\u20D0");
	macros.rightharpoonaccent = comb("\u20D1");
	macros.vertoverlay = comb("\u20D2");
	macros.overleftarrow = comb("\u20D6");
	macros.vec = comb("\u20D7");
	macros.dddot = comb("\u20DB");
	macros.ddddot = comb("\u20DC");
	macros.overleftrightarrow = comb("\u20E1");
	macros.annuity = comb("\u20E7");
	macros.widebridgeabove = comb("\u20E9");
	macros.asteraccent = comb("\u20F0");
	macros.wideutilde = comb("\u0330");
	macros.underbar = comb("\u0331");
	macros.threeunderdot = comb("\u20E8");
	macros.underrightharpoondown = comb("\u20EC");
	macros.underleftharpoondown = comb("\u20ED");
	macros.underleftarrow = comb("\u20EE");
	macros.underrightarrow = comb("\u20EF");
}
