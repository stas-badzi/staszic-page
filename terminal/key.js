// Convert Javascript keyboard events to a format simillar to <linux/keyboard.h> 

const event_type = {key_down: 0, key_up: 1, toggle_on: 2, toggle_off: 3};

const KG_SHIFT = 0;
const KG_CTRL =  2;
const KG_ALT = 3;
const KG_ALTGR = 1;
const KG_SHIFTL = 4;
const KG_KANASHIFT = 4;
const KG_SHIFTR = 5;
const KG_CTRLL = 6;
const KG_CTRLR = 7;
const KG_CAPSSHIFT = 8;

const NR_SHIFT = 9;

const NR_KEYS = 256;
const MAX_NR_KEYMAPS = 256;
const MAX_NR_OF_USER_KEYMAPS = 256;


const MAX_NR_FUNC = 256;

const KT_LATIN = 0; // Has to be 0
const KT_FN = 1;
const KT_SPEC = 2;
const KT_PAD = 3;
const KT_DEAD = 4;
const KT_CONS = 5;
const KT_CUR = 6;
const KT_SHIFT = 7;
const KT_META = 8;
const KT_ASCII = 9;
const KT_LOCK = 10;
const KT_LETTER = 11; // KT_LATIN, but CAPS_LOCK works on it 
const KT_SLOCK = 12;
const KT_DEAD2 = 13;
const KT_BRL = 14;

function K(t,v) { return (((t)<<8)|(v)); }
function KTYP(x) { return ((x) >> 8); }
function KVAL(x) { return ((x) & 0xff); }

const K_F1 = (((KT_FN)<<8)|0);
const K_F2 = (((KT_FN)<<8)|1);
const K_F3 = (((KT_FN)<<8)|2);
const K_F4 = (((KT_FN)<<8)|3);
const K_F5 = (((KT_FN)<<8)|4);
const K_F6 = (((KT_FN)<<8)|5);
const K_F7 = (((KT_FN)<<8)|6);
const K_F8 = (((KT_FN)<<8)|7);
const K_F9 = (((KT_FN)<<8)|8);
const K_F10 = (((KT_FN)<<8)|9);
const K_F11 = (((KT_FN)<<8)|10);
const K_F12 = (((KT_FN)<<8)|11);
const K_F13 = (((KT_FN)<<8)|12);
const K_F14 = (((KT_FN)<<8)|13);
const K_F15 = (((KT_FN)<<8)|14);
const K_F16 = (((KT_FN)<<8)|15);
const K_F17 = (((KT_FN)<<8)|16);
const K_F18 = (((KT_FN)<<8)|17);
const K_F19 = (((KT_FN)<<8)|18);
const K_F20 = (((KT_FN)<<8)|19);
const K_FIND = (((KT_FN)<<8)|20);
const K_INSERT = (((KT_FN)<<8)|21);
const K_REMOVE = (((KT_FN)<<8)|22);
const K_SELECT = (((KT_FN)<<8)|23);
const K_PGUP = (((KT_FN)<<8)|24); // PGUP ~= PRIOR
const K_PGDN = (((KT_FN)<<8)|25); // PGDN ~= NEXT
const K_MACRO  = (((KT_FN)<<8)|26);
const K_HELP = (((KT_FN)<<8)|27);
const K_DO = (((KT_FN)<<8)|28);
const K_PAUSE  = (((KT_FN)<<8)|29);
const K_F21 = (((KT_FN)<<8)|30);
const K_F22 = (((KT_FN)<<8)|31);
const K_F23 = (((KT_FN)<<8)|32);
const K_F24 = (((KT_FN)<<8)|33);
const K_F25 = (((KT_FN)<<8)|34);
const K_F26 = (((KT_FN)<<8)|35);
const K_F27 = (((KT_FN)<<8)|36);
const K_F28 = (((KT_FN)<<8)|37);
const K_F29 = (((KT_FN)<<8)|38);
const K_F30 = (((KT_FN)<<8)|39);
const K_F31 = (((KT_FN)<<8)|40);
const K_F32 = (((KT_FN)<<8)|41);
const K_F33 = (((KT_FN)<<8)|42);
const K_F34 = (((KT_FN)<<8)|43);
const K_F35 = (((KT_FN)<<8)|44);
const K_F36 = (((KT_FN)<<8)|45);
const K_F37 = (((KT_FN)<<8)|46);
const K_F38 = (((KT_FN)<<8)|47);
const K_F39 = (((KT_FN)<<8)|48);
const K_F40 = (((KT_FN)<<8)|49);
const K_F41 = (((KT_FN)<<8)|50);
const K_F42 = (((KT_FN)<<8)|51);
const K_F43 = (((KT_FN)<<8)|52);
const K_F44 = (((KT_FN)<<8)|53);
const K_F45 = (((KT_FN)<<8)|54);
const K_F46 = (((KT_FN)<<8)|55);
const K_F47 = (((KT_FN)<<8)|56);
const K_F48 = (((KT_FN)<<8)|57);
const K_F49 = (((KT_FN)<<8)|58);
const K_F50 = (((KT_FN)<<8)|59);
const K_F51 = (((KT_FN)<<8)|60);
const K_F52 = (((KT_FN)<<8)|61);
const K_F53 = (((KT_FN)<<8)|62);
const K_F54 = (((KT_FN)<<8)|63);
const K_F55 = (((KT_FN)<<8)|64);
const K_F56 = (((KT_FN)<<8)|65);
const K_F57 = (((KT_FN)<<8)|66);
const K_F58 = (((KT_FN)<<8)|67);
const K_F59 = (((KT_FN)<<8)|68);
const K_F60 = (((KT_FN)<<8)|69);
const K_F61 = (((KT_FN)<<8)|70);
const K_F62 = (((KT_FN)<<8)|71);
const K_F63 = (((KT_FN)<<8)|72);
const K_F64 = (((KT_FN)<<8)|73);
const K_F65 = (((KT_FN)<<8)|74);
const K_F66 = (((KT_FN)<<8)|75);
const K_F67 = (((KT_FN)<<8)|76);
const K_F68 = (((KT_FN)<<8)|77);
const K_F69 = (((KT_FN)<<8)|78);
const K_F70 = (((KT_FN)<<8)|79);
const K_F71 = (((KT_FN)<<8)|80);
const K_F72 = (((KT_FN)<<8)|81);
const K_F73 = (((KT_FN)<<8)|82);
const K_F74 = (((KT_FN)<<8)|83);
const K_F75 = (((KT_FN)<<8)|84);
const K_F76 = (((KT_FN)<<8)|85);
const K_F77 = (((KT_FN)<<8)|86);
const K_F78 = (((KT_FN)<<8)|87);
const K_F79 = (((KT_FN)<<8)|88);
const K_F80 = (((KT_FN)<<8)|89);
const K_F81 = (((KT_FN)<<8)|90);
const K_F82 = (((KT_FN)<<8)|91);
const K_F83 = (((KT_FN)<<8)|92);
const K_F84 = (((KT_FN)<<8)|93);
const K_F85 = (((KT_FN)<<8)|94);
const K_F86 = (((KT_FN)<<8)|95);
const K_F87 = (((KT_FN)<<8)|96);
const K_F88 = (((KT_FN)<<8)|97);
const K_F89 = (((KT_FN)<<8)|98);
const K_F90 = (((KT_FN)<<8)|99);
const K_F91 = (((KT_FN)<<8)|100);
const K_F92 = (((KT_FN)<<8)|101);
const K_F93 = (((KT_FN)<<8)|102);
const K_F94 = (((KT_FN)<<8)|103);
const K_F95 = (((KT_FN)<<8)|104);
const K_F96 = (((KT_FN)<<8)|105);
const K_F97 = (((KT_FN)<<8)|106);
const K_F98 = (((KT_FN)<<8)|107);
const K_F99 = (((KT_FN)<<8)|108);
const K_F100 = (((KT_FN)<<8)|109);
const K_F101 = (((KT_FN)<<8)|110);
const K_F102 = (((KT_FN)<<8)|111);
const K_F103 = (((KT_FN)<<8)|112);
const K_F104 = (((KT_FN)<<8)|113);
const K_F105 = (((KT_FN)<<8)|114);
const K_F106 = (((KT_FN)<<8)|115);
const K_F107 = (((KT_FN)<<8)|116);
const K_F108 = (((KT_FN)<<8)|117);
const K_F109 = (((KT_FN)<<8)|118);
const K_F110 = (((KT_FN)<<8)|119);
const K_F111 = (((KT_FN)<<8)|120);
const K_F112 = (((KT_FN)<<8)|121);
const K_F113 = (((KT_FN)<<8)|122);
const K_F114 = (((KT_FN)<<8)|123);
const K_F115 = (((KT_FN)<<8)|124);
const K_F116 = (((KT_FN)<<8)|125);
const K_F117 = (((KT_FN)<<8)|126);
const K_F118 = (((KT_FN)<<8)|127);
const K_F119 = (((KT_FN)<<8)|128);
const K_F120 = (((KT_FN)<<8)|129);
const K_F121 = (((KT_FN)<<8)|130);
const K_F122 = (((KT_FN)<<8)|131);
const K_F123 = (((KT_FN)<<8)|132);
const K_F124 = (((KT_FN)<<8)|133);
const K_F125 = (((KT_FN)<<8)|134);
const K_F126 = (((KT_FN)<<8)|135);
const K_F127 = (((KT_FN)<<8)|136);
const K_F128 = (((KT_FN)<<8)|137);
const K_F129 = (((KT_FN)<<8)|138);
const K_F130 = (((KT_FN)<<8)|139);
const K_F131 = (((KT_FN)<<8)|140);
const K_F132 = (((KT_FN)<<8)|141);
const K_F133 = (((KT_FN)<<8)|142);
const K_F134 = (((KT_FN)<<8)|143);
const K_F135 = (((KT_FN)<<8)|144);
const K_F136 = (((KT_FN)<<8)|145);
const K_F137 = (((KT_FN)<<8)|146);
const K_F138 = (((KT_FN)<<8)|147);
const K_F139 = (((KT_FN)<<8)|148);
const K_F140 = (((KT_FN)<<8)|149);
const K_F141 = (((KT_FN)<<8)|150);
const K_F142 = (((KT_FN)<<8)|151);
const K_F143 = (((KT_FN)<<8)|152);
const K_F144 = (((KT_FN)<<8)|153);
const K_F145 = (((KT_FN)<<8)|154);
const K_F146 = (((KT_FN)<<8)|155);
const K_F147 = (((KT_FN)<<8)|156);
const K_F148 = (((KT_FN)<<8)|157);
const K_F149 = (((KT_FN)<<8)|158);
const K_F150 = (((KT_FN)<<8)|159);
const K_F151 = (((KT_FN)<<8)|160);
const K_F152 = (((KT_FN)<<8)|161);
const K_F153 = (((KT_FN)<<8)|162);
const K_F154 = (((KT_FN)<<8)|163);
const K_F155 = (((KT_FN)<<8)|164);
const K_F156 = (((KT_FN)<<8)|165);
const K_F157 = (((KT_FN)<<8)|166);
const K_F158 = (((KT_FN)<<8)|167);
const K_F159 = (((KT_FN)<<8)|168);
const K_F160 = (((KT_FN)<<8)|169);
const K_F161 = (((KT_FN)<<8)|170);
const K_F162 = (((KT_FN)<<8)|171);
const K_F163 = (((KT_FN)<<8)|172);
const K_F164 = (((KT_FN)<<8)|173);
const K_F165 = (((KT_FN)<<8)|174);
const K_F166 = (((KT_FN)<<8)|175);
const K_F167 = (((KT_FN)<<8)|176);
const K_F168 = (((KT_FN)<<8)|177);
const K_F169 = (((KT_FN)<<8)|178);
const K_F170 = (((KT_FN)<<8)|179);
const K_F171 = (((KT_FN)<<8)|180);
const K_F172 = (((KT_FN)<<8)|181);
const K_F173 = (((KT_FN)<<8)|182);
const K_F174 = (((KT_FN)<<8)|183);
const K_F175 = (((KT_FN)<<8)|184);
const K_F176 = (((KT_FN)<<8)|185);
const K_F177 = (((KT_FN)<<8)|186);
const K_F178 = (((KT_FN)<<8)|187);
const K_F179 = (((KT_FN)<<8)|188);
const K_F180 = (((KT_FN)<<8)|189);
const K_F181 = (((KT_FN)<<8)|190);
const K_F182 = (((KT_FN)<<8)|191);
const K_F183 = (((KT_FN)<<8)|192);
const K_F184 = (((KT_FN)<<8)|193);
const K_F185 = (((KT_FN)<<8)|194);
const K_F186 = (((KT_FN)<<8)|195);
const K_F187 = (((KT_FN)<<8)|196);
const K_F188 = (((KT_FN)<<8)|197);
const K_F189 = (((KT_FN)<<8)|198);
const K_F190 = (((KT_FN)<<8)|199);
const K_F191 = (((KT_FN)<<8)|200);
const K_F192 = (((KT_FN)<<8)|201);
const K_F193 = (((KT_FN)<<8)|202);
const K_F194 = (((KT_FN)<<8)|203);
const K_F195 = (((KT_FN)<<8)|204);
const K_F196 = (((KT_FN)<<8)|205);
const K_F197 = (((KT_FN)<<8)|206);
const K_F198 = (((KT_FN)<<8)|207);
const K_F199 = (((KT_FN)<<8)|208);
const K_F200 = (((KT_FN)<<8)|209);
const K_F201 = (((KT_FN)<<8)|210);
const K_F202 = (((KT_FN)<<8)|211);
const K_F203 = (((KT_FN)<<8)|212);
const K_F204 = (((KT_FN)<<8)|213);
const K_F205 = (((KT_FN)<<8)|214);
const K_F206 = (((KT_FN)<<8)|215);
const K_F207 = (((KT_FN)<<8)|216);
const K_F208 = (((KT_FN)<<8)|217);
const K_F209 = (((KT_FN)<<8)|218);
const K_F210 = (((KT_FN)<<8)|219);
const K_F211 = (((KT_FN)<<8)|220);
const K_F212 = (((KT_FN)<<8)|221);
const K_F213 = (((KT_FN)<<8)|222);
const K_F214 = (((KT_FN)<<8)|223);
const K_F215 = (((KT_FN)<<8)|224);
const K_F216 = (((KT_FN)<<8)|225);
const K_F217 = (((KT_FN)<<8)|226);
const K_F218 = (((KT_FN)<<8)|227);
const K_F219 = (((KT_FN)<<8)|228);
const K_F220 = (((KT_FN)<<8)|229);
const K_F221 = (((KT_FN)<<8)|230);
const K_F222 = (((KT_FN)<<8)|231);
const K_F223 = (((KT_FN)<<8)|232);
const K_F224 = (((KT_FN)<<8)|233);
const K_F225 = (((KT_FN)<<8)|234);
const K_F226 = (((KT_FN)<<8)|235);
const K_F227 = (((KT_FN)<<8)|236);
const K_F228 = (((KT_FN)<<8)|237);
const K_F229 = (((KT_FN)<<8)|238);
const K_F230 = (((KT_FN)<<8)|239);
const K_F231 = (((KT_FN)<<8)|240);
const K_F232 = (((KT_FN)<<8)|241);
const K_F233 = (((KT_FN)<<8)|242);
const K_F234 = (((KT_FN)<<8)|243);
const K_F235 = (((KT_FN)<<8)|244);
const K_F236 = (((KT_FN)<<8)|245);
const K_F237 = (((KT_FN)<<8)|246);
const K_F238 = (((KT_FN)<<8)|247);
const K_F239 = (((KT_FN)<<8)|248);
const K_F240 = (((KT_FN)<<8)|249);
const K_F241 = (((KT_FN)<<8)|250);
const K_F242 = (((KT_FN)<<8)|251);
const K_F243 = (((KT_FN)<<8)|252);
const K_F244 = (((KT_FN)<<8)|253);
const K_F245 = (((KT_FN)<<8)|254);
const K_UNDO = (((KT_FN)<<8)|255);


