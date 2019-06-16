import { FracBox, RaiseBox, ScaleBox } from "../box";

import { Macro, Scope } from "./interface";

export default function registerComposite(scope: Scope) {
	scope.over = Macro((b, num, den) => new FracBox(b.param, b.build(num), b.build(den)));
	scope.tover = Macro(
		(b, num, den) =>
			new RaiseBox(
				b.param,
				b.param.FRAC_MIDDLE - b.param.FRAC_PADDING_DEN * b.param.SS_SIZE,
				new ScaleBox(
					b.param,
					b.param.SS_SIZE,
					new RaiseBox(
						b.param,
						-b.param.FRAC_MIDDLE + b.param.FRAC_PADDING_DEN,
						new FracBox(b.param, b.build(num), b.build(den))
					)
				)
			)
	);
}
