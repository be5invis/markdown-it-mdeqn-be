import * as B from "../../box";
import { Param } from "../../param";
import { Macro, Scope } from "../interface";

export function BracketMacros(par: Param, macros: Scope<B.Box>) {
	const left = (macros.left = Macro((bracketLeft, content) => {
		let bcl: B.BracketStart;
		if (bracketLeft instanceof B.CBox) {
			bcl = new B.BracketStart(par, bracketLeft.getContent());
		} else {
			bcl = new B.BracketStart(par, "");
		}
		if (content instanceof B.BBox && content.left.getContent() === "") {
			return new B.BBox(par, bcl, content.content, content.right);
		} else {
			return new B.BBox(par, bcl, content, new B.BracketEnd(par, ""));
		}
	}));

	const right = (macros.right = Macro((content, bracketRight) => {
		let bcl: B.BracketEnd;

		if (bracketRight instanceof B.CBox) {
			bcl = new B.BracketEnd(par, bracketRight.getContent());
		} else {
			bcl = new B.BracketEnd(par, "");
		}
		if (content instanceof B.BBox && content.right.getContent() === "") {
			return new B.BBox(par, content.left, content.content, bcl);
		} else {
			return new B.BBox(par, new B.BracketStart(par, ""), content, bcl);
		}
	}));

	const open = (c: string) => Macro((x: B.Box) => left.call(new B.BracketStart(par, c), x));
	const close = (c: string) => Macro((x: B.Box) => right.call(x, new B.BracketEnd(par, c)));
	const bracketStart = (s: string) => Macro(() => new B.BracketStart(par, s));
	const bracketEnd = (s: string) => Macro(() => new B.BracketEnd(par, s));

	macros.lparen = bracketStart("\u0028");
	macros.lbrack = bracketStart("\u005B");
	macros.lbrace = bracketStart("\u007B");
	macros.lceil = bracketStart("\u2308");
	macros.lfloor = bracketStart("\u230A");
	macros.ulcorner = bracketStart("\u231C");
	macros.llcorner = bracketStart("\u231E");
	macros.lmoustache = bracketStart("\u23B0");
	macros.lbrbrak = bracketStart("\u2772");
	macros.lbag = bracketStart("\u27C5");
	macros.longdivision = bracketStart("\u27CC");
	macros.lBrack = bracketStart("\u27E6");
	macros.langle = bracketStart("\u27E8");
	macros.lAngle = bracketStart("\u27EA");
	macros.lBrbrak = bracketStart("\u27EC");
	macros.lgroup = bracketStart("\u27EE");
	macros.lBrace = bracketStart("\u2983");
	macros.lParen = bracketStart("\u2985");
	macros.llparenthesis = bracketStart("\u2987");
	macros.llangle = bracketStart("\u2989");
	macros.lbrackubar = bracketStart("\u298B");
	macros.lbrackultick = bracketStart("\u298D");
	macros.lbracklltick = bracketStart("\u298F");
	macros.langledot = bracketStart("\u2991");
	macros.lparenless = bracketStart("\u2993");
	macros.lParengtr = bracketStart("\u2995");
	macros.lblkbrbrak = bracketStart("\u2997");
	macros.lvzigzag = bracketStart("\u29D8");
	macros.lVzigzag = bracketStart("\u29DA");
	macros.lcurvyangle = bracketStart("\u29FC");
	macros.lvarbrbrak = bracketStart("\u3014");
	macros.lVarbrbrak = bracketStart("\u3018");

	macros.rparen = bracketEnd("\u0029");
	macros.rbrack = bracketEnd("\u005D");
	macros.rbrace = bracketEnd("\u007D");
	macros.rceil = bracketEnd("\u2309");
	macros.rfloor = bracketEnd("\u230B");
	macros.urcorner = bracketEnd("\u231D");
	macros.lrcorner = bracketEnd("\u231F");
	macros.rmoustache = bracketEnd("\u23B1");
	macros.rbrbrak = bracketEnd("\u2773");
	macros.rbag = bracketEnd("\u27C6");
	macros.rBrack = bracketEnd("\u27E7");
	macros.rangle = bracketEnd("\u27E9");
	macros.rAngle = bracketEnd("\u27EB");
	macros.rBrbrak = bracketEnd("\u27ED");
	macros.rgroup = bracketEnd("\u27EF");
	macros.rBrace = bracketEnd("\u2984");
	macros.rParen = bracketEnd("\u2986");
	macros.rrparenthesis = bracketEnd("\u2988");
	macros.rrangle = bracketEnd("\u298A");
	macros.rbrackubar = bracketEnd("\u298C");
	macros.rbracklrtick = bracketEnd("\u298E");
	macros.rbrackurtick = bracketEnd("\u2990");
	macros.rangledot = bracketEnd("\u2992");
	macros.rparengtr = bracketEnd("\u2994");
	macros.rParenless = bracketEnd("\u2996");
	macros.rblkbrbrak = bracketEnd("\u2998");
	macros.rvzigzag = bracketEnd("\u29D9");
	macros.rVzigzag = bracketEnd("\u29DB");
	macros.rcurvyangle = bracketEnd("\u29FD");
	macros.rvarbrbrak = bracketEnd("\u3015");
	macros.rVarbrbrak = bracketEnd("\u3019");

	macros["paren:"] = macros["lparen:"] = macros["(:"] = open("\u0028");
	macros["brack:"] = macros["lbrack:"] = macros["[:"] = open("\u005B");
	macros["brace:"] = macros["lbrace:"] = macros["{:"] = open("\u007B");
	macros["ceil:"] = macros["lceil:"] = open("\u2308");
	macros["floor:"] = macros["lfloor:"] = open("\u230A");
	macros["ucorner:"] = macros["ulcorner:"] = open("\u231C");
	macros["lcorner:"] = macros["llcorner:"] = open("\u231E");
	macros["moustache:"] = macros["lmoustache:"] = open("\u23B0");
	macros["brbrak:"] = macros["lbrbrak:"] = open("\u2772");
	macros["bag:"] = macros["lbag:"] = open("\u27C5");
	macros["ongdivision:"] = macros["longdivision:"] = open("\u27CC");
	macros["Brack:"] = macros["lBrack:"] = open("\u27E6");
	macros["angle:"] = macros["langle:"] = macros["<:"] = open("\u27E8");
	macros["Angle:"] = macros["lAngle:"] = open("\u27EA");
	macros["Brbrak:"] = macros["lBrbrak:"] = open("\u27EC");
	macros["group:"] = macros["lgroup:"] = open("\u27EE");
	macros["Brace:"] = macros["lBrace:"] = open("\u2983");
	macros["Paren:"] = macros["lParen:"] = open("\u2985");
	macros["lparenthesis:"] = macros["llparenthesis:"] = open("\u2987");
	macros["vangle:"] = macros["lvangle:"] = open("\u2989");
	macros["brackubar:"] = macros["lbrackubar:"] = open("\u298B");
	macros["brackultick:"] = macros["lbrackultick:"] = open("\u298D");
	macros["bracklltick:"] = macros["lbracklltick:"] = open("\u298F");
	macros["angledot:"] = macros["langledot:"] = open("\u2991");
	macros["parenless:"] = macros["lparenless:"] = open("\u2993");
	macros["Parengtr"] = macros["lParengtr:"] = open("\u2995");
	macros["blkbrbrak:"] = macros["lblkbrbrak:"] = open("\u2997");
	macros["vzigzag:"] = macros["lvzigzag:"] = open("\u29D8");
	macros["Vzigzag:"] = macros["lVzigzag:"] = open("\u29DA");
	macros["curvyangle:"] = macros["lcurvyangle:"] = open("\u29FC");
	macros["brbrak:"] = macros["lbrbrak:"] = open("\u3014");
	macros["varBrbrak"] = macros["lvarBrbrak:"] = open("\u3018");
	macros["blank:"] = macros["lblank:"] = open("");
	macros["|:"] = open("|");

	macros[":paren"] = macros[":rparen"] = macros[":)"] = close("\u0029");
	macros[":brack"] = macros[":rbrack"] = macros[":]"] = close("\u005D");
	macros[":brace"] = macros[":rbrace"] = macros[":}"] = close("\u007D");
	macros[":ceil"] = macros[":rceil"] = close("\u2309");
	macros[":floor"] = macros[":rfloor"] = close("\u230B");
	macros[":ucorner"] = macros[":urcorner"] = close("\u231D");
	macros[":lcorner"] = macros[":lrcorner"] = close("\u231F");
	macros[":moustache"] = macros[":rmoustache"] = close("\u23B1");
	macros[":brbrak"] = macros[":rbrbrak"] = close("\u2773");
	macros[":bag"] = macros[":rbag"] = close("\u27C6");
	macros[":Brack"] = macros[":rBrack"] = close("\u27E7");
	macros[":angle"] = macros[":rangle"] = macros[":>"] = close("\u27E9");
	macros[":Angle"] = macros[":rAngle"] = close("\u27EB");
	macros[":Brbrak"] = macros[":rBrbrak"] = close("\u27ED");
	macros[":group"] = macros[":rgroup"] = close("\u27EF");
	macros[":Brace"] = macros[":rBrace"] = close("\u2984");
	macros[":Paren"] = macros[":rParen"] = close("\u2986");
	macros[":rparenthesis"] = macros[":rrparenthesis"] = close("\u2988");
	macros[":vangle"] = macros[":rvangle"] = close("\u298A");
	macros[":brackubar"] = macros[":rbrackubar"] = close("\u298C");
	macros[":bracklrtick"] = macros[":rbracklrtick"] = close("\u298E");
	macros[":brackurtick"] = macros[":rbrackurtick"] = close("\u2990");
	macros[":angledot"] = macros[":rangledot"] = close("\u2992");
	macros[":parengtr"] = macros[":rparengtr"] = close("\u2994");
	macros[":Parenless"] = macros[":rParenless"] = close("\u2996");
	macros[":blkbrbrak"] = macros[":rblkbrbrak"] = close("\u2998");
	macros[":vzigzag"] = macros[":rvzigzag"] = close("\u29D9");
	macros[":Vzigzag"] = macros[":rVzigzag"] = close("\u29DB");
	macros[":curvyangle"] = macros[":rcurvyangle"] = close("\u29FD");
	macros[":varbrbrak"] = macros[":rvarbrbrak"] = close("\u3015");
	macros[":Varbrbrak"] = macros[":rVarbrbrak"] = close("\u3019");
	macros[":blank"] = macros[":rblank"] = close("");
	macros[":|"] = close("|");
}