const K_HOLE = (((KT_SPEC)<<8)|0);
const K_ENTER = (((KT_SPEC)<<8)|1);
const K_SH_REGS = (((KT_SPEC)<<8)|2);
const K_SH_MEM = (((KT_SPEC)<<8)|3);
const K_SH_STAT = (((KT_SPEC)<<8)|4);
const K_BREAK = (((KT_SPEC)<<8)|5);
const K_CONS = (((KT_SPEC)<<8)|6);
const K_CAPS = (((KT_SPEC)<<8)|7);
const K_NUM = (((KT_SPEC)<<8)|8);
const K_HOLD = (((KT_SPEC)<<8)|9);
const K_SCROLLFORW = (((KT_SPEC)<<8)|10);
const K_SCROLLBACK = (((KT_SPEC)<<8)|11);
const K_BOOT = (((KT_SPEC)<<8)|12);
const K_CAPSON = (((KT_SPEC)<<8)|13);
const K_COMPOSE = (((KT_SPEC)<<8)|14);
const K_SAK = (((KT_SPEC)<<8)|15);
const K_DECRCONSOLE = (((KT_SPEC)<<8)|16);
const K_INCRCONSOLE = (((KT_SPEC)<<8)|17);
const K_SPAWNCONSOLE = (((KT_SPEC)<<8)|18);
const K_BARENUMLOCK = (((KT_SPEC)<<8)|19);

const K_P0 = (((KT_PAD)<<8)|0);
const K_P1 = (((KT_PAD)<<8)|1);
const K_P2 = (((KT_PAD)<<8)|2);
const K_P3 = (((KT_PAD)<<8)|3);
const K_P4 = (((KT_PAD)<<8)|4);
const K_P5 = (((KT_PAD)<<8)|5);
const K_P6 = (((KT_PAD)<<8)|6);
const K_P7 = (((KT_PAD)<<8)|7);
const K_P8 = (((KT_PAD)<<8)|8);
const K_P9 = (((KT_PAD)<<8)|9);
const K_PPLUS = (((KT_PAD)<<8)|10); /* key-pad plus */
const K_PMINUS = (((KT_PAD)<<8)|11); /* key-pad minus */
const K_PSTAR = (((KT_PAD)<<8)|12); /* key-pad asterisk (star) */
const K_PSLASH = (((KT_PAD)<<8)|13); /* key-pad slash */
const K_PENTER = (((KT_PAD)<<8)|14); /* key-pad enter */
const K_PCOMMA = (((KT_PAD)<<8)|15); /* key-pad comma: kludge... */
const K_PDOT = (((KT_PAD)<<8)|16); /* key-pad dot (period): kludge... */
const K_PPLUSMINUS = (((KT_PAD)<<8)|17); /* key-pad plus/minus */
const K_PPARENL = (((KT_PAD)<<8)|18); /* key-pad left parenthesis */
const K_PPARENR = (((KT_PAD)<<8)|19); /* key-pad right parenthesis */

