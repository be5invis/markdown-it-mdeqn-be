import { em, HtmlProps, Node, style, text } from "./html-build";
import { KernGroup } from "./kern";
import { Param } from "./param";
import { KernAssignment } from "./param/interface";

const Var = Node("var");
const Code = Node("code");
const B = Node("b");
const I = Node("i");
const Span = Node("span");

export abstract class Box {
	constructor(protected readonly param: Param) {}
	// Layout properties
	public height = 0;
	public depth = 0;
	public slantBefore = 0;
	public slantAfter = 0;
	public kernGroupBefore: KernGroup = null;
	public kernGroupAfter: KernGroup = null;

	public write(): string {
		return "";
	}

	public static arrange(
		param: Param,
		boxes: (Box | null | undefined)[],
		rises: number[],
		height: number,
		depth: number,
		cl?: string,
		scales?: number[],
		xShifts?: number[]
	) {
		let children: string[] = [];
		for (let j = 0; j < boxes.length; j++) {
			const box = boxes[j];
			if (!box) continue;
			let scale = scales ? scales[j] || 0 : 1;
			const xs = xShifts ? xShifts[j] || 0 : 0;
			children.push(
				Span(
					{ class: "ri" },
					style({
						top: em((height - rises[j]) / scale - box.height),
						...(xs ? { left: em(xs) } : {}),
						...(scale !== 1 ? { fontSize: 1 } : {})
					}),
					box.write()
				)
			);
		}
		return Span(
			{ class: cl ? `r ${cl}` : `r` },
			style({
				height: em(height + depth),
				verticalAlign: em(height - param.CHAR_ASC)
			}),
			Span({ class: "eb start" }, "{"),
			...children,
			Span({ class: "eb end" }, "}")
		);
	}
}

export class CBox extends Box {
	constructor(param: Param, protected c: string) {
		super(param);
		this.height = param.CHAR_ASC;
		this.depth = param.CHAR_DESC;
	}
	public append(s: string) {
		this.c += s;
	}
	public getContent() {
		return this.c;
	}
	public isEmpty() {
		return !this.c;
	}
	public write() {
		return this.c;
	}
}

export class VarBox extends CBox {
	constructor(param: Param, protected c: string) {
		super(param, c);
		this.slantBefore = this.slantAfter = param.ITALIC_SLANT;
	}
	public write() {
		return Var({}, text(this.c));
	}
}

export class NumberBox extends CBox {
	public write() {
		return Var({ class: "nm" }, text(this.c));
	}
}

export class CodeBox extends CBox {
	public write() {
		return Code({}, text(this.c));
	}
}

export class CSBox extends CBox {
	constructor(
		param: Param,
		protected c: string,
		protected tag: string,
		protected style: HtmlProps
	) {
		super(param, c);
	}
	public write() {
		return Node(this.tag)(this.style, text(this.c));
	}
}

export class BfBox extends CBox {
	public write() {
		return B({}, text(this.c));
	}
}
export class SltBox extends CBox {
	constructor(param: Param, protected c: string) {
		super(param, c);
		this.slantBefore = this.slantAfter = param.ITALIC_SLANT;
	}
	public write() {
		return I({}, text(this.c));
	}
}

export class OpBox extends CBox {
	constructor(
		param: Param,
		protected c: string,
		protected tag: string = "op",
		protected noBreak: boolean = false
	) {
		super(param, c);
		this.kernGroupBefore = this.kernGroupAfter = tag;
	}
	public write() {
		return Span({ class: this.tag }, text(this.c));
	}
}

export class SpBox extends CBox {
	public kernGroupBefore = "Space";
	public kernGroupAfter = "Space";
	public write() {
		return Span({ class: "sp" }, text(this.c));
	}
}

export class BracketStart extends CBox {
	public kernGroupBefore = "Bracket/Outside";
	public kernGroupAfter = "Bracket/Inside";
	public write() {
		return Span({ class: "bracket-start" }, text(this.c));
	}
}
export class BracketEnd extends CBox {
	public kernGroupBefore = "Bracket/Inside";
	public kernGroupAfter = "Bracket/Outside";
	public write() {
		return Span({ class: "bracket-end" }, text(this.c));
	}
}

