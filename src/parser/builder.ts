import { Box, CBox } from "../box";
import { Param } from "../param";

import { Builder, Form, isToken } from "./interface";

export class BoxBuilder implements Builder {
	constructor(readonly param: Param) {}

	public build(form: Form): Box {
		if (isToken(form)) {
			return new CBox(this.param, form.c);
		} else {
			return form.macro.call(this, ...form.args);
		}
	}
}
