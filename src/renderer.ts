import { HtmlProps, Node } from "./html-build";
import { css } from "./html-build/css";
import { Box, CBox, SyncDimBox } from "./layout/box";
import { Param } from "./param";
import { BoxPrimitives, Compiler } from "./parser/compile";
import { DisplayCellType, Scope } from "./parser/interface";
import { lex } from "./parser/lex";

export function renderInline(par: Param, scope: Scope<Box>, equation: string) {
	const tokens = lex(equation);
	const prim = new BoxPrimitives(par);
	const compiler = new Compiler(tokens, scope, prim);
	const expr = compiler.inline();
	return wrapEqnSpan(expr);
}

export function renderDisplay(par: Param, scope: Scope<Box>, align: string[], equation: string) {
	const tokens = lex(equation);
	const prim = new BoxPrimitives(par);
	const compiler = new Compiler(tokens, scope, prim);
	const cells = compiler.display();
	const matrixBoxes: string[] = [];
	for (const row of cells) {
		const htmlRaw: string[] = [];
		let maxHeight = 0;
		let maxDepth = 0;
		let anchorName = "";
		for (const cell of row) {
			if (cell.cell.depth > maxDepth) maxDepth = cell.cell.depth;
			if (cell.cell.height > maxHeight) maxHeight = cell.cell.height;
		}
		for (let col = 0; col < row.length; col++) {
			const cell = row[col] || { type: DisplayCellType.CELL, cell: prim.empty() };

			let box = cell.cell;
			let isAnchor = false;
			if (cell.type === DisplayCellType.CROSS_REF) {
				if (box instanceof CBox) anchorName = `eqn-anchor-${box.getContent()}`;
				isAnchor = true;
				box = prim.parenEnclosure(box);
			}
			htmlRaw.push(
				Node("td")(
					getAlignment(align[col]),
					wrapEqnSpan(new SyncDimBox(par, box, maxHeight, maxDepth), isAnchor)
				)
			);
		}
		matrixBoxes.push(Node("tr")({ ...(anchorName ? { id: anchorName } : {}) }, ...htmlRaw));
	}
	return Node("div")(
		{ class: "display-eqn" },
		Node("table")({ class: "eqn-align" }, ...matrixBoxes)
	);
}

function wrapEqnSpan(expr: Box, ap?: boolean) {
	return Node("span")({ class: "eqn" + (ap ? " eqn-anchor" : "") }, expr.write());
}

function getAlignment(a: string | undefined): HtmlProps {
	if (!a) return {};
	if (a === "l") a = "left";
	if (a === "r") a = "right";
	if (a === "c") a = "center";
	return { style: css({ textAlign: a }) };
}