const K_DGRAVE = (((KT_DEAD)<<8)|0);
const K_DACUTE = (((KT_DEAD)<<8)|1);
const K_DCIRCM = (((KT_DEAD)<<8)|2);
const K_DTILDE = (((KT_DEAD)<<8)|3);
const K_DDIERE = (((KT_DEAD)<<8)|4);
const K_DCEDIL = (((KT_DEAD)<<8)|5);
const K_DMACRON = (((KT_DEAD)<<8)|6);
const K_DBREVE = (((KT_DEAD)<<8)|7);
const K_DABDOT = (((KT_DEAD)<<8)|8);
const K_DABRING = (((KT_DEAD)<<8)|9);
const K_DDBACUTE = (((KT_DEAD)<<8)|10);
const K_DCARON = (((KT_DEAD)<<8)|11);
const K_DOGONEK = (((KT_DEAD)<<8)|12);
const K_DIOTA = (((KT_DEAD)<<8)|13);
const K_DVOICED = (((KT_DEAD)<<8)|14);
const K_DSEMVOICED = (((KT_DEAD)<<8)|15);
const K_DBEDOT = (((KT_DEAD)<<8)|16);
const K_DHOOK = (((KT_DEAD)<<8)|17);
const K_DHORN = (((KT_DEAD)<<8)|18);
const K_DSTROKE = (((KT_DEAD)<<8)|19);
const K_DABCOMMA = (((KT_DEAD)<<8)|20);
const K_DABREVCOMMA = (((KT_DEAD)<<8)|21);
const K_DDBGRAVE = (((KT_DEAD)<<8)|22);
const K_DINVBREVE = (((KT_DEAD)<<8)|23);
const K_DBECOMMA = (((KT_DEAD)<<8)|24);
const K_DCURRENCY = (((KT_DEAD)<<8)|25);
const K_DGREEK = (((KT_DEAD)<<8)|26);

const K_DOWN = (((KT_CUR)<<8)|0);
const K_LEFT = (((KT_CUR)<<8)|1);
const K_RIGHT = (((KT_CUR)<<8)|2);
const K_UP = (((KT_CUR)<<8)|3);

const K_SHIFT = (((KT_SHIFT)<<8)|KG_SHIFT);
const K_CTRL = (((KT_SHIFT)<<8)|KG_CTRL);
const K_ALT = (((KT_SHIFT)<<8)|KG_ALT);
const K_ALTGR = (((KT_SHIFT)<<8)|KG_ALTGR);
const K_SHIFTL = (((KT_SHIFT)<<8)|KG_SHIFTL);
const K_SHIFTR = (((KT_SHIFT)<<8)|KG_SHIFTR);
const K_CTRLL  = (((KT_SHIFT)<<8)|KG_CTRLL);
const K_CTRLR  = (((KT_SHIFT)<<8)|KG_CTRLR);
const K_CAPSSHIFT = (((KT_SHIFT)<<8)|KG_CAPSSHIFT);

const K_ASC0 = (((KT_ASCII)<<8)|0);
const K_ASC1 = (((KT_ASCII)<<8)|1);
const K_ASC2 = (((KT_ASCII)<<8)|2);
const K_ASC3 = (((KT_ASCII)<<8)|3);
const K_ASC4 = (((KT_ASCII)<<8)|4);
const K_ASC5 = (((KT_ASCII)<<8)|5);
const K_ASC6 = (((KT_ASCII)<<8)|6);
const K_ASC7 = (((KT_ASCII)<<8)|7);
const K_ASC8 = (((KT_ASCII)<<8)|8);
const K_ASC9 = (((KT_ASCII)<<8)|9);
const K_HEX0 = (((KT_ASCII)<<8)|10);
const K_HEX1 = (((KT_ASCII)<<8)|11);
const K_HEX2 = (((KT_ASCII)<<8)|12);
const K_HEX3 = (((KT_ASCII)<<8)|13);
const K_HEX4 = (((KT_ASCII)<<8)|14);
const K_HEX5 = (((KT_ASCII)<<8)|15);
const K_HEX6 = (((KT_ASCII)<<8)|16);
const K_HEX7 = (((KT_ASCII)<<8)|17);
const K_HEX8 = (((KT_ASCII)<<8)|18);
const K_HEX9 = (((KT_ASCII)<<8)|19);
const K_HEXa = (((KT_ASCII)<<8)|20);
const K_HEXb = (((KT_ASCII)<<8)|21);
const K_HEXc = (((KT_ASCII)<<8)|22);
const K_HEXd = (((KT_ASCII)<<8)|23);
const K_HEXe = (((KT_ASCII)<<8)|24);
const K_HEXf = (((KT_ASCII)<<8)|25);

const K_SHIFTLOCK = (((KT_LOCK)<<8)|KG_SHIFT);
const K_CTRLLOCK = (((KT_LOCK)<<8)|KG_CTRL);
const K_ALTLOCK = (((KT_LOCK)<<8)|KG_ALT);
const K_ALTGRLOCK = (((KT_LOCK)<<8)|KG_ALTGR);
const K_SHIFTLLOCK = (((KT_LOCK)<<8)|KG_SHIFTL);
const K_SHIFTRLOCK = (((KT_LOCK)<<8)|KG_SHIFTR);
const K_CTRLLLOCK = (((KT_LOCK)<<8)|KG_CTRLL);
const K_CTRLRLOCK = (((KT_LOCK)<<8)|KG_CTRLR);
const K_CAPSSHIFTLOCK = (((KT_LOCK)<<8)|KG_CAPSSHIFT);

const K_SHIFT_SLOCK = (((KT_SLOCK)<<8)|KG_SHIFT);
const K_CTRL_SLOCK = (((KT_SLOCK)<<8)|KG_CTRL);
const K_ALT_SLOCK = (((KT_SLOCK)<<8)|KG_ALT);
const K_ALTGR_SLOCK = (((KT_SLOCK)<<8)|KG_ALTGR);
const K_SHIFTL_SLOCK = (((KT_SLOCK)<<8)|KG_SHIFTL);
const K_SHIFTR_SLOCK = (((KT_SLOCK)<<8)|KG_SHIFTR);
const K_CTRLL_SLOCK = (((KT_SLOCK)<<8)|KG_CTRLL);
const K_CTRLR_SLOCK = (((KT_SLOCK)<<8)|KG_CTRLR);
const K_CAPSSHIFT_SLOCK = (((KT_SLOCK)<<8)|KG_CAPSSHIFT);

const K_BRL_BLANK= (((KT_BRL)<<8)| 0);
const K_BRL_DOT1 = (((KT_BRL)<<8)| 1);
const K_BRL_DOT2 = (((KT_BRL)<<8)| 2);
const K_BRL_DOT3 = (((KT_BRL)<<8)| 3);
const K_BRL_DOT4 = (((KT_BRL)<<8)| 4);
const K_BRL_DOT5 = (((KT_BRL)<<8)| 5);
const K_BRL_DOT6 = (((KT_BRL)<<8)| 6);
const K_BRL_DOT7 = (((KT_BRL)<<8)| 7);
const K_BRL_DOT8 = (((KT_BRL)<<8)| 8);
const K_BRL_DOT9 = (((KT_BRL)<<8)| 9);
const K_BRL_DOT10 = (((KT_BRL)<<8)| 10);

const NR_BRL = 11;

const MAX_DIACR = 256;

