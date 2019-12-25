import { Box } from "./layout/box";
import { Param } from "./param";
import { Scope } from "./parser/interface";
import { BracketMacros } from "./parser/macros/bracket";
import { CombiningMacros } from "./parser/macros/combining";
import {
	FractionMacros,
	ManualPositionMacros,
	MatrixCompositeMacros,
	RootMacros,
	SupSubMacros,
	TextStyleMacros
} from "./parser/macros/composite";
import { LetterMacros } from "./parser/macros/letters";
import { OperatorMacros } from "./parser/macros/operators";
import { SpaceMacros } from "./parser/macros/spaces";

export function initScope(par: Param) {
	const scope: Scope<Box> = {};
	SpaceMacros(par, scope);
	FractionMacros(par, scope);
	RootMacros(par, scope);
	SupSubMacros(par, scope);
	MatrixCompositeMacros(par, scope);
	TextStyleMacros(par, scope);
	ManualPositionMacros(par, scope);
	LetterMacros(par, scope);
	OperatorMacros(par, scope);
	CombiningMacros(par, scope);
	BracketMacros(par, scope);

	return scope;
}
