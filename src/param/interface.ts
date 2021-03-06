export interface Param {
	readonly LINE_HEIGHT: number;
	readonly CHAR_ASC: number;
	readonly CHAR_DESC: number;
	readonly ITALIC_SLANT: number;
	readonly STACK_MIDDLE: number;
	readonly FRAC_MIDDLE: number;
	readonly OPERATOR_ASC: number;
	readonly OPERATOR_DESC: number;
	readonly FRAC_PADDING_NUM: number;
	readonly FRAC_PADDING_DEN: number;
	readonly SS_SIZE: number;
	readonly SUP_BOTTOM: number;
	readonly SUB_TOP: number;
	readonly SUP_TOP_TOLERENCE: number;
	readonly SUB_BOTTOM_TOLERENCE: number;
	readonly POSITION_SHIFT: number;
	readonly BIGOP_SHIFT: number;
	readonly LIMITS_MARGIN_SUP: number;
	readonly LIMITS_MARGIN_SUB: number;
	readonly BRACKET_SHIFT: number;
	readonly BRACKET_SHIFT_2: number;
	readonly BRACKET_ASC: number;
	readonly BRACKET_DESC: number;
	readonly BRACKET_GEARS: number;
	readonly OPERATOR_SCALE: number;
	readonly INTEGRATE_SCALE: number;
	readonly ASCENDER_OPERATOR: number;
	readonly DESCENDER_OPERATOR: number;
	readonly ASCENDER_INTEGRATE: number;
	readonly DESCENDER_INTEGRATE: number;
	readonly OPERATOR_SHIFT: number;
	readonly INTEGRATE_SHIFT: number;
	readonly ROOT_KERN: number;
	readonly ROOT_RISE: number;

	readonly MATRIX_SPACE: number;

	readonly charMetricOverride: { [key: string]: { ascender: number; descender: number } };
	readonly kernGroupBefore: { [key: string]: string };
	readonly kernGroupAfter: { [key: string]: string };
	readonly kernAssignments: KernAssignment[];
}

export interface KernAssignment {
	readonly groupBefore: string;
	readonly groupAfter: string;
	readonly value: number;
	readonly priority?: number;
	readonly allowBreak?: number;
}