const Key = { 
    NONE: 0xffff, /* only in KeyPressed when no key is pressed */

    NUL: 0, /* ␀ */
    CTRL_A: 1, /* Ctrl + A */
    CTRL_B: 2, /* Ctrl + B */
    CTRL_C: 3, /* Ctrl + C */
    CTRL_D: 4, /* Ctrl + D */
    CTRL_E: 5, /* Ctrl + E */
    CTRL_F: 6, /* Ctrl + F */
    CTRL_G: 7, /* Ctrl + G */
    BACKSPACE: 8, /* ← [Ctrl + H] */
    TAB: 9, /* ⇥ [Ctrl + I] */
    LINEFEED: 10, /* ␊ [Ctrl + J] */
    CTRL_K: 11, /* Ctrl + K */
    CTRL_L: 12, /* Ctrl + L */
    CTRL_M: 13, /* Ctrl + M */
    CTRL_N: 14, /* Ctrl + N */
    CTRL_O: 15, /* Ctrl + O */
    CTRL_P: 16, /* Ctrl + P */
    CTRL_Q: 17, /* Ctrl + Q */
    CTRL_R: 18, /* Ctrl + R */
    CTRL_S: 19, /* Ctrl + S */
    CTRL_T: 20, /* Ctrl + T */
    CTRL_U: 21, /* Ctrl + U */
    CTRL_V: 22, /* Ctrl + V */
    CTRL_W: 23, /* Ctrl + W */
    CTRL_X: 24, /* Ctrl + X */
    CTRL_Y: 25, /* Ctrl + Y */
    CTRL_Z: 26, /* Ctrl + Z */
    ESC: 27, /* ␛ */
    CTRL_BACKSLASH: 28, /* Ctrl + \ */
    CTRL_BRACKETRIGHT: 29, /* Ctrl + [ */
    CTRL_ASCIICIRCUM: 30, /* Ctrl + ^ */
    CTRL_UNDERSCORE: 31, /* Ctrl + _ */
    SPACE: 32, /* ⎵ */
    ESCLAM: 33, /* ! */
    DBLQUOTE: 34, /* " */
    NUMBERSIGN: 35, /* # */
    DOLLAR: 36, /* $ */
    PERCENT: 37, /* % */
    AMPERSAND: 38, /* & */
    APOSTROPHE: 39, /* ' */
    PARENLEFT: 40, /* ( */
    PARENRIGHT: 41, /* ) */
    ASTERISK: 42, /* * */
    PLUS: 43, /* + */
    COMMA: 44, /* , */
    MINUS: 45, /* - */
    PERIOD: 46, /* . */
    SLASH: 47, /* / */
    /*$0*/ZERO: 48, /* 0 */
    /*$1*/ONE: 49, /* 1 */
    /*$2*/TWO: 50, /* 2 */
    /*$3*/THREE: 51, /* 3 */
    /*$4*/FOUR: 52, /* 4 */
    /*$5*/FIVE: 53, /* 5 */
    /*$6*/SIX: 54, /* 6 */
    /*$7*/SEVEN: 55, /* 7 */
    /*$8*/EIGHT: 56, /* 8 */
    /*$9*/NINE: 57, /* 9 */
    COLON: 58, /* , */
    SEMICOLON: 59, /* ; */
    LESS: 60, /* < */
    EQUAL: 61, /*: */
    GREATER: 62, /* > */
    QUESTION: 63, /* ? */
    AT: 64, /* @ */
    A: 65, /* A */
    B: 66, /* B */
    C: 67, /* C */
    D: 68, /* D */
    E: 69, /* E */
    F: 70, /* F */
    G: 71, /* G */
    H: 72, /* H */
    I: 73, /* I */
    J: 74, /* J */
    K: 75, /* K */
    L: 76, /* L */
    M: 77, /* M */
    N: 78, /* N */
    O: 79, /* O */
    P: 80, /* P */
    Q: 81, /* Q */
    R: 82, /* R */
    S: 83, /* S */
    T: 84, /* T */
    U: 85, /* U */
    V: 86, /* V */
    W: 87, /* W */
    X: 88, /* X */
    Y: 89, /* Y */
    Z: 90, /* Z */
    BRACKETLEFT: 91, /* [ */
    BACKSLASH: 92, /* \ */
    BRACKETRIGHT: 93, /* ] */
    ASCIICIRCUM: 94, /* ^ */
    UNDERSCORE: 95, /* _ */
    GRAVE: 96, /* `  */
    a: 97, /* a */
    b: 98, /* b */
    c: 99, /* c */
    d: 100, /* d */
    e: 101, /* e */
    f: 102, /* f */
    g: 103, /* g */
    h: 104, /* h */
    i: 105, /* i */
    j: 106, /* j */
    k: 107, /* k */
    l: 108, /* l */
    m: 109, /* m */
    n: 110, /* n */
    o: 111, /* o */
    p: 112, /* p */
    q: 113, /* q */
    r: 114, /* r */
    s: 115, /* s */
    t: 116, /* t */
    u: 117, /* u */
    v: 118, /* v */
    w: 119, /* w */
    x: 120, /* x */
    y: 121, /* y */
    z: 122, /* z */
    BRACELEFT: 123, /* { */
    BAR: 124, /* | */
    BRACERIGHT: 125, /* } */
    ASCIITILDE: 126, /* ~ */
    DEconstE: 127, /* ␡ */
    // generally from now on the values will differ in most charsets, the one's before only differ one's like cyrillic, greek, etc.
    EMPTY_1: 128, // in ISO-8859-* (latin-*) charsets chars 128-159 are invisable control chars, so they don't represent any key
    EMPTY_2: 129, // we include them here to so that they don't get tured into Key::Enum::HOLE when using Key::ToEnum('') with them
    EMPTY_3: 130,
    EMPTY_4: 131,
    EMPTY_5: 132,
    EMPTY_6: 133,
    EMPTY_7: 134,
    EMPTY_8: 135,
    EMPTY_9: 136,
    EMPTY_10: 137,
    EMPTY_11: 138,
    EMPTY_12: 139,
    EMPTY_13: 140,
    EMPTY_14: 141,
    EMPTY_15: 142,
    EMPTY_16: 143,
    EMPTY_17: 144,
    EMPTY_18: 145,
    EMPTY_19: 146,
    EMPTY_20: 147,
    EMPTY_21: 148,
    EMPTY_22: 149,
    EMPTY_23: 150,
    EMPTY_24: 151,
    EMPTY_25: 153,
    EMPTY_26: 153,
    EMPTY_27: 154,
    EMPTY_28: 155,
    EMPTY_29: 156,
    EMPTY_30: 157,
    EMPTY_31: 158,
    EMPTY_32: 159,
    NOBREAKSPACE: 160, /* ⍽ */
    EXCLAMDOWN: 161, /* ¡ */
    CENT: 162, /* ¢ */
    STERLING: 163, /* £ */
    CURRENCY: 164, /* ¤ */
    YEN: 165, /* ¥ */
    BROKENBAR: 166, /* ¦ */
    SECTION: 167, /* § */
    DIAERESIS: 168, /* ¨ */
    COPYRIGHT: 169, /* © */
    ORDFEMININE: 170, /* ª */
    GUILLEMOTLEFT: 171, /* « */
    NOTSIGN: 172, /* ¬ */
    HYPHEN: 173, /* - */
    REGISTERED: 174, /* ® */
    MACRON: 175, /* ¯ */
    DEGREE: 176, /* ° */
    PLUSMINUS: 177, /* ± */
    TWOSUPERIOR: 178, /* ² */
    THREESUPERIOR: 179, /* ³ */
    ACUTE: 180, /* ´ */
    MU: 181, /* µ */
    PARAGRAPH: 182, /* ¶ */
    PERIODCENTERED: 183, /* · */
    CEDILLA: 184, /* ç */
    ONESUPERIOR: 185, /* ¹ */
    MASCULINE: 186, /* ♂ */
    GUILLEMOTRIGHT: 187, /* » */
    ONEQUARTER: 188, /* ¼ */
    ONEHALF: 189, /* ½ */
    THREEQUARTERS: 190, /* ¾ */
    QUESTIONDOWN: 191, /* ¿ */
    A_GRAVE: 192, /* À */
    A_ACUTE: 193, /* Á */
    A_CIRCUMFLEX: 194, /* Â */
    A_TILDE: 195, /* Ã */
    A_DIAERESIS: 196, /* Ä */
    A_RING: 197, /* Å */
    AE: 198, /* Æ */
    C_CEDILLA: 199, /* Ç */
    E_GRAVE: 200, /* È */
    E_ACUTE: 201, /* É */
    E_CIRCUMFLEX: 202, /* Ê */
    E_DIAERESIS: 203, /* Ë */
    I_GRAVE: 204, /* Ì */
    I_ACUTE: 205, /* Í */
    I_CIRCUMFLEX: 206, /* Î */
    I_DIAERESIS: 207, /* Ï */
    ETH: 208, /* Ð */
    N_TILDE: 209, /* Ñ */
    O_GRAVE: 210, /* Ò */
    O_ACUTE: 211, /* Ó */
    O_CIRCUMFLEX: 212, /* Ô */
    O_TILDE: 213, /* Õ */
    O_DIAERESIS: 214, /* Ö */
    MULTIPLY: 215, /* × */
    O_SLASH: 216, /* Ø */
    U_GRAVE: 217, /* Ù */
    U_ACUTE: 218, /* Ú */
    U_CIRCUMFLEX: 219, /* Û */
    U_DIAERESIS: 220, /* Ü */
    Y_ACUTE: 221, /* Ý */
    THORN: 222, /* Þ */
    SHARP_S: 223, /* ß */
    a_grave: 224, /* à */
    a_acute: 225, /* á */
    a_circumflex: 226, /* â */
    a_tilde: 227, /* ã */
    a_diaeresis: 228, /* ä */
    a_ring: 229, /* å */
    ae: 230, /* æ */
    c_cedilla: 231, /* ç */
    e_grave: 232, /* è */
    e_acute: 233, /* é */
    e_circumflex: 234, /* ê */
    e_diaeresis: 235, /* ë */
    i_grave: 236, /* ì */
    i_acute: 237, /* í */
    i_circumflex: 238, /* î */
    i_diaeresis: 239, /* ï */
    eth: 240, /* ð */
    n_tilde: 241, /* ñ */
    o_grave: 242, /* ò */
    o_acute: 243, /* ó */
    o_circumflex: 244, /* ô */
    o_tilde: 245, /* õ */
    o_diaeresis: 246, /* ö */
    DIVISION: 247, /* ÷ */
    o_slash: 248, /* ø */
    u_grave: 249, /* ù */
    u_acute: 250, /* ú */
    u_circumflex: 251, /* û */
    u_diaeresis: 252, /* ü */
    y_acute: 253, /* ý */
    thorn: 254, /* þ */
    y_diaeresis: 255, /* ÿ */

    // KT_FN
    F1: K_F1, /* F1 */
    F2: K_F2, /* F2 */
    F3: K_F3, /* F3 */
    F4: K_F4, /* F4 */
    F5: K_F5, /* F5 */
    F6: K_F6, /* F6 */
    F7: K_F7, /* F7 */
    F8: K_F8, /* F8 */
    F9: K_F9, /* F9 */
    F10: K_F10, /* F10 */
    F11: K_F11, /* F11 */
    F12: K_F12, /* F12 */
    F13: K_F13, /* F13 */
    F14: K_F14, /* F14 */
    F15: K_F15, /* F15 */
    F16: K_F16, /* F16 */
    F17: K_F17, /* F17 */
    F18: K_F18, /* F18 */
    F19: K_F19, /* F19 */
    F20: K_F20, /* F20 */
    HOME: K_FIND, /* Find [Home] */
    INSERT: K_INSERT, /* Insert */
    REMOVE: K_REMOVE, /* Remove */
    END: K_SELECT, /* Select [End] */
    PGUP: K_PGUP, /* Prior [PageUp] */
    PGDN: K_PGDN, /* Next [PageDown] */
    MACRO: K_MACRO, /* Macro */
    HELP: K_HELP, /* Help */
    DO: K_DO, /* Do */
    PAUSE: K_PAUSE, /* Pause */
    F21: K_F21, /* F21 */
    F22: K_F22, /* F22 */
    F23: K_F23, /* F23 */
    F24: K_F24, /* F24 */
    F25: K_F25, /* F25 */
    F26: K_F26, /* F26 */
    F27: K_F27, /* F27 */
    F28: K_F28, /* F28 */
    F29: K_F29, /* F29 */
    F30: K_F30, /* F30 */
    F31: K_F31, /* F31 */
    F32: K_F32, /* F32 */
    F33: K_F33, /* F33 */
    F34: K_F34, /* F34 */
    F35: K_F35, /* F35 */
    F36: K_F36, /* F36 */
    F37: K_F37, /* F37 */
    F38: K_F38, /* F38 */
    F39: K_F39, /* F39 */
    F40: K_F40, /* F40 */
    F41: K_F41, /* F41 */
    F42: K_F42, /* F42 */
    F43: K_F43, /* F43 */
    F44: K_F44, /* F44 */
    F45: K_F45, /* F45 */
    F46: K_F46, /* F46 */
    F47: K_F47, /* F47 */
    F48: K_F48, /* F48 */
    F49: K_F49, /* F49 */
    F50: K_F50, /* F50 */
    F51: K_F51, /* F51 */
    F52: K_F52, /* F52 */
    F53: K_F53, /* F53 */
    F54: K_F54, /* F54 */
    F55: K_F55, /* F55 */
    F56: K_F56, /* F56 */
    F57: K_F57, /* F57 */
    F58: K_F58, /* F58 */
    F59: K_F59, /* F59 */
    F60: K_F60, /* F60 */
    F61: K_F61, /* F61 */
    F62: K_F62, /* F62 */
    F63: K_F63, /* F63 */
    F64: K_F64, /* F64 */
    F65: K_F65, /* F65 */
    F66: K_F66, /* F66 */
    F67: K_F67, /* F67 */
    F68: K_F68, /* F68 */
    F69: K_F69, /* F69 */
    F70: K_F70, /* F70 */
    F71: K_F71, /* F71 */
    F72: K_F72, /* F72 */
    F73: K_F73, /* F73 */
    F74: K_F74, /* F74 */
    F75: K_F75, /* F75 */
    F76: K_F76, /* F76 */
    F77: K_F77, /* F77 */
    F78: K_F78, /* F78 */
    F79: K_F79, /* F79 */
    F80: K_F80, /* F80 */
    F81: K_F81, /* F81 */
    F82: K_F82, /* F82 */
    F83: K_F83, /* F83 */
    F84: K_F84, /* F84 */
    F85: K_F85, /* F85 */
    F86: K_F86, /* F86 */
    F87: K_F87, /* F87 */
    F88: K_F88, /* F88 */
    F89: K_F89, /* F89 */
    F90: K_F90, /* F90 */
    F91: K_F91, /* F91 */
    F92: K_F92, /* F92 */
    F93: K_F93, /* F93 */
    F94: K_F94, /* F94 */
    F95: K_F95, /* F95 */
    F96: K_F96, /* F96 */
    F97: K_F97, /* F97 */
    F98: K_F98, /* F98 */
    F99: K_F99, /* F99 */
    F100: K_F100, /* F100 */
    F101: K_F101, /* F101 */
    F102: K_F102, /* F102 */
    F103: K_F103, /* F103 */
    F104: K_F104, /* F104 */
    F105: K_F105, /* F105 */
    F106: K_F106, /* F106 */
    F107: K_F107, /* F107 */
    F108: K_F108, /* F108 */
    F109: K_F109, /* F109 */
    F110: K_F110, /* F110 */
    F111: K_F111, /* F111 */
    F112: K_F112, /* F112 */
    F113: K_F113, /* F113 */
    F114: K_F114, /* F114 */
    F115: K_F115, /* F115 */
    F116: K_F116, /* F116 */
    F117: K_F117, /* F117 */
    F118: K_F118, /* F118 */
    F119: K_F119, /* F119 */
    F120: K_F120, /* F120 */
    F121: K_F121, /* F121 */
    F122: K_F122, /* F122 */
    F123: K_F123, /* F123 */
    F124: K_F124, /* F124 */
    F125: K_F125, /* F125 */
    F126: K_F126, /* F126 */
    F127: K_F127, /* F127 */
    F128: K_F128, /* F128 */
    F129: K_F129, /* F129 */
    F130: K_F130, /* F130 */
    F131: K_F131, /* F131 */
    F132: K_F132, /* F132 */
    F133: K_F133, /* F133 */
    F134: K_F134, /* F134 */
    F135: K_F135, /* F135 */
    F136: K_F136, /* F136 */
    F137: K_F137, /* F137 */
    F138: K_F138, /* F138 */
    F139: K_F139, /* F139 */
    F140: K_F140, /* F140 */
    F141: K_F141, /* F141 */
    F142: K_F142, /* F142 */
    F143: K_F143, /* F143 */
    F144: K_F144, /* F144 */
    F145: K_F145, /* F145 */
    F146: K_F146, /* F146 */
    F147: K_F147, /* F147 */
    F148: K_F148, /* F148 */
    F149: K_F149, /* F149 */
    F150: K_F150, /* F150 */
    F151: K_F151, /* F151 */
    F152: K_F152, /* F152 */
    F153: K_F153, /* F153 */
    F154: K_F154, /* F154 */
    F155: K_F155, /* F155 */
    F156: K_F156, /* F156 */
    F157: K_F157, /* F157 */
    F158: K_F158, /* F158 */
    F159: K_F159, /* F159 */
    F160: K_F160, /* F160 */
    F161: K_F161, /* F161 */
    F162: K_F162, /* F162 */
    F163: K_F163, /* F163 */
    F164: K_F164, /* F164 */
    F165: K_F165, /* F165 */
    F166: K_F166, /* F166 */
    F167: K_F167, /* F167 */
    F168: K_F168, /* F168 */
    F169: K_F169, /* F169 */
    F170: K_F170, /* F170 */
    F171: K_F171, /* F171 */
    F172: K_F172, /* F172 */
    F173: K_F173, /* F173 */
    F174: K_F174, /* F174 */
    F175: K_F175, /* F175 */
    F176: K_F176, /* F176 */
    F177: K_F177, /* F177 */
    F178: K_F178, /* F178 */
    F179: K_F179, /* F179 */
    F180: K_F180, /* F180 */
    F181: K_F181, /* F181 */
    F182: K_F182, /* F182 */
    F183: K_F183, /* F183 */
    F184: K_F184, /* F184 */
    F185: K_F185, /* F185 */
    F186: K_F186, /* F186 */
    F187: K_F187, /* F187 */
    F188: K_F188, /* F188 */
    F189: K_F189, /* F189 */
    F190: K_F190, /* F190 */
    F191: K_F191, /* F191 */
    F192: K_F192, /* F192 */
    F193: K_F193, /* F193 */
    F194: K_F194, /* F194 */
    F195: K_F195, /* F195 */
    F196: K_F196, /* F196 */
    F197: K_F197, /* F197 */
    F198: K_F198, /* F198 */
    F199: K_F199, /* F199 */
    F200: K_F200, /* F200 */
    F201: K_F201, /* F201 */
    F202: K_F202, /* F202 */
    F203: K_F203, /* F203 */
    F204: K_F204, /* F204 */
    F205: K_F205, /* F205 */
    F206: K_F206, /* F206 */
    F207: K_F207, /* F207 */
    F208: K_F208, /* F208 */
    F209: K_F209, /* F209 */
    F210: K_F210, /* F210 */
    F211: K_F211, /* F211 */
    F212: K_F212, /* F212 */
    F213: K_F213, /* F213 */
    F214: K_F214, /* F214 */
    F215: K_F215, /* F215 */
    F216: K_F216, /* F216 */
    F217: K_F217, /* F217 */
    F218: K_F218, /* F218 */
    F219: K_F219, /* F219 */
    F220: K_F220, /* F220 */
    F221: K_F221, /* F221 */
    F222: K_F222, /* F222 */
    F223: K_F223, /* F223 */
    F224: K_F224, /* F224 */
    F225: K_F225, /* F225 */
    F226: K_F226, /* F226 */
    F227: K_F227, /* F227 */
    F228: K_F228, /* F228 */
    F229: K_F229, /* F229 */
    F230: K_F230, /* F230 */
    F231: K_F231, /* F231 */
    F232: K_F232, /* F232 */
    F233: K_F233, /* F233 */
    F234: K_F234, /* F234 */
    F235: K_F235, /* F235 */
    F236: K_F236, /* F236 */
    F237: K_F237, /* F237 */
    F238: K_F238, /* F238 */
    F239: K_F239, /* F239 */
    F240: K_F240, /* F240 */
    F241: K_F241, /* F241 */
    F242: K_F242, /* F242 */
    F243: K_F243, /* F243 */
    F244: K_F244, /* F244 */
    F245: K_F245, /* F245 */
    UNDO: K_UNDO, /* Undo */

    // KT_SPEC
    HOLE: K_HOLE, /* VoidSymbol */
    ENTER: K_ENTER, /* Return */
    SH_REGS: K_SH_REGS, /* Show Registers */
    SH_MEM: K_SH_MEM, /* Show Memory */
    SH_STAT: K_SH_STAT, /* Show State */
    BREAK: K_BREAK, /* Break */
    CONS: K_CONS, /* Last Console */
    CAPS: K_CAPS, /* Caps Lock */
    NUM: K_NUM, /* Num Lock */
    HOLD: K_HOLD, /* Scroll Lock */
    SCROLLFORW: K_SCROLLFORW, /* Scroll Forward */
    SCROLLBACK: K_SCROLLBACK, /* Scroll Backward */
    BOOT: K_BOOT, /* Boot */
    CAPSON: K_CAPSON, /* Caps On */
    COMPOSE: K_COMPOSE, /* Compose */
    SAK: K_SAK, /* SAK */
    DECRCONSOLE: K_DECRCONSOLE, /* Decrease Console */
    INCRCONSOLE: K_INCRCONSOLE, /* Increase Console */
    SPAWNCONSOLE: K_SPAWNCONSOLE, /* EnumboardSignal */
    BARENUMLOCK: K_BARENUMLOCK, /* Bare Num Lock */

    // KT_PAD
    KP0: K_P0, /* numpad 0 */
    KP1: K_P1, /* numpad 1 */
    KP2: K_P2, /* numpad 2 */
    KP3: K_P3, /* numpad 3 */
    KP4: K_P4, /* numpad 4 */
    KP5: K_P5, /* numpad 5 */
    KP6: K_P6, /* numpad 6 */
    KP7: K_P7, /* numpad 7 */
    KP8: K_P8, /* numpad 8 */
    KP9: K_P9, /* numpad 9 */
    KPPLUS: K_PPLUS, /* numpad + */
    KPMINUS: K_PMINUS, /* numpad - */
    KPSTAR: K_PSTAR, /* numpad * */
    KPSLASH: K_PSLASH, /* numpad / */
    KPENTER: K_PENTER, /* numpad Enter */
    KPCOMMA: K_PCOMMA, /* numpad , */
    KPDOT: K_PDOT, /* numpad . */
    KPPLUSMINUS: K_PPLUSMINUS, /* numpad ± */
    KPPARENL: K_PPARENL, /* numpad ( */
    KPPARENR: K_PPARENR, /* numpad ) */

    // KT_DEAD
    DGRAVE: K_DGRAVE, /* [Dead] Grave */
    DACUTE: K_DACUTE, /* [Dead] Acute */
    DCIRCM: K_DCIRCM, /* [Dead] CircumFlex */
    DTILDE: K_DTILDE, /* [Dead] Tilde */
    DDIERE: K_DDIERE, /* [Dead] Diaeresis */
    DCEDIL: K_DCEDIL, /* [Dead] Cedilla */
    DMACRON: K_DMACRON, /* [Dead] Macron */
    DBREVE: K_DBREVE, /* [Dead] Breve (an alias for [Dead] Tilde) */
    DABDOT: K_DABDOT, /* [Dead] Abovedot */
    DABRING: K_DABRING, /* [Dead] Abovering */
    DDBACUTE: K_DDBACUTE, /* [Dead] DoubleAcute (an alias for [Dead] Tilde) */
    DCARON: K_DCARON, /* [Dead] Caron (an alias for [Dead] Circumflex) */
    DOGONEK: K_DOGONEK, /* [Dead] Ogonek (an alias for [Dead] Cedilla) */
    DIOTA: K_DIOTA, /* [Dead] Iota */
    DVOICED: K_DVOICED, /* [Dead] Voiced sound */
    DSEMVOICED: K_DSEMVOICED, /* [Dead] Semivoiced sound */
    DBEDOT: K_DBEDOT, /* [Dead] BelowDot */
    DHOOK: K_DHOOK, /* [Dead] Hook */
    DHORN: K_DHORN, /* [Dead] Horn */
    DSTROKE: K_DSTROKE, /* [Dead] Stroke */
    DABCOMMA: K_DABCOMMA, /* [Dead] Abovecomma */
    DABREVCOMMA: K_DABREVCOMMA, /* [Dead] Abovereversedcomma */
    DDBGRAVE: K_DDBGRAVE, /* [Dead] Doublegrave */
    DINVBREVE: K_DINVBREVE, /* [Dead] Inverted breve */
    DBECOMMA: K_DBECOMMA, /* [Dead] Belowcomma */
    DCURRENCY: K_DCURRENCY, /* [Dead] Currency */
    DGREEK: K_DGREEK, /* [Dead] Greek */

    // KT_CUR
    ARROW_DOWN: K_DOWN, /* Down Arrow */
    ARROW_LEFT: K_LEFT, /* Left Arrow */
    ARROW_RIGHT: K_RIGHT, /* Right Arrow */
    ARROW_UP: K_UP, /* Up Arrow */

    // KT_SHIFT
    SHIFT: K_SHIFT, /* Shift */
    CTRL: K_CTRL, /* AltGramar */
    ALT: K_ALT, /* Control */
    ALTGR: K_ALTGR, /* Alt */
    SHIFTL: K_SHIFTL, /* ShiftLeft */
    SHIFTR: K_SHIFTR, /* ShiftRight */
    CTRLL: K_CTRLL, /* CtrlLeft */
    CTRLR: K_CTRLR, /* CtrlRight */
    CAPSSHIFT: K_CAPSSHIFT, /* CapsShift */

    // KT_ASCII
    ASC0: K_ASC0, /* Ascii_0 */
    ASC1: K_ASC1, /* Ascii_1 */
    ASC2: K_ASC2, /* Ascii_2 */
    ASC3: K_ASC3, /* Ascii_3 */
    ASC4: K_ASC4, /* Ascii_4 */
    ASC5: K_ASC5, /* Ascii_5 */
    ASC6: K_ASC6, /* Ascii_6 */
    ASC7: K_ASC7, /* Ascii_7 */
    ASC8: K_ASC8, /* Ascii_8 */
    ASC9: K_ASC9, /* Ascii_9 */
    HEX0: K_HEX0, /* Hex_0 */
    HEX1: K_HEX1, /* Hex_1 */
    HEX2: K_HEX2, /* Hex_2 */
    HEX3: K_HEX3, /* Hex_3 */
    HEX4: K_HEX4, /* Hex_4 */
    HEX5: K_HEX5, /* Hex_5 */
    HEX6: K_HEX6, /* Hex_6 */
    HEX7: K_HEX7, /* Hex_7 */
    HEX8: K_HEX8, /* Hex_8 */
    HEX9: K_HEX9, /* Hex_9 */
    HEXa: K_HEXa, /* Hex_A */
    HEXb: K_HEXb, /* Hex_B */
    HEXc: K_HEXc, /* Hex_C */
    HEXd: K_HEXd, /* Hex_D */
    HEXe: K_HEXe, /* Hex_E */
    HEXf: K_HEXf, /* Hex_F */
    SHIFTLOCK: K_SHIFTLOCK, /* Shift Lock */
    CTRLLOCK: K_CTRLLOCK, /* AltGr Lock */
    ALTLOCK: K_ALTLOCK, /* Control Lock */
    ALTGRLOCK: K_ALTGRLOCK, /* Alt Lock */
    SHIFTLLOCK: K_SHIFTLLOCK, /* ShiftL Lock */
    SHIFTRLOCK: K_SHIFTRLOCK, /* ShiftR Lock */
    CTRLLLOCK: K_CTRLLLOCK, /* CtrlL Lock */
    CTRLRLOCK: K_CTRLRLOCK, /* CtrlR Lock */
    CAPSSHIFTLOCK: K_CAPSSHIFTLOCK, /* CapsShift Lock */
    
    SHIFT_SLOCK: K_SHIFT_SLOCK, /* Sticky Shift */
    CTRL_SLOCK: K_CTRL_SLOCK, /* Sticky Control */
    ALT_SLOCK: K_ALT_SLOCK, /* Sticky Alt */
    ALTGR_SLOCK: K_ALTGR_SLOCK, /* Sticky AltGr */
    SHIFTL_SLOCK: K_SHIFTL_SLOCK, /* Sticky ShiftLeft */
    SHIFTR_SLOCK: K_SHIFTR_SLOCK, /* Sticky ShiftRight */
    CTRLL_SLOCK: K_CTRLL_SLOCK, /* Sticky CtrlLeft */
    CTRLR_SLOCK: K_CTRLR_SLOCK, /* Sticky CtrlRight */
    CAPSSHIFT_SLOCK: K_CAPSSHIFT_SLOCK, /* Sticky CapsShift */

    BRL_BLANK: K_BRL_BLANK, /* Brl_blank */
    BRL_DOT1: K_BRL_DOT1, /* Brl_dot1 */
    BRL_DOT2: K_BRL_DOT2, /* Brl_dot2 */
    BRL_DOT3: K_BRL_DOT3, /* Brl_dot3 */
    BRL_DOT4: K_BRL_DOT4, /* Brl_dot4 */
    BRL_DOT5: K_BRL_DOT5, /* Brl_dot5 */
    BRL_DOT6: K_BRL_DOT6, /* Brl_dot6 */
    BRL_DOT7: K_BRL_DOT7, /* Brl_dot7 */
    BRL_DOT8: K_BRL_DOT8, /* Brl_dot8 */
    BRL_DOT9: K_BRL_DOT9, /* Brl_dot9 */
    BRL_DOT10: K_BRL_DOT10, /* Brl_dot10 */

    CONSOLE1: (((KT_CONS)<<8)|0), /* Console_1 */
    CONSOLE2: (((KT_CONS)<<8)|1), /* Console_2 */
    CONSOLE3: (((KT_CONS)<<8)|2), /* Console_3 */
    CONSOLE4: (((KT_CONS)<<8)|3), /* Console_4 */
    CONSOLE5: (((KT_CONS)<<8)|4), /* Console_5 */
    CONSOLE6: (((KT_CONS)<<8)|5), /* Console_6 */
    CONSOLE7: (((KT_CONS)<<8)|6), /* Console_7 */
    CONSOLE8: (((KT_CONS)<<8)|7), /* Console_8 */
    CONSOLE9: (((KT_CONS)<<8)|8), /* Console_9 */
    CONSOLE10: (((KT_CONS)<<8)|9), /* Console_10 */
    CONSOLE11: (((KT_CONS)<<8)|10), /* Console_11 */
    CONSOLE12: (((KT_CONS)<<8)|11), /* Console_12 */
    CONSOLE13: (((KT_CONS)<<8)|12), /* Console_13 */
    CONSOLE14: (((KT_CONS)<<8)|13), /* Console_14 */
    CONSOLE15: (((KT_CONS)<<8)|14), /* Console_15 */
    CONSOLE16: (((KT_CONS)<<8)|15), /* Console_16 */
    CONSOLE17: (((KT_CONS)<<8)|16), /* Console_17 */
    CONSOLE18: (((KT_CONS)<<8)|17), /* Console_18 */
    CONSOLE19: (((KT_CONS)<<8)|18), /* Console_19 */
    CONSOLE20: (((KT_CONS)<<8)|19), /* Console_20 */
    CONSOLE21: (((KT_CONS)<<8)|20), /* Console_21 */
    CONSOLE22: (((KT_CONS)<<8)|21), /* Console_22 */
    CONSOLE23: (((KT_CONS)<<8)|22), /* Console_23 */
    CONSOLE24: (((KT_CONS)<<8)|23), /* Console_24 */
    CONSOLE25: (((KT_CONS)<<8)|24), /* Console_25 */
    CONSOLE26: (((KT_CONS)<<8)|25), /* Console_26 */
    CONSOLE27: (((KT_CONS)<<8)|26), /* Console_27 */
    CONSOLE28: (((KT_CONS)<<8)|27), /* Console_28 */
    CONSOLE29: (((KT_CONS)<<8)|28), /* Console_29 */
    CONSOLE30: (((KT_CONS)<<8)|29), /* Console_30 */
    CONSOLE31: (((KT_CONS)<<8)|30), /* Console_31 */
    CONSOLE32: (((KT_CONS)<<8)|31), /* Console_32 */
    CONSOLE33: (((KT_CONS)<<8)|32), /* Console_33 */
    CONSOLE34: (((KT_CONS)<<8)|33), /* Console_34 */
    CONSOLE35: (((KT_CONS)<<8)|34), /* Console_35 */
    CONSOLE36: (((KT_CONS)<<8)|35), /* Console_36 */
    CONSOLE37: (((KT_CONS)<<8)|36), /* Console_37 */
    CONSOLE38: (((KT_CONS)<<8)|37), /* Console_38 */
    CONSOLE39: (((KT_CONS)<<8)|38), /* Console_39 */
    CONSOLE40: (((KT_CONS)<<8)|39), /* Console_40 */
    CONSOLE41: (((KT_CONS)<<8)|40), /* Console_41 */
    CONSOLE42: (((KT_CONS)<<8)|41), /* Console_42 */
    CONSOLE43: (((KT_CONS)<<8)|42), /* Console_43 */
    CONSOLE44: (((KT_CONS)<<8)|43), /* Console_44 */
    CONSOLE45: (((KT_CONS)<<8)|44), /* Console_45 */
    CONSOLE46: (((KT_CONS)<<8)|45), /* Console_46 */
    CONSOLE47: (((KT_CONS)<<8)|46), /* Console_47 */
    CONSOLE48: (((KT_CONS)<<8)|47), /* Console_48 */
    CONSOLE49: (((KT_CONS)<<8)|48), /* Console_49 */
    CONSOLE50: (((KT_CONS)<<8)|49), /* Console_50 */
    CONSOLE51: (((KT_CONS)<<8)|50), /* Console_51 */
    CONSOLE52: (((KT_CONS)<<8)|51), /* Console_52 */
    CONSOLE53: (((KT_CONS)<<8)|52), /* Console_53 */
    CONSOLE54: (((KT_CONS)<<8)|53), /* Console_54 */
    CONSOLE55: (((KT_CONS)<<8)|54), /* Console_55 */
    CONSOLE56: (((KT_CONS)<<8)|55), /* Console_56 */
    CONSOLE57: (((KT_CONS)<<8)|56), /* Console_57 */
    CONSOLE58: (((KT_CONS)<<8)|57), /* Console_58 */
    CONSOLE59: (((KT_CONS)<<8)|58), /* Console_59 */
    CONSOLE60: (((KT_CONS)<<8)|59), /* Console_60 */
    CONSOLE61: (((KT_CONS)<<8)|60), /* Console_61 */
    CONSOLE62: (((KT_CONS)<<8)|61), /* Console_62 */
    CONSOLE63: (((KT_CONS)<<8)|62), /* Console_63 */

    SELECT: 3595, /* Select [End] */
    CANCEL: 3596, /* Cancel */
    KPCLEAR: 3597, /* Empty Keypad Key */
    KANA: 3598, /* IME Kana mode */
    HANGUL: 3599, /* IME Hangul mode */
    IME_ON: 3600, /* IME On */
    JUNJA: 3601, /* IME Junja mode */
    FINAL: 3602, /* IME Final mode */
    HANJA: 3603, /* IME Hanja mode */
    KANJI: 3604, /* IME Kanji mode */
    IME_OFF: 3605, /* IME Off */
    CONVERT: 3606, /* IME Convert */
    NONCONVERT: 3607, /* IME NonConvert */
    ACCEPT: 3608, /* IME Accept */
    MODECHANGE: 3609, /* IME ModeChange */
    PRINT: 3610, /* Print Key */
    EXECUTE: 3611, /* Execute Key */
    SNAPSHOT: 3612, /* Print Screen Key */
    SUPERL: 3613, /* Left Super[Windows/Command] key */
    SUPERR: 3614, /* Right Super[Windows/Command] key */
    MENU: 3615, /* Applications Key */
    SLEEP: 3616, /* Computer Sleep Key */
    AALT: 3617, /* Any Alt */
    BROWSER_BACK: 3618, /* Browser Back */
    BROWSER_FORWARD: 3619, /* Browser Forward */
    BROWSER_REFRESH: 3620, /* Browser Refresh */
    BROWSER_STOP: 3621, /* Browser Stop */
    BROWSER_SEARCH: 3622, /* Browser Search */
    BROWSER_FAVORITES: 3623, /* Browser Favorites */
    BROWSER_HOME: 3624, /* Browser Home */
    VOLUME_MUTE: 3625, /* Volume Mute */
    VOLUME_DOWN: 3626, /* Volume Down */
    VOLUME_UP: 3627, /* Volume Up */
    NEXT_TRACK: 3628, /* Next Track */
    PREV_TRACK: 3629, /* Previous Track */
    STOP: 3630, /* Stop */
    PLAY_PAUSE: 3631, /* Play/Pause */
    LAUNCH_MAIL: 3632, /* Launch Mail */
    LAUNCH_MEDIA_SELECT: 3633, /* Select Media */
    LAUNCH_APP1: 3634, /* Launch Application 1 */
    LAUNCH_APP2: 3635, /* Launch Application 2 */
    MISC: 3636, /* Unknown Miscellaneous Character [VK_OEM_8] */
    PROCCESS: 3637, /* Process Key */
    ATTN: 3638, /* Attn Key */
    CRSEL: 3639, /* CrSel Key */
    EXSEL: 3640, /* ExSel Key */
    EREOF: 3641, /* Erase EOF Key */
    PLAY: 3642, /* Play key */
    ZOOM: 3643, /* Zoom key */
    PA1: 3644, /* PA1 key */
    CLEAR: 3645, /* OEM Clear */

    // Other (Not documented)

    KPEQUAL: 3646, /* numpad , */
    DICTIONARY: 3647, /* Dictionary key */
    UNREGISTER: 3648, /* Unregister word key */
    REGISTERE: 3649, /* Register word key */
    OYAYUBIL: 3650, /* Left OYAYUBI key */
    OYAYUBIR: 3651, /* Right OYAYUBI key */

    // Various extended or enhanced keyboards
    AX: 3652, /* Japanese AX key */
    // MISC2 , , //  "<>" or "\|" on RT 102-key kbd.
    HELP_ICO: 3653, /* Help key on ICO */
    _00_ICO: 3654, /* 00 key on ICO */
    CLEAR_ICO: 3655, /* Empty key on ICO (i think) */

    // Nokia/Ericsson definitions

    RESET: 3656,
    JUMP: 3657,
    PA1_2: 3658, // OEM PA1 key
    PA2: 3659,
    PA3: 3660,
    WSCTRL: 3661,
    CUSEL: 3662,
    ATTN2: 3663, // OEM Attn key
    FINISH: 3664,
    COPY: 3665,
    AUTO: 3666,
    ENLW: 3667,
    BACKTAB: 3668,

    EISU: 3669, /* Eisu (on JIS keyboards) */
    FN: 3670, /* Function key */
};