export class ScaleBox extends Box {
	constructor(param: Param, protected scale: number, protected content: Box) {
		super(param);
		this.slantBefore = content.slantBefore;
		this.slantAfter = content.slantAfter;
		this.height = content.height * scale;
		this.depth = content.depth * scale;
	}
	public write() {
		return Span(
			{ class: "r" },
			style({ height: em(this.height + this.depth) }),
			Span({ class: "ri" }, style({ "font-size": em(this.scale) }), this.content.write())
		);
	}
}

export class RaiseBox extends Box {
	constructor(
		param: Param,
		protected raise: number,
		protected content: Box,
		recalculateMetrics?: boolean
	) {
		super(param);
		this.slantBefore = content.slantBefore;
		this.slantAfter = content.slantAfter;
		this.height = recalculateMetrics ? Math.max(0, content.height + raise) : content.height;
		this.depth = recalculateMetrics ? Math.max(0, content.depth - raise) : content.depth;
	}
	public write() {
		return Box.arrange(this.param, [this.content], [this.raise], this.height, this.depth);
	}
}

export class KernBox extends Box {
	constructor(param: Param, protected kern: number, protected content: Box) {
		super(param);
		this.slantBefore = content.slantBefore;
		this.slantAfter = content.slantAfter;
		this.height = content.height;
		this.depth = content.depth;
		this.kernGroupAfter = "Manual";
	}
	public write() {
		return Span({ class: "r" }, style({ marginRight: em(this.kern) }), this.content.write());
	}
}

export class FracLineBox extends Box {
	public write() {
		return Span({ class: "fl" }, text("/"));
	}
}

export class FracBox extends Box {
	constructor(param: Param, protected num: Box, protected den: Box) {
		super(param);
		this.height = this.num.height + this.num.depth + param.FRAC_MIDDLE + param.FRAC_PADDING_NUM;
		this.depth = this.den.height + this.den.depth - param.FRAC_MIDDLE + param.FRAC_PADDING_DEN;
	}
	public write() {
		return Box.arrange(
			this.param,
			[this.num, new FracLineBox(this.param), this.den],
			[
				this.height - this.num.height,
				this.height - this.num.height - this.num.depth - this.param.FRAC_PADDING_NUM,
				this.height -
					this.num.height -
					this.num.depth -
					this.den.height -
					this.param.FRAC_PADDING_NUM -
					this.param.FRAC_PADDING_DEN
			],
			this.height,
			this.depth,
			"frac"
		);
	}
}

export class StackBox extends Box {
	constructor(param: Param, public parts: Box[]) {
		super(param);
		let v = 0;
		for (let j = 0; j < parts.length; j++) {
			v += parts[j].height + parts[j].depth;
		}
		this.height = v / 2 + param.STACK_MIDDLE;
		this.depth = v / 2 - param.STACK_MIDDLE;
	}
	public write() {
		let rises: number[] = [];
		let v = 0;
		for (let j = 0; j < this.parts.length; j++) {
			rises[j] = this.height - (v + this.parts[j].height);
			v += this.parts[j].height + this.parts[j].depth;
		}
		return Box.arrange(this.param, this.parts, rises, this.height, this.depth);
	}
}

function makeSpace(distance: number): string {
	return Span({ class: "space" }, style({ width: em(distance) }));
}

