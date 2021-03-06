import { Param } from "./interface";

let LINE_HEIGHT = 1.2;
let CHAR_ASC = 0.9;
let CHAR_DESC = LINE_HEIGHT - CHAR_ASC;
let STACK_MIDDLE = CHAR_ASC - (CHAR_ASC + CHAR_DESC) / 2;
let FRAC_MIDDLE = 0.25;
let OPERATOR_ASC = 0.9;
let OPERATOR_DESC = 0.5;
let FRAC_PADDING_NUM = 0.05;
let FRAC_PADDING_DEN = 0.05;
let SS_SIZE = 0.7;
let SUP_BOTTOM = -0.65;
let SUB_TOP = 0.65;
let SUP_TOP_TOLERENCE = CHAR_ASC + LINE_HEIGHT * SS_SIZE + SUP_BOTTOM - CHAR_ASC;
let SUB_BOTTOM_TOLERENCE = -(-CHAR_DESC + SUB_TOP - LINE_HEIGHT * SS_SIZE + CHAR_DESC);
let POSITION_SHIFT = 0;
let BIGOP_SHIFT = 0;
let SSSTACK_MARGIN_SUP = -0.05;
let SSSTACK_MARGIN_SUB = -0.3;
let BRACKET_SHIFT = -0.04;
let BRACKET_SHIFT_2 = 0.03;
let BRACKET_ASC = CHAR_ASC;
let BRACKET_DESC = LINE_HEIGHT - BRACKET_ASC;
let BRACKET_GEARS = 4;

let OPERATOR_SCALE = 1.5;
let INTEGRATE_SCALE = 1.75;

let ASCENDER_OPERATOR = CHAR_ASC;
let DESCENDER_OPERATOR = LINE_HEIGHT * 1.1 - CHAR_ASC;
let ASCENDER_INTEGRATE = CHAR_ASC + 0.05;
let DESCENDER_INTEGRATE = LINE_HEIGHT * 1.1 - CHAR_ASC;
let OPERATOR_SHIFT = -0.05;
let INTEGRATE_SHIFT = -0.1;
let ROOT_KERN = -0.6;
let ROOT_RISE = 0.15;

export const DefaultParam: Param = {
	LINE_HEIGHT,
	CHAR_ASC,
	CHAR_DESC,
	ITALIC_SLANT: Math.tan((10 / 180) * Math.PI), // 10°
	STACK_MIDDLE,
	FRAC_MIDDLE,
	OPERATOR_ASC,
	OPERATOR_DESC,
	FRAC_PADDING_NUM,
	FRAC_PADDING_DEN,
	SS_SIZE,
	SUP_BOTTOM,
	SUB_TOP,
	SUP_TOP_TOLERENCE,
	SUB_BOTTOM_TOLERENCE,
	POSITION_SHIFT,
	BIGOP_SHIFT,
	LIMITS_MARGIN_SUP: SSSTACK_MARGIN_SUP,
	LIMITS_MARGIN_SUB: SSSTACK_MARGIN_SUB,
	BRACKET_SHIFT,
	BRACKET_SHIFT_2,
	BRACKET_ASC,
	BRACKET_DESC,
	OPERATOR_SCALE,
	INTEGRATE_SCALE,
	ASCENDER_OPERATOR,
	DESCENDER_OPERATOR,
	ASCENDER_INTEGRATE,
	DESCENDER_INTEGRATE,
	OPERATOR_SHIFT,
	INTEGRATE_SHIFT,
	BRACKET_GEARS,
	ROOT_KERN,
	ROOT_RISE,
	MATRIX_SPACE: 1 / 4,
	charMetricOverride: {},
	kernGroupBefore: {},
	kernGroupAfter: {},
	kernAssignments: [
		{ groupBefore: "Bin", groupAfter: "*", value: 0.25, priority: 100, allowBreak: 1 },
		{ groupBefore: "*", groupAfter: "Bin", value: 0.25, priority: 100, allowBreak: 0 },
		{ groupBefore: "Rel", groupAfter: "*", value: 0.25, priority: 100, allowBreak: 3 },
		{ groupBefore: "*", groupAfter: "Rel", value: 0.25, priority: 100, allowBreak: 2 },
		{ groupBefore: "Punct", groupAfter: "*", value: 0.25, priority: 100, allowBreak: 5 },
		{ groupBefore: "*", groupAfter: "Punct", value: 1 / 16, priority: 100, allowBreak: 4 },
		{ groupBefore: "Space", groupAfter: "*", value: 0, priority: 1000 },
		{ groupBefore: "*", groupAfter: "Space", value: 0, priority: 1000 }
	]
};