const Toggle = {
    CapsLock: 0,
    NumLock: 1,
    ScrollLock: 2,
}

class ToggledKeys {
    constructor() {
        this.CapsLock = false;
        this.NumLock = false; // todo: `true` on macOS
        this.ScrollLock = false;
    }
    update(from) {
        this.CapsLock = from.CapsLock;
        this.NumLock = from.NumLock;
        this.ScrollLock = from.ScrollLock;
    }
};

// Linux
const KeyChart = {
    "": Key.NONE,
    "Unidentified": Key.NONE,

    "Escape": Key.ESC,
    "Digit1": Key.ONE,
    "Digit2": Key.TWO,
    "Digit3": Key.THREE,
    "Digit4": Key.FOUR,
    "Digit5": Key.FIVE,
    "Digit6": Key.SIX,
    "Digit7": Key.SEVEN,
    "Digit8": Key.EIGHT,
    "Digit9": Key.NINE,
    "Digit0": Key.ZERO,
    "Minus": Key.MINUS,
    "Equal": Key.EQUAL,
    "Backspace": Key.BACKSPACE,
    "Tab": Key.TAB,
    "KeyQ": Key.q,
    "KeyW": Key.w,
    "KeyE": Key.e,
    "KeyR": Key.r,
    "KeyT": Key.t,
    "KeyY": Key.y,
    "KeyU": Key.u,
    "KeyI": Key.i,
    "KeyO": Key.o,
    "KeyP": Key.p,
    "BracketLeft": Key.BRACKETLEFT,
    "BracketRight": Key.BRACKETRIGHT,
    "Enter": Key.ENTER,
    "ControlLeft": Key.CTRLL,
    "KeyA": Key.a,
    "KeyS": Key.s,
    "KeyD": Key.d,
    "KeyF": Key.f,
    "KeyG": Key.g,
    "KeyH": Key.h,
    "KeyJ": Key.j,
    "KeyK": Key.k,
    "KeyL": Key.l,
    "Semicolon": Key.SEMICOLON,
    "Quote": Key.APOSTROPHE,
    "Backquote": Key.GRAVE,
    "ShiftLeft": Key.SHIFTL,
    "Backslash": Key.BACKSLASH,
    "KeyZ": Key.z,
    "KeyX": Key.x,
    "KeyC": Key.c,
    "KeyV": Key.v,
    "KeyB": Key.b,
    "KeyN": Key.n,
    "KeyM": Key.m,
    "Comma": Key.COMMA,
    "Period": Key.PERIOD,
    "Slash": Key.SLASH,
    "ShiftRight": Key.SHIFTR,
    "NumpadMultiply": Key.KPSTAR,
    "AltLeft": Key.ALT,
    "Space": Key.SPACE,
    "CapsLock": Key.CAPS,
    "F1": Key.F1,
    "F2": Key.F2,
    "F3": Key.F3,
    "F4": Key.F4,
    "F5": Key.F5,
    "F6": Key.F6,
    "F7": Key.F7,
    "F8": Key.F8,
    "F9": Key.F9,
    "F10": Key.F10,
    "NumLock": Key.NUM,
    "ScrollLock": Key.HOLD,
    "Numpad7": Key.KP7,
    "Numpad8": Key.KP8,
    "Numpad9": Key.KP9,
    "NumpadSubtract": Key.KPMINUS,
    "Numpad4": Key.KP4,
    "Numpad5": Key.KP5,
    "Numpad6": Key.KP6,
    "NumpadAdd": Key.KPPLUS,
    "Numpad1": Key.KP1,
    "Numpad2": Key.KP2,
    "Numpad3": Key.KP3,
    "Numpad0": Key.KP0,
    "NumpadDecimal": Key.KPDOT,
    "IntlBackslash": Key.BACKSLASH, // idk
    "F11": Key.F11,
    "F12": Key.F12,
    "IntlRo": Key.SLASH, // not sure
    "Convert": Key.CONVERT,
    "KanaMode": Key.KANA,
    "NonConvert": Key.NONCONVERT,
    "NumpadEnter": Key.KPENTER,
    "ControlRight": Key.CTRLR,
    "NumpadDivide": Key.KPSLASH,
    "PrintScreen": Key.SNAPSHOT,
    "AltRight": Key.ALTGR,
    "Home": Key.HOME,
    "ArrowUp": Key.ARROW_UP,
    "PageUp": Key.PGUP,
    "ArrowLeft": Key.ARROW_LEFT,
    "ArrowRight": Key.ARROW_RIGHT,
    "End": Key.END,
    "ArrowDown": Key.ARROW_DOWN,
    "PageDown": Key.PGDN,
    "Insert": Key.INSERT,
    "Deconste": Key.DEconstE,
    "VolumeMute": Key.VOLUME_MUTE, // Firefox + Chromium <52
    "VolumeDown": Key.VOLUME_DOWN, // Firefox + Chromium <52
    "VolumeUp": Key.VOLUME_UP, // Firefox + Chromium <52
    "AudioVolumeMute": Key.VOLUME_MUTE, // since Chromuim 52
    "AudioVolumeDown": Key.VOLUME_DOWN, // since Chromuim 52
    "AudioVolumeUp": Key.VOLUME_UP, // since Chromuim 52
    "NumpadEqual": Key.KPEQUAL,
    "Pause": Key.PAUSE,
    "NumpadComma": Key.KPCOMMA,
    "Lang1": Key.HANGUL, //Wild guess on linux, windows maybe // Kana on macOS
    "Lang2": Key.HANJA, // Wild guess on linux, windows quite sure // Eisu on macOS
    "IntlYen": Key.YEN, //i think on russian keyboards its \/
    "OSLeft": Key.SUPERL,
    "OSRight": Key.SUPERR,
    "MetaLeft": Key.SUPERL,
    "MetaRight": Key.SUPERR,
    "ContextMenu": Key.MENU,
    "BrowserStop": Key.BROWSER_STOP, // Firefox + Chromium 48+
    "Abort": Key.BROWSER_STOP, // prior to Chromium 48
    "Again": Key.NONE, // no match
    "Props": Key.NONE, // no match // idk if it even exists https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values says no os suppots it
    "Undo": Key.UNDO,
    "Select": Key.SELECT,
    "Copy": Key.COPY,
    "Open": Key.NONE, // no match
    "Paste": Key.NONE, // no match
    "Find": Key.NONE, // maybe Key.HOME
    "Cut": Key.NONE, // no match
    "Help": Key.HELP,
    "LaunchApp2": Key.LAUNCH_APP2,
    "Sleep": Key.SLEEP,
    "WakeUp": Key.NONE, // no match
    "LaunchApp1": Key.LAUNCH_APP1,
    "LaunchMail": Key.LAUNCH_MAIL,
    "BrowserFAV": Key.BROWSER_FAVORITES,
    "BrowserBack": Key.BROWSER_BACK,
    "BrowserForward": Key.BROWSER_FORWARD,
    "Eject": Key.NONE, // no match
    "MediaTrackNext": Key.NEXT_TRACK,
    "MediaPlayPause": Key.PLAY_PAUSE,
    "MediaPlayPrevious": Key.PREV_TRACK,
    "MediaStop": Key.STOP,
    "MediaSelect": Key.LAUNCH_MEDIA_SELECT,
    "BrowserHome": Key.BROWSER_HOME,
    "BrowserRefresh": Key.BROWSER_REFRESH,
    "NupadParenLeft": Key.KPPARENL,
    "NupadParenRight": Key.KPPARENR,
    "F13": Key.F13,
    "F14": Key.F14,
    "F15": Key.F15,
    "F16": Key.F16,
    "F17": Key.F17,
    "F18": Key.F18,
    "F19": Key.F19,
    "F20": Key.F20,
    "F21": Key.F21,
    "F22": Key.F22,
    "F23": Key.F23,
    "F24": Key.F24,
    "BrowserSearch": Key.BROWSER_SEARCH, // Firefox + Chromium 48+
    "BrightnessUp": Key.BROWSER_SEARCH, // prior to Chromium 48
};