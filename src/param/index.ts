import { DefaultParam } from "./default";
import { Param } from "./interface";

export { Param } from "./interface";
export function createParam(param: Partial<Param>): Param {
	return {
		...DefaultParam,
		...param,
		kernAssignments: [
			...(param ? param.kernAssignments || [] : []),
			...DefaultParam.kernAssignments
		]
	};
}