export class MatrixBox extends Box {
	public rows: number;
	public columns: number;
	private rowHeights: number[];
	private rowDepths: number[];
	constructor(
		param: Param,
		public boxes: (Box | null | undefined)[][],
		protected alignments: string = "",
		protected joiner: number = param.MATRIX_SPACE
	) {
		super(param);
		this.rows = boxes.length;
		this.columns = 0;
		this.alignments = alignments;
		let rowHeights = [];
		let rowDepths = [];
		let v = 0;
		for (let j = 0; j < boxes.length; j++) {
			let rh = 0;
			let rd = 0;
			for (let k = 0; k < boxes[j].length; k++) {
				const box = boxes[j][k];
				if (!box) continue;
				if (box.height > rh) rh = box.height;
				if (box.depth > rd) rd = box.depth;
			}
			rowHeights[j] = rh;
			rowDepths[j] = rd;
			v += rh + rd;
			this.columns = Math.max(this.columns, boxes[j].length);
		}
		this.rowHeights = rowHeights;
		this.rowDepths = rowDepths;
		this.height = v / 2 + param.STACK_MIDDLE;
		this.depth = v / 2 - param.STACK_MIDDLE;
	}
	public write() {
		let rises: number[] = [];
		let v = 0;
		for (let j = 0; j < this.rows; j++) {
			rises[j] = this.height - (v + this.rowHeights[j]);
			v += this.rowHeights[j] + this.rowDepths[j];
		}
		let buf: string[] = [];
		for (let k = 0; k < this.columns; k++) {
			let column: Box[] = [];
			for (let j = 0; j < this.rows; j++) {
				column[j] = this.boxes[j][k] || new SpBox(this.param, " ");
			}
			buf[k] = Box.arrange(
				this.param,
				column,
				rises,
				this.height,
				this.depth,
				"mc" + (this.alignments[k] || "").trim()
			);
		}
		return buf.join(makeSpace(this.joiner));
	}
}

export class SupSubPile extends Box {
	// "Amended" superscript and subscript boxes for rendering
	// Public members are for building composites
	protected readonly m_sup: Box;
	protected readonly m_sub: Box;
	constructor(
		param: Param,
		public readonly vBase: Box,
		public readonly sup: null | undefined | Box,
		public readonly sub: null | undefined | Box
	) {
		super(param);
		sup = sup || new SpBox(this.param, "");
		sub = sub || new SpBox(this.param, "");

		this.height = vBase.height + param.SUP_BOTTOM + param.SS_SIZE * (sup.depth + sup.height);
		if (this.height - vBase.height <= param.SUP_TOP_TOLERENCE) {
			this.height = vBase.height;
		}

		this.depth = vBase.depth - param.SUB_TOP + param.SS_SIZE * (sub.height + sub.depth);
		if (this.depth - vBase.depth <= param.SUB_BOTTOM_TOLERENCE) {
			this.depth = vBase.depth;
		}

		this.m_sup = sup;
		this.m_sub = sub;
	}
	public write() {
		const sup = this.m_sup;
		const sub = this.m_sub;
		return Box.arrange(
			this.param,
			[sup, sub],
			[
				this.vBase.height + this.param.SUP_BOTTOM + sup.depth * this.param.SS_SIZE,
				-this.vBase.depth + this.param.SUB_TOP - sub.height * this.param.SS_SIZE
			],
			this.height,
			this.depth,
			"ss",
			[this.param.SS_SIZE, this.param.SS_SIZE],
			[0, 0] // TODO: italic correction
		);
	}
}

export class SupSubBox extends Box {
	// "Amended" superscript and subscript boxes for rendering
	// Public members are for building composites
	protected pile: SupSubPile;
	constructor(
		param: Param,
		public readonly base: Box,
		public readonly sup: null | undefined | Box,
		public readonly sub: null | undefined | Box
	) {
		super(param);
		this.pile = new SupSubPile(param, base, sup, sub);
		this.height = this.pile.height;
		this.depth = this.pile.depth;
	}
	public write() {
		return this.base.write() + this.pile.write();
	}
}

export class LimitsBox extends Box {
	// "Amended" superscript and subscript boxes for rendering
	// Public members are for building composites
	protected readonly m_sup: Box | null;
	protected readonly m_sub: Box | null;
	constructor(
		param: Param,
		public readonly base: Box,
		public readonly sup: null | undefined | Box,
		public readonly sub: null | undefined | Box
	) {
		super(param);
		this.m_sup = sup ? new ScaleBox(param, param.SS_SIZE, sup) : null;
		this.m_sub = sub ? new ScaleBox(param, param.SS_SIZE, sub) : null;
		this.height =
			base.height +
			(this.m_sup ? this.m_sup.height + this.m_sup.depth : 0) +
			param.LIMITS_MARGIN_SUP;
		this.depth =
			base.depth +
			(this.m_sub ? this.m_sub.height + this.m_sub.depth : 0) +
			param.LIMITS_MARGIN_SUB;
	}
	public write() {
		const rises = [
			this.sup ? this.height - this.sup.height : 0,
			0,
			this.sub ? -this.depth + this.sub.depth : 0
		];
		return Box.arrange(
			this.param,
			[this.sup, this.base, this.sub],
			rises,
			this.height,
			this.depth,
			"sss"
		);
	}
}

export class BigOpBox extends Box {
	constructor(
		param: Param,
		protected readonly content: Box,
		protected readonly scale: number,
		protected readonly ascender: number,
		protected readonly descender: number,
		protected readonly shift: number
	) {
		super(param);

		this.height = (ascender + shift) * scale;
		this.depth = (descender - shift) * scale;
	}
	public write() {
		return Box.arrange(
			this.param,
			[new ScaleBox(this.param, this.scale, this.content)],
			[this.shift * this.scale],
			this.height,
			this.depth,
			"bo"
		);
	}
}

function findMatchingKernAssignment(param: Param, before: Box, after: Box) {
	const kgLeft = before.kernGroupAfter || "";
	const kgRight = after.kernGroupBefore || "";
	const matches: KernAssignment[] = [];
	for (const asg of param.kernAssignments) {
		if (asg.groupBefore !== kgLeft && asg.groupBefore !== "*") continue;
		if (asg.groupAfter !== kgRight && asg.groupAfter !== "*") continue;
		matches.push(asg);
	}
	if (matches.length) {
		matches.sort((a, b) => (a.priority || 0) - (b.priority || 0));
		return matches[0];
	} else {
		return null;
	}
}

export class HBox extends Box {
	public boxes: Box[];
	constructor(param: Param, xs: (Box | null | undefined)[]) {
		super(param);
		let h = 0;
		let d = 0;
		let bx: Box[] = [];
		for (const box of xs) {
			if (!box) continue;
			bx.push(box);
			if (h < box.height) h = box.height;
			if (d < box.depth) d = box.depth;
		}
		if (!bx.length) bx[0] = new SpBox(param, "");
		this.boxes = bx;
		this.height = h;
		this.depth = d;
		this.kernGroupBefore = bx[0].kernGroupBefore;
		this.slantBefore = bx[0].slantBefore;
		this.kernGroupAfter = bx[bx.length - 1].kernGroupAfter;
		this.slantAfter = bx[bx.length - 1].slantAfter;
	}
	public static writeKern(param: Param, before: Box, after: Box) {
		const kern = findMatchingKernAssignment(param, before, after);
		if (kern) {
			return Span({ class: "kern" }, style({ marginLeft: em(kern.value) }));
		} else {
			return after.write;
		}
	}
	public write() {
		let buf: string = "";
		buf += this.boxes[0].write();
		let boxBefore = this.boxes[0];
		for (let j = 1; j < this.boxes.length; j++) {
			const box = this.boxes[j];
			buf += HBox.writeKern(this.param, boxBefore, box);
			buf += box.write();
			boxBefore = box;
		}
		return buf;
	}
}

