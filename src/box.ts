import { HtmlProps, Node, text } from "./html-build";
import { KernGroup } from "./kern";
import { Param } from "./param";

const Var = Node("var");
const Code = Node("code");

abstract class Box {
	constructor(protected readonly param: Param) {}
	protected height = 0;
	protected depth = 0;
	protected kernGroupBefore: KernGroup = null;
	protected kernGroupAfter: KernGroup = null;
	public write(): string {
		return "";
	}
}

export class CBox extends Box {
	constructor(param: Param, protected c: string) {
		super(param);
		this.height = param.CHAR_ASC;
		this.depth = param.CHAR_DESC;
	}
	public write() {
		return this.c;
	}
}

export class VarBox extends CBox {
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
