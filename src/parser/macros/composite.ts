import * as B from "../../layout/box";
import { Param } from "../../param";
import { Macro, Scope } from "../interface";

export function FractionMacros(par: Param, macros: Scope<B.Box>) {
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
}
export function RootMacros(par: Param, macros: Scope<B.Box>) {
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
}

export function SupSubMacros(par: Param, macros: Scope<B.Box>) {
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
export function MatrixCompositeMacros(par: Param, macros: Scope<B.Box>) {
	function wrapMatrix(v: B.Box) {
		if (!(v instanceof B.MatrixBox)) return new B.MatrixBox(par, [[v]]);
		else return v;
	}
	macros["&&"] = Macro((_left, _right) => {
		const left = wrapMatrix(_left),
			right = wrapMatrix(_right);

		let rows = Math.max(left.rows, right.rows);
		let columns = left.columns + right.columns;
		let m = [];
		for (let j = 0; j < rows; j++) {
			let r = [];
			for (let k = 0; k < left.columns; k++) {
				if (left.boxes[j] && left.boxes[j][k]) r.push(left.boxes[j][k]);
				else r.push(null);
			}
			for (let k = 0; k < right.columns; k++) {
				if (right.boxes[j] && right.boxes[j][k]) r.push(right.boxes[j][k]);
				else r.push(null);
			}
			m[j] = r;
		}
		return new B.MatrixBox(par, m);
	});

	macros["//"] = Macro((_left, _right) => {
		const left = wrapMatrix(_left),
			right = wrapMatrix(_right);
		return new B.MatrixBox(par, [...left.boxes, ...right.boxes]);
	});
}

export function TextStyleMacros(par: Param, macros: Scope<B.Box>) {
	macros.rm = macros.fn = Macro(cb => {
		if (cb instanceof B.CBox) {
			return new B.CBox(par, cb.getContent());
		} else {
			return cb;
		}
	});
	macros.bf = Macro(cb => {
		if (cb instanceof B.CBox) {
			return new B.CSBox(par, cb.getContent(), "b", {});
		} else {
			return cb;
		}
	});
	macros.bi = Macro(cb => {
		if (cb instanceof B.CBox) {
			return new B.CSBox(par, cb.getContent(), "b", { class: "bold-ital" });
		} else {
			return cb;
		}
	});
	macros.sc = Macro(cb => {
		if (cb instanceof B.CBox) {
			return new B.CSBox(par, cb.getContent(), "b", { class: "small-caps" });
		} else {
			return cb;
		}
	});
	macros.vr = Macro(cb => {
		if (cb instanceof B.CBox) {
			return new B.VarBox(par, cb.getContent());
		} else {
			return cb;
		}
	});
}
export function ManualPositionMacros(par: Param, macros: Scope<B.Box>) {
	macros["raise"] = Macro((left, config) => {
		if (!(config instanceof B.CBox)) return left;
		return new B.RaiseBox(par, parseInt(config.getContent()) || 0, left, true);
	});
	macros["justRaise"] = Macro((left, config) => {
		if (!(config instanceof B.CBox)) return left;
		return new B.RaiseBox(par, parseInt(config.getContent()) || 0, left, false);
	});
	macros["kern"] = Macro((left, config) => {
		if (!(config instanceof B.CBox)) return left;
		return new B.KernBox(par, parseInt(config.getContent()) || 0, left);
	});
}