export class BBox extends Box {
	constructor(
		params: Param,
		public readonly left: BracketStart,
		public readonly content: Box,
		public readonly right: BracketEnd
	) {
		super(params);
		this.height = content.height;
		this.depth = content.depth;
		this.kernGroupBefore = left.kernGroupBefore;
		this.kernGroupAfter = right.kernGroupAfter;
	}
	private scaleSpan(v: number, t: string, k: string, aux: HtmlProps) {
		return Span(
			{ class: "e " + (k || "bb") },
			style({
				transform: `scaley(${v})`,
				...aux
			}),
			t
		);
	}
	public write() {
		const halfwayHeight = (this.left.height - this.left.depth) / 2;
		const halfBracketHeight = halfwayHeight + this.left.depth;
		const contentUpperHeight = this.content.height - halfwayHeight;
		const contentLowerDepth = this.content.depth + halfwayHeight;

		const SCALE_V =
			(1 / this.param.BRACKET_GEARS) *
			Math.ceil(
				this.param.BRACKET_GEARS *
					Math.max(
						1,
						contentUpperHeight / halfBracketHeight,
						contentLowerDepth / halfBracketHeight
					)
			);
		let scaleClassSuffix = "";
		if (SCALE_V >= 1.5) scaleClassSuffix = " big";
		if (SCALE_V >= 4) scaleClassSuffix = " bigg";
		if (SCALE_V <= 1.1) {
			return (
				(this.left.isEmpty()
					? ""
					: Span({ class: "e bn l" }, this.left.write()) +
					  HBox.writeKern(this.param, this.left, this.content)) +
				this.content.write() +
				(this.right.isEmpty()
					? ""
					: HBox.writeKern(this.param, this.content, this.right) +
					  Span({ class: "e bn r" }, this.right.write()))
			);
		} else {
			const SCALE_H = 1 + Math.pow(SCALE_V - 1, 0.3) * 0.375;
			let baselineAdjustment = -(halfwayHeight * SCALE_H - halfwayHeight) / SCALE_H;
			const auxStyle = {
				fontSize: em(SCALE_H),
				verticalAlign: em(
					baselineAdjustment +
						this.param.BRACKET_SHIFT * SCALE_V +
						this.param.BRACKET_SHIFT_2
				)
			};
			return (
				(this.left.isEmpty()
					? ""
					: this.scaleSpan(
							SCALE_V / SCALE_H,
							this.left.write(),
							"bb l" + scaleClassSuffix,
							auxStyle
					  )) +
				this.content.write() +
				(this.right.isEmpty()
					? ""
					: this.scaleSpan(
							SCALE_V / SCALE_H,
							this.right.write(),
							"bb r" + scaleClassSuffix,
							auxStyle
					  ))
			);
		}
	}
}

export class SqrtInternalBox extends Box {
	constructor(param: Param, protected readonly content: Box) {
		super(param);
		this.height = content.height + param.FRAC_PADDING_DEN * 2;
		this.depth = content.depth;
	}
	public write() {
		return Span(
			{ class: "sqrt" },
			style({ marginTop: em(this.param.FRAC_PADDING_DEN) }),
			Span(
				{ class: "sk" },
				style({ padding: `${em(this.param.FRAC_PADDING_DEN)},0,0` }),
				this.content.write()
			)
		);
	}
}
export class SqrtBox extends Box {
	constructor(param: Param, protected readonly content: Box) {
		super(param);
		this.height = content.height + param.FRAC_PADDING_DEN * 2;
		this.depth = content.depth;
	}
	public write() {
		return Box.arrange(
			this.param,
			[new SqrtInternalBox(this.param, this.content)],
			[0],
			this.height,
			this.depth
		);
	}
}

export interface BoxDecoration {
	overrideKernGroupBefore?: string;
	overrideKernGroupAfter?: string;
	className?: string;
}

export class DecoBox extends Box {
	constructor(
		param: Param,
		protected readonly content: Box,
		protected readonly decoration: BoxDecoration
	) {
		super(param);
		this.height = content.height;
		this.depth = content.depth;
		this.slantBefore = content.slantBefore;
		this.slantAfter = content.slantAfter;
		this.kernGroupBefore = decoration.overrideKernGroupBefore || content.kernGroupBefore;
		this.kernGroupAfter = decoration.overrideKernGroupAfter || content.kernGroupAfter;
	}
	public write() {
		return Span({ class: "e " + (this.decoration.className || "") }, this.content.write());
	}
}
