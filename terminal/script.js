// Handle the logic

var WebTerm_HandleInput = null

function WebTerm() {

    var imports = {
        InputHandler: null,
        KeyboardHandler: null,
        ExitHandler: null
    }

    const screen = document.getElementById("screen");
    const fakescreen_h = document.getElementById("fake-screen-h");
    const fakescreen_w = document.getElementById("fake-screen-w");
    const input = document.getElementById("pageinput");

    const params = new URLSearchParams(window.location.search);
    const argv_param = params.get("argv");
    const argv = (argv_param && argv_param.length > 0 && argv_param != 'undefined') ? JSON.parse(argv_param) : null;
    const argc = argv ? argv.length : 0;

    input.value = "\x1b\x18"; // ESCAPE CANCEL
    WebTerm_HandleInput = function(e) {
        if (imports.InputHandler == null) return;
        let str = input.value;
        if (str.length > 2) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] === "\x1b" || str[i] === "\x18") continue;
                imports.InputHandler(str[i]);
                //console.log(str[i]);
            }
            input.value = "\x1b\x18"; // ESC CAN
        } else if (str.length === 1) {
            //log.textContent = text.substring(0, text.length - 1);
            if (str === "\x1b") {
                imports.InputHandler('\x7f'); // DEL
                //console.log("\x7f");
            }
            else if (str === "\x18") {
                imports.InputHandler('\b'); // BACKSPACE
                //console.log("\b");
            } else {
                string =+ str;
                //console.log(str);
            }
            input.value = "\x1b\x18"; // ESC CAN
        } else if (str.length === 0) {
            input.value = "\x1b\x18"; // ESC CAN
        } else {
            //console.log(str);
        }
    }

    function HandleCursor(elem) {
        elem.selectionStart = elem.selectionEnd = 1;
    }

    window.onbeforeunload = function (e) {
        if (imports.ExitHandler) imports.ExitHandler();
        return undefined;
    };

    function MoveCursor1Arg(charnum) {
        cursor_state.pos = Math.max(0, Math.min(charnum, screen.childElementCount - 1));
        newline = false;
    }

    var screen_columns;
    var screen_rows;

    function GetScreenDimensions() {
        return {
            rows: screen_rows,
            columns: screen_columns
        }
    }

    var focused = false;
    var oldblinkstate = false;
    var last_cursor = {x: 0, y: 0};
    var newline = false;
    function MoveCursor(row, column) {
        if (column === undefined) MoveCursor1Arg(row);
        last_cursor.x = Math.max(0, Math.min(column, screen_columns - 1));
        last_cursor.y = Math.max(0, Math.min(row, screen_rows - 1));
        cursor_state.pos = last_cursor.y * screen_columns + last_cursor.x;
        newline = false;
    }

    const style_span_map = {
        begin_span: "<span class='style",
        black: " black",
        red: " red",
        green: " green",
        yellow: " yellow",
        blue: " blue",
        magenta: " magenta",
        cyan: " cyan",
        white: " white",
        light_black: " light_black",
        light_red: " light_red",
        light_green: " light_green",
        light_yellow: " light_yellow",
        light_blue: " light_blue",
        light_magenta: " light_magenta",
        light_cyan: " light_cyan",
        light_white: " light_white",
        white_background: " white_bg",
        black_background: " black_bg",
        red_background: " red_bg",
        green_background: " green_bg",
        yellow_background: " yellow_bg",
        blue_background: " blue_bg",
        magenta_background: " magenta_bg",
        cyan_background: " cyan_bg",
        light_black_background: " light_black_bg",
        light_red_background: " light_red_bg",
        light_green_background: " light_green_bg",
        light_yellow_background: " light_yellow_bg",
        light_blue_background: " light_blue_bg",
        light_magenta_background: " light_magenta_bg",
        light_cyan_background: " light_cyan_bg",
        light_white_background: " light_white_bg",
        space: " space",
        end_span: "'>",
        close_span: "</span>",
    };

    var blinkstate = 50;
    const cursor_types = {full: 0, underline: 1, sideline: 2};
    var cursor_state = {
        hidden: false,
        type: cursor_types.full,
        blink: true,
        pos: 0,
    }
    var thischar = {
        foreground: "",
        background: "",
    };

    var resize = true;
    function SendOutput(scr) {
        if (scr.length) console.log(scr);
        if (resize) {
            let max_childs = screen_columns * screen_rows;
            let scrmax = screen.childElementCount;
            while (--scrmax >= max_childs)
                screen.removeChild(screen.lastChild);

            while (++scrmax < max_childs) {
                let space_span = document.createElement("span");
                space_span.className = "style space";
                space_span.innerText = "#";
                space_span.style.width = symbol_width + "px";
                space_span.style.height = symbol_height + "px";
                space_span.style.zIndex = (1000000 - scrmax);
                screen.appendChild(space_span);
            }

            MoveCursor(last_cursor.y, last_cursor.x);
            resize = false;
        }

        let scrmax = screen.childElementCount;
        //console.log(scrmax);
        for (let i = 0; i < scr.length; i++) {
            let c = scr[i];
            if (c === '\x1b') {
                if (scr[i + 1] === '[') {
                    let j = i+2;
                    let actions = [];
                    let thisstr = "";
                    if (scr[j] === 'H') {
                        MoveCursor(0,0); i=j;
                        newline = true;
                        continue;
                    } else if (scr[j] === 'J') {
                        let str; for (let i = cursor_state.pos; i < screen.childElementCount; i++) str += "\t";
                        SendOutput(str);
                        continue;
                    } else if (scr[j] === 'K') {
                        let str; for (let i = last_cursor.x; i < screen_columns; i++) str += "\t";
                        SendOutput(str);
                        MoveCursor(oldpos.y, oldpos.x);
                        continue;
                    } else if (scr[j] === '#') {
                        // Close term signal sent from implementation => don't call ExitHandler  
                        imports.ExitHandler = null;
                        window.close();
                        window.history.back();
                        setTimeout(function() {window.location="about:blank";});
                    }
                    while (scr[j] === '?' || scr[j] === ';' || (scr[j] >= '0' && scr[j] <= '9')) {
                        if (scr[j] === ';') {
                            let act = {group: thisstr[0] == '?' ? 1 : 0, type: thisstr[0] == '?' ? parseInt(thisstr.substring(1)) : parseInt(thisstr)};
                            actions.push(act);
                            thisstr = "";
                        } else thisstr += scr[j];
                        ++j;
                    }
                    if (scr[j] === ' ' && j+1 < scr.length && scr[j+1] === 'q') {
                        let cursorid = parseInt(thisstr);
                        if (cursorid <= 2) cursor_state.type = cursor_types.full;
                        else if (cursorid <= 4) cursor_state.type = cursor_types.underline;
                        else if (cursorid <= 6) cursor_state.type = cursor_types.sideline;
                        cursor_state.blink = !cursorid || cursorid&1;
                        i = j+1;
                        continue;
                    }
                    let act = {group: thisstr[0] == '?' ? 1 : 0, type: thisstr[0] == '?' ? parseInt(thisstr.substring(1)) : parseInt(thisstr)};
                    actions.push(act);
                    let full_action = {turnon: scr[j] == 'm' ? 0 : scr[j] == 'h' ? 1 : scr[j] == 'l' ? -1 : (scr[j] == 'H' || scr[j] == 'f') ? 2 : scr[j] == 'A' ? 3 : scr[j] == 'B' ? 4 : scr[j] == 'C' ? 5 : scr[j] == 'D' ? 6 : scr[j] == 'E' ? 7 : scr[j] == 'F' ? 8 : scr[j] == 'G' ? 9 : scr[j] == 'n' ? 10 : scr[j] == 'J' ? 11 : scr[j] == 'K' ? 12 : null, actions: actions};
                    //console.log(full_action);
                    if (full_action.turnon === 0) {
                        for (let a = 0; a < full_action.actions.length; a++)
                            if (full_action.actions[a].group === 0) {
                                switch (full_action.actions[a].type) {
                                    case 0: // Reset
                                        thischar.foreground = "";
                                        thischar.background = "";
                                        break;
                                    case 30: // Black
                                        thischar.foreground = style_span_map.black;
                                        break;
                                    case 31: // Red
                                        thischar.foreground = style_span_map.red;
                                        break;
                                    case 32: // Green
                                        thischar.foreground = style_span_map.green;
                                        break;
                                    case 33: // Yellow
                                        thischar.foreground = style_span_map.yellow;
                                        break;
                                    case 34: // Blue
                                        thischar.foreground = style_span_map.blue;
                                        break;
                                    case 35: // Magenta
                                        thischar.foreground = style_span_map.magenta;
                                        break;
                                    case 36: // Cyan
                                        thischar.foreground = style_span_map.cyan;
                                        break;
                                    case 37: // White
                                        thischar.foreground = style_span_map.white;
                                        break;
                                    case 90: // Light Black
                                        thischar.foreground = style_span_map.light_black;
                                        break;
                                    case 91: // Light Red
                                        thischar.foreground = style_span_map.light_red;
                                        break;
                                    case 92: // Light Green
                                        thischar.foreground = style_span_map.light_green;
                                        break;
                                    case 93: // Light Yellow
                                        thischar.foreground = style_span_map.light_yellow;
                                        break;
                                    case 94: // Light Blue
                                        thischar.foreground = style_span_map.light_blue;
                                        break;
                                    case 95: // Light Magenta
                                        thischar.foreground = style_span_map.light_magenta;
                                        break;
                                    case 96: // Light Cyan
                                        thischar.foreground = style_span_map.light_cyan;
                                        break;
                                    case 97: // Light White
                                        thischar.foreground = style_span_map.light_white;
                                        break;
                                    case 39: // Default
                                        thischar.foreground = "";
                                        break;
                                    case 40: // Black Background
                                        thischar.background = style_span_map.black_background;
                                        break;
                                    case 41: // Red Background
                                        thischar.background = style_span_map.red_background;
                                        break;
                                    case 42: // Green Background
                                        thischar.background = style_span_map.green_background;
                                        break;
                                    case 43: // Yellow Background
                                        thischar.background = style_span_map.yellow_background;
                                        break;
                                    case 44: // Blue Background
                                        thischar.background = style_span_map.blue_background;
                                        break;
                                    case 45: // Magenta Background
                                        thischar.background = style_span_map.magenta_background;
                                        break;
                                    case 46: // Cyan Background
                                        thischar.background = style_span_map.cyan_background;
                                        break;
                                    case 47: // White Background
                                        thischar.background = style_span_map.white_background;
                                        break;
                                    case 100: // Light Black Background
                                        thischar.background = style_span_map.light_black_background;
                                        break;
                                    case 101: // Light Red Background
                                        thischar.background = style_span_map.light_red_background;
                                        break;
                                    case 102: // Light Green Background
                                        thischar.background = style_span_map.light_green_background;
                                        break;
                                    case 103: // Light Yellow Background
                                        thischar.background = style_span_map.light_yellow_background;
                                        break;
                                    case 104: // Light Blue Background
                                        thischar.background = style_span_map.light_blue_background;
                                        break;
                                    case 105: // Light Magenta Background
                                        thischar.background = style_span_map.light_magenta_background;
                                        break;
                                    case 106: // Light Cyan Background
                                        thischar.background = style_span_map.light_cyan_background;
                                        break;
                                    case 107: // Light White Background
                                        thischar.background = style_span_map.light_white_background;
                                        break;
                                    case 49: // Default Background
                                        thischar.background = "";
                                        break;
                                    default:
                                        break;
                                }
                            }
                    
                    } else if (full_action.turnon === 2) // ESC[{row};{column}H
                        MoveCursor(full_action.actions[0].type - 1, full_action.actions[1].type - 1);
                    else if (full_action.turnon === 3) // ESC[#A
                        MoveCursor(last_cursor.y-full_action.actions[0].type, last_cursor.x);
                    else if (full_action.turnon === 4) // ESC[#B
                        MoveCursor(last_cursor.y+full_action.actions[0].type, last_cursor.x);
                    else if (full_action.turnon === 5) // ESC[#C
                        MoveCursor(last_cursor.y, last_cursor.x+full_action.actions[0].type);
                    else if (full_action.turnon === 6) // ESC[#D
                        MoveCursor(last_cursor.y, last_cursor.x-full_action.actions[0].type);
                    else if (full_action.turnon === 7) { // ESC[#E
                        if (last_cursor.x == 0 && !newline) newline = true;
                        else MoveCursor(last_cursor.y + 1, 0);
                        if (full_action.actions[0].type > 0) MoveCursor(last_cursor.y+full_action.actions[0].type-1,0);
                    } else if (full_action.turnon === 8) { // ESC[#F
                        if (last_cursor.x == 0 && !newline) {
                            MoveCursor(last_cursor.y-Math.max(2,full_action.actions[0].type+1), 0);
                            newline = true;
                        }
                        else MoveCursor(last_cursor.y-Math.max(1,full_action.actions[0].type), 0);
                    } else if (full_action.turnon === 9) // ESC[#G
                        MoveCursor(last_cursor.y, full_action.actions[0].type - 1);
                    else if (full_action.turnon === 10) { // ESC[#n
                        if (full_action.actions[0].type === 6) {if (imports.InputHandler) imports.InputHandler("\x1b[" + (last_cursor.y + 1) + ';' + (last_cursor.x+1) + 'R');}
                    } else if (full_action.turnon === 11) { // ESC[#J
                        let str = "";
                        let oldpos = last_cursor;
                        switch (full_action.actions[0].type) {
                            case 0: // Erase from cursor to end of display
                                for (let i = cursor_state.pos; i < screen.childElementCount; i++) str += "\t";
                                SendOutput(str);
                                MoveCursor(oldpos.y, oldpos.x);
                                break;
                            case 1: // Erase from start to cursor
                                for (let i = 0; i <= cursor_state.pos; i++) str += "\t";
                                MoveCursor(0, 0);
                                SendOutput(str);
                                break;
                            case 2: // Erase all of display
                                for (let i = 0; i < screen.childElementCount; i++) str += "\t";
                                MoveCursor(0, 0);
                                SendOutput(str);
                                MoveCursor(oldpos.y, oldpos.x);
                                break;
                            case 3: // Erase saved lines (idk what this is -> I won't use it = I don't care)
                                break;
                            default:
                                break;
                        }
                    } else if (full_action.turnon === 12) { // ESC[#K
                        let str = "";
                        let oldpos = last_cursor;
                        switch (full_action.actions[0].type) {
                            case 0: // Erase from cursor to end of line
                                for (let i = last_cursor.x; i < screen_columns; i++) str += "\t";
                                SendOutput(str);
                                MoveCursor(oldpos.y, oldpos.x);
                                break;
                            case 1: // Erase from start to cursor
                                for (let i = 0; i <= last_cursor.x; i++) str += "\t";
                                MoveCursor(last_cursor.y, 0);
                                SendOutput(str);
                                break;
                            case 2: // Erase whole line
                                for (let i = 0; i < screen_columns; i++) str += "\t";
                                MoveCursor(last_cursor.y, 0);
                                SendOutput(str);
                                MoveCursor(oldpos.y, oldpos.x);
                                break;
                            default:
                                break;
                        }
                    } else for (let a = 0; a < full_action.actions.length; a++)
                        if (full_action.actions[a].group === 1) {
                            switch (full_action.actions[a].type) {
                                case 25: // Show/hide cursor
                                    cursor_state.hidden = full_action.turnon === -1;
                                    break;
                                default:
                                    break;
                            }
                        }
                    i = j;
                } else if (scr[i + 1] === '@'){
                    let ch = scr[i + 2];
                    let j = i+1;
                    const args = [];
                    while (ch != '\x07' && j+1 < scr.length) {
                        args.push("");
                        while ((ch = scr[++j]) && ch != '\t' && ch != '\x07' && j < scr.length)
                            args[args.length-1] += ch;
                    }
                    if (j >= scr.length) break;
                    i = j;
                    const args1 = [];
                    for (let i = 1; i < args.length; i++) args1.push(args[i]); // remove first arg0
                    PopupWindow(args1);
                } else if (scr[i+1] === ']') {
                    ++i;
                    let idstr = "";
                    while (++i < scr.length && scr[i] != ';')
                        idstr += scr[i];
                    let id = parseInt(idstr);
                    let titlestr = "";
                    while (++i < scr.length && scr[i] != '\x07') 
                        titlestr += scr[i];
                    if (id == 0 || id == 2 || id == 30)
                        document.title = titlestr;
                }
            } else if (c === '\n') {
                if (!(last_cursor.x == 0 && !newline)) MoveCursor(last_cursor.y + 1, 0);
                newline = true;
            } else if (c === '\r') {
                MoveCursor(last_cursor.y, 0);
            } else {
                if (cursor_state.pos < scrmax) {
                    if (c === '\t') { // space without color
                        if (screen.children[cursor_state.pos].classList != "style" + style_span_map.space)
                            screen.children[cursor_state.pos].classList = "style" + style_span_map.space;
                    } else if (c === ' ') {
                        if (screen.children[cursor_state.pos].classList != "style" + style_span_map.space + thischar.foreground + thischar.background)
                            screen.children[cursor_state.pos].classList = "style" + style_span_map.space + thischar.foreground + thischar.background;
                    } else {
                        if (screen.children[cursor_state.pos].innerText != c) 
                            screen.children[cursor_state.pos].innerText = c;
                        if (screen.children[cursor_state.pos].classList != "style" + thischar.foreground + thischar.background)
                            screen.children[cursor_state.pos].classList = "style" + thischar.foreground + thischar.background;
                    }
                }
                if (++last_cursor.x >= screen_columns) {
                    newline = false;
                    last_cursor.x = 0;
                    ++last_cursor.y;
                } ++cursor_state.pos;
            }
        }
        if (cursor_state.pos >= scrmax) {
            do {
                let space_span = document.createElement("span");
                space_span.className = "style space";
                space_span.innerText = "#";
                space_span.style.width = symbol_width + "px";
                space_span.style.height = symbol_height + "px";
                space_span.style.zIndex = (1000000 - scrmax);
                screen.appendChild(space_span);
            } while (++scrmax < cursor_state.pos);
        }
        //cursor_state.pos = 0;
        //console.log(scrtxt);
        //screen.innerHTML = scrtxt;
    }

    function getStyle(el, styleProp) {
    var value, defaultView = (el.ownerDocument || document).defaultView;
    // W3C standard way:
    if (defaultView && defaultView.getComputedStyle) {
        // sanitize property name to css notation
        // (hypen separated words eg. font-Size)
        styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
        return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    } else if (el.currentStyle) { // IE
        // sanitize property name to camelCase
        styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
        return letter.toUpperCase();
        });
        value = el.currentStyle[styleProp];
        // convert other units to pixels on IE
        if (/^\d+(em|pt|%|ex)?$/i.test(value)) { 
        return (function(value) {
            var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
            el.runtimeStyle.left = el.currentStyle.left;
            el.style.left = value || 0;
            value = el.style.pixelLeft + "px";
            el.style.left = oldLeft;
            el.runtimeStyle.left = oldRsLeft;
            return value;
        })(value);
        }
        return value;
    }
    }

    var oldcursor = { type: cursor_state.type, blink: cursor_state.blink, pos: -1 };
    var lastfocused = true;
    function BlinkStep() {
        let oldblinkstate = (blinkstate > 0);
        if (blinkstate > 0) {
            if (--blinkstate === 0)
                blinkstate = -50;
        } else if (++blinkstate === 0)
                blinkstate = 50;

        SendOutput("");
        if (cursor_state.pos !== oldcursor.pos && oldcursor.pos !== -1) {
            if (oldcursor.pos < screen.childElementCount) {
                if (screen.children[oldcursor.pos].style.top !== "") {
                    screen.children[oldcursor.pos].style.top = "";
                    screen.children[oldcursor.pos].style.marginTop = "";
                    screen.children[oldcursor.pos].style.width = symbol_width + "px";
                    screen.children[oldcursor.pos].style.height = symbol_height + "px";
                    screen.children[oldcursor.pos].style.borderStyle = "";
                } else {
                    screen.children[oldcursor.pos].style.backgroundColor = "";
                    screen.children[oldcursor.pos].style.color = "";
                }
                if (screen.children[oldcursor.pos].classList.contains("cursor"))
                    screen.children[oldcursor.pos].classList.remove("cursor");
            }
            if (cursor_state.pos < screen.childElementCount && !cursor_types.hidden)
                if (!cursor_state.blink || blinkstate > 0 || !focused) {
                    screen.children[cursor_state.pos].classList.add("cursor");
                    if (oldcursor.type === cursor_types.full && focused) {
                        let space = screen.children[cursor_state.pos].classList.contains("space");
                        if (space) screen.children[cursor_state.pos].classList.remove("space");
                        let oldback = getStyle(screen.children[cursor_state.pos], "backgroundColor");
                        if (oldback === "rgba(0, 0, 0, 0)")
                            oldback = getStyle(screen.parentElement, "backgroundColor");
                        let oldfore = getStyle(screen.children[cursor_state.pos], "color");
                        //console.log(oldback,oldfore);
                        screen.children[cursor_state.pos].style.backgroundColor = oldfore;
                        if (space) screen.children[cursor_state.pos].classList.add("space");
                        else screen.children[cursor_state.pos].style.color = oldback;
                    } else if (cursor_state.type === cursor_types.full && !focused) {
                        if (screen.children[cursor_state.pos].style.top === "") {
                            let symbol = {
                                width: getStyle(screen.children[cursor_state.pos], "width"),
                                height: getStyle(screen.children[cursor_state.pos], "height"),
                            };
                            screen.children[cursor_state.pos].style.borderStyle = "solid";
                            let border = {
                                left: getStyle(screen.children[cursor_state.pos], "borderLeftWidth"),
                                right: getStyle(screen.children[cursor_state.pos], "borderRightWidth"),
                                top: getStyle(screen.children[cursor_state.pos], "borderTopWidth"),
                                bottom: getStyle(screen.children[cursor_state.pos], "borderBottomWidth"),
                            };
                            screen.children[cursor_state.pos].style.top = border.top;
                            screen.children[cursor_state.pos].style.marginTop = "-"+border.top;
                            screen.children[cursor_state.pos].style.width = (parseFloat(symbol.width.substr(0,symbol.width.length-2)) - (parseFloat(border.left.substr(0,border.left.length-2)) + parseFloat(border.right.substr(0,border.right.length-2)))) + "px";
                            screen.children[cursor_state.pos].style.height = (parseFloat(symbol.height.substr(0,symbol.height.length-2)) - (parseFloat(border.top.substr(0,border.top.length-2)) + parseFloat(border.bottom.substr(0,border.bottom.length-2)))) + "px";
                        }
                    }
                }
        } else if (cursor_state.pos < screen.childElementCount && (screen.children[cursor_state.pos].classList.contains("cursor") && (focused  || oldcursor.type !== cursor_types.full))) {
            if ((cursor_state.blink && blinkstate < 0 ) || cursor_state.hidden || (cursor_state.type === cursor_types.full && focused && !lastfocused) ) {
                if (oldcursor.type === cursor_types.full && focused && !lastfocused && !cursor_state.hidden) {
                    if (oldcursor.pos < screen.childElementCount) {
                        screen.children[oldcursor.pos].style.top = "";
                        screen.children[oldcursor.pos].style.marginTop = "";
                        screen.children[oldcursor.pos].style.width = symbol_width + "px";
                        screen.children[oldcursor.pos].style.height = symbol_height + "px";
                        screen.children[oldcursor.pos].style.borderStyle = "";
                    }

                    let space = screen.children[cursor_state.pos].classList.contains("space");
                    if (space) screen.children[cursor_state.pos].classList.remove("space");
                    let oldback = getStyle(screen.children[cursor_state.pos], "backgroundColor");
                    if (oldback === "rgba(0, 0, 0, 0)")
                        oldback = getStyle(screen.parentElement, "backgroundColor");
                    let oldfore = getStyle(screen.children[cursor_state.pos], "color");
                    //console.log(oldback,oldfore);
                    screen.children[cursor_state.pos].style.backgroundColor = oldfore;
                    if (space) screen.children[cursor_state.pos].classList.add("space");
                    else screen.children[cursor_state.pos].style.color = oldback;
                } else {
                    screen.children[cursor_state.pos].classList.remove("cursor");
                    if (screen.children[cursor_state.pos].style.top !== "") {
                        screen.children[cursor_state.pos].style.top = "";
                        screen.children[cursor_state.pos].style.marginTop = "";
                        screen.children[oldcursor.pos].style.width = symbol_width + "px";
                        screen.children[oldcursor.pos].style.height = symbol_height + "px";
                        screen.children[cursor_state.pos].style.borderStyle = "";
                    } else {
                        screen.children[cursor_state.pos].style.backgroundColor = "";
                        screen.children[cursor_state.pos].style.color = "";
                    }
                }
            }
        } else {
            if (cursor_state.pos < screen.childElementCount && (!cursor_state.hidden && (!cursor_state.blink || blinkstate > 0 || !focused))) {
                if (!screen.children[cursor_state.pos].classList.contains("cursor"))
                    screen.children[cursor_state.pos].classList.add("cursor");

                if (cursor_state.type === cursor_types.full && focused) {
                    if (screen.children[cursor_state.pos].style.top === "") {
                        screen.children[cursor_state.pos].style.top = "";
                        screen.children[cursor_state.pos].style.marginTop = "";
                        screen.children[cursor_state.pos].style.width = symbol_width + "px";
                        screen.children[cursor_state.pos].style.height = symbol_height + "px";
                        screen.children[cursor_state.pos].style.borderStyle = "";
                    }

                    let space = screen.children[cursor_state.pos].classList.contains("space");
                    if (space) screen.children[cursor_state.pos].classList.remove("space");
                    let oldback = getStyle(screen.children[cursor_state.pos], "backgroundColor");
                    if (oldback === "rgba(0, 0, 0, 0)")
                        oldback = getStyle(screen.parentElement, "backgroundColor");
                    let oldfore = getStyle(screen.children[cursor_state.pos], "color");
                    //console.log(oldback,oldfore);
                    screen.children[cursor_state.pos].style.backgroundColor = oldfore;
                    if (space) screen.children[cursor_state.pos].classList.add("space");
                    else screen.children[cursor_state.pos].style.color = oldback;
                } else if (cursor_state.type === cursor_types.full) {
                    if (screen.children[cursor_state.pos].style.backgroundColor !== "") {
                        screen.children[cursor_state.pos].style.color = "";
                        screen.children[cursor_state.pos].style.backgroundColor = "";
                    }

                    if (screen.children[cursor_state.pos].style.top === "") {
                        let symbol = {
                            width: getStyle(fakescreen_w.children[0], "width"),
                            height: getStyle(fakescreen_w.children[0], "height"),
                        };
                        screen.children[cursor_state.pos].style.borderStyle = "solid";
                        let border = {
                            left: getStyle(screen.children[cursor_state.pos], "borderLeftWidth"),
                            right: getStyle(screen.children[cursor_state.pos], "borderRightWidth"),
                            top: getStyle(screen.children[cursor_state.pos], "borderTopWidth"),
                            bottom: getStyle(screen.children[cursor_state.pos], "borderBottomWidth"),
                        };
                        screen.children[cursor_state.pos].style.top = border.top;
                        screen.children[cursor_state.pos].style.marginTop = "-"+border.top;
                        screen.children[cursor_state.pos].style.width = (parseFloat(symbol.width.substr(0,symbol.width.length-2)) - (parseFloat(border.left.substr(0,border.left.length-2)) + parseFloat(border.right.substr(0,border.right.length-2)))) + "px";
                        screen.children[cursor_state.pos].style.height = (parseFloat(symbol.height.substr(0,symbol.height.length-2)) - (parseFloat(border.top.substr(0,border.top.length-2)) + parseFloat(border.bottom.substr(0,border.bottom.length-2)))) + "px";
                    }
                }
            }
        }
        oldcursor.type = cursor_state.type;
        oldcursor.blink = cursor_state.blink;
        oldcursor.pos = cursor_state.pos;
        lastfocused = focused;
    }

    setInterval(HandleCursor, 1, input);
    setInterval(BlinkStep, 10);

    function xx() {
        return (screen.parentElement.getBoundingClientRect().height-screen.children[0].getBoundingClientRect().top) /(screen.children[0].getBoundingClientRect().height + screen.children[10].getBoundingClientRect().top - screen.children[0].getBoundingClientRect().bottom)
    }

    var symbol_row_overlap;
    var symbol_height;
    var symbol_column_overlap;
    var symbol_width;
    var exess_width;
    var exess_height;
    var mouse_row = 0;
    var mouse_column = 0;
    var toggled_keys = new ToggledKeys();
    ResizeScreen();

    var lastmouse = {x: 0, y: 0};
    function OnMousePress(e) {
        if (e.button != undefined) { // not touch
            if (imports.KeyboardHandler) UpdateToggledKeys(e);
            e.preventDefault();
        }
        if (imports.InputHandler == null) return;

        mouse_row = Math.floor((e.clientY-(exess_height/2)) / symbol_height);
        mouse_column = Math.floor((e.clientX-(exess_width/2)) / symbol_width);

        //console.log(focused);

        operation = 0;
        switch (e.button) {
            case undefined: // touch
            case 0: // left
                operation |= 0; // main button
                break;
            case 1: // middle
                operation |= (1<<0); // secondary button
                break;
            case 2: // right
                operation |= (1<<1); // secondary button
                break;
            case 3: // button 8
                operation |= (1<<7)
                break;
            case 4: // button 9
                operation |= (1<<7) | (1<<0)
                break;
            case 5: // button 10
                operation |= (1<<7) | (1<<1)
                break;
            case 6: // button 11
                operation |= (1<<7) | (1<<1) | (1<<0)
                break;
            default:
                return;
        }
        if (e.shiftKey) operation |= (1<<2); // shift
        if (e.altKey || e.metaKey) operation |= (1<<3); // control
        if (e.ctrlKey) operation |= (1<<4); // alt

        imports.InputHandler("\x1b[<" + operation + ";" + (mouse_column + 1) + ';' + (mouse_row+1) + 'M');
    }

    function OnTapStart(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            OnMousePress(e.changedTouches[i]);
        }
    }

    function OnTapEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            OnMouseRelease(e.changedTouches[i]);
        }
    }

    function OnTapMove(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            OnMouseMove(e.changedTouches[i],e.shiftKey,e.altKey || e.metaKey,e.ctrlKey);
        }
    }

    function OnMouseRelease(e) {
        if (e.button != undefined) { // not touch
            if (imports.KeyboardHandler) UpdateToggledKeys(e);
            e.preventDefault();
        }
        if (imports.InputHandler == null) return;

        mouse_row = Math.floor((e.clientY-(exess_height/2)) / symbol_height);
        mouse_column = Math.floor((e.clientX-(exess_width/2)) / symbol_width);

        operation = 0;
        switch (e.button) {
            case undefined: // touch
            case 0: // left
                operation |= 0; // main button
                break;
            case 1: // middle
                operation |= (1<<0); // secondary button
                break;
            case 2: // right
                operation |= (1<<1); // secondary button
                break;
            case 3: // button 8
                operation |= (1<<7)
                break;
            case 4: // button 9
                operation |= (1<<7) | (1<<0)
                break;
            case 5: // button 10
                operation |= (1<<7) | (1<<1)
                break;
            case 6: // button 11
                operation |= (1<<7) | (1<<1) | (1<<0)
                break;
            default:
                return;
        }
        if (e.shiftKey) operation |= (1<<2); // shift
        if (e.altKey || e.metaKey) operation |= (1<<3); // control
        if (e.ctrlKey) operation |= (1<<4); // alt

        imports.InputHandler("\x1b[<" + operation + ";" + (mouse_column + 1) + ';' + (mouse_row+1) + 'm');
    }

    function OnMouseWheel(e) {
        if (e.button != undefined) { // not touch
            if (imports.KeyboardHandler) UpdateToggledKeys(e);
            e.preventDefault();
        }
        if (imports.InputHandler == null) return;
        mouse_row = Math.floor((e.clientY-(exess_height/2)) / symbol_height);
        mouse_column = Math.floor((e.clientX-(exess_width/2)) / symbol_width);

        var deltaY = e.wheelDeltaY;
        if (e.webkitDirectionInvertedFromDevice) deltaY = -deltaY; // macOS safari `natural scrolling`
        var deltaX = e.wheelDeltaX;
        if (e.webkitDirectionInvertedFromDevice) deltaX = -deltaX; // macOS safari `natural scrolling`

        if (deltaY != 0)
            imports.InputHandler("\x1b[<" + ((1<<6) | ((deltaY < 0) << 0)) + ";" + (mouse_column + 1) + ';' + (mouse_row+1) + "M");
        if (deltaX != 0) {
            imports.InputHandler("\x1b[<" + ((1<<6) | (1<<1) | ((deltaX < 0) << 0)) + ";" + (mouse_column + 1) + ';' + (mouse_row+1) + 'M');
            string +="\x1b[<" + ((1<<6) | (1<<1) |((deltaX < 0) << 0)) + ";" + (mouse_column + 1) + ';' + (mouse_row+1) + 'm';
        }
    }

    function OnMouseMove(e,s,a,c) {
        if (e.buttons != undefined) { // not touch
            if (imports.KeyboardHandler) UpdateToggledKeys(e);
            e.preventDefault();
        }
        if (imports.InputHandler == null) return;

        mouse_row = Math.floor((e.clientY-(exess_height/2)) / symbol_height);
        mouse_column = Math.floor((e.clientX-(exess_width/2)) / symbol_width);


        if (mouse_row >= screen_rows) mouse_row = screen_rows - 1;
        if (mouse_column >= screen_columns) mouse_column = screen_columns - 1;
        if (mouse_row < 0) mouse_row = 0;
        if (mouse_column < 0) mouse_column = 0;
        //console.log(mouse_row, mouse_column);

        let operation = 0;
        
        operation |= (1<<5); // move event

        // 0bxxxx doesn't work in IE
        if ((e.buttons == undefined) || e.buttons & (1<<0)) operation |= 0; // main button
        else if (e.buttons & (1<<1)) operation |= (1<<1); // secondary button
        else if (e.buttons & (1<<2)) operation |= (1<<0); // middle button
        else if (false) operation |= (1<<6); // scroll up (button 4)
        else if (false) operation |= (1<<6) | (1<<0); // scroll down (button 5)
        else if (false) operation |= (1<<6) | (1<<1); // scroll left (button 6)
        else if (false) operation |= (1<<6) | (1<<1) | (1<<0); // scroll right (button 7)
        else if (e.buttons & (1<<3)) operation |= (1<<7); // button 8
        else if (e.buttons & (1<<4)) operation |= (1<<7) | (1<<0); // button 9
        else if (e.buttons & (1<<5)) operation |= (1<<7) | (1<<1); // button 10
        else if (e.buttons & (1<<6)) operation |= (1<<7) | (1<<1) | (1<<0); // button 11
        else operation |= (1<<1) | (1<<0); // no (supported) button
        
        if (e.buttons) {
            if (e.shiftKey) operation |= (1<<2); // shift
            if (e.altKey || e.metaKey) operation |= (1<<3); // control
            if (e.ctrlKey) operation |= (1<<4); // alt
        } else {
            if (s) operation |= (1<<2); // shift
            if (a) operation |= (1<<3); // control
            if (c) operation |= (1<<4); // alt
        }
        
        lastmouse.x = mouse_column; lastmouse.y = mouse_row;
        imports.InputHandler("\x1b[<" + operation + ";" + (mouse_column + 1) + ';' + (mouse_row+1) + 'M');

        //MoveCursor(mouse_row, mouse_column);
    }

    function UpdateToggledKeys(e) {
        new_toggled = new ToggledKeys();
        new_toggled.CapsLock = e.getModifierState("CapsLock");
        new_toggled.NumLock = e.getModifierState("NumLock");
        new_toggled.ScrollLock = e.getModifierState("ScrollLock");

        if (new_toggled.CapsLock !== toggled_keys.CapsLock)
            imports.KeyboardHandler({
                type: new_toggled.CapsLock ? event_type.toggle_on : event_type.toggle_off,
                value: Toggle.CapsLock
            });
        if (new_toggled.NumLock !== toggled_keys.NumLock)
            imports.KeyboardHandler({
                type: new_toggled.NumLock ? event_type.toggle_on : event_type.toggle_off,
                value: Toggle.NumLock
            });
        if (new_toggled.ScrollLock !== toggled_keys.ScrollLock)
            imports.KeyboardHandler({
                type: new_toggled.ScrollLock ? event_type.toggle_on : event_type.toggle_off,
                value: Toggle.ScrollLock
            });
        
        toggled_keys.update(new_toggled);
    }

    function OnKeyPress(e) {
        if (imports.KeyboardHandler == null) return;
        UpdateToggledKeys(e);

        //console.log("browser keycode: ", e.code);
        imports.KeyboardHandler({
            type: event_type.key_down,
            val: KeyChart[e.code]
        })
        //console.log("keycode ", KeyChart[e.code], " press");
    }

    function OnKeyRelease(e) {
        if (imports.KeyboardHandler == null) return;
        UpdateToggledKeys(e);

        //console.log("browser keycode: ", e.code);
        imports.KeyboardHandler({
            type: event_type.key_up,
            val: KeyChart[e.code]
        })
        //console.log("keycode ", KeyChart[e.code], " release");
    }

    window.addEventListener("mousemove", OnMouseMove);
    window.addEventListener("mousedown", OnMousePress);
    window.addEventListener("mouseup", OnMouseRelease);
    window.addEventListener("wheel", OnMouseWheel);
    window.addEventListener("touchstart", OnTapStart);
    window.addEventListener("touchend", OnTapEnd);
    window.addEventListener("touchmove", OnTapMove);
    window.addEventListener("keydown", OnKeyPress);
    window.addEventListener("keyup", OnKeyRelease);

    window.addEventListener("click", function(e) {e.preventDefault();});
    window.addEventListener("resize", ResizeScreen);

    var last_win_width = 0;
    var last_win_height = 0;

    var last_screen_rows = 0;
    var last_screen_columns = 0;

    var old_symbol_width = 0;
    function ResizeScreen() {
        let win_width = screen.parentElement.getBoundingClientRect().width;
        let win_height = screen.parentElement.getBoundingClientRect().height;
        if (win_width === last_win_width && win_height === last_win_height) return;

        symbol_height = fakescreen_h.children[0].getBoundingClientRect().height;
        screen_rows = Math.floor(win_height / symbol_height); // how many rows of symbols fit in the screen
        exess_height = win_height - screen_rows * symbol_height; // how much space is left
        
        symbol_width = fakescreen_w.children[0].getBoundingClientRect().width;
        screen_columns = Math.floor(win_width / symbol_width); // how many columns of symbols fit in the screen
        exess_width = win_width - screen_columns * symbol_width; // how much space is left

        if (old_symbol_width != symbol_width) {
            old_symbol_width = symbol_width;
            let chars = screen.children;
            for (let i = 0; i < chars.length; i++) {
                let char = chars[i];
                char.style.width = symbol_width + "px";
                char.style.height = symbol_height + "px";
            }
        }

        screen.style.top = (exess_height / 2) + "px";
        screen.style.left = (exess_width / 2) + "px";

        //if (screen_rows != last_screen_rows || screen_columns != last_screen_columns)
            //console.log(screen_rows, screen_columns);

        //console.log("Screen size: X=", screen_rows, ", Y=", screen_columns);
        //console.log("Exess size: X=", exess_width, ", Y=", exess_height);
        //console.log("Symbol size: X=", symbol_width, ", Y=", symbol_height);
        //console.log("");

        resize = true;
    }
    /*
    function FocusChange() {
        if (document.visibilityState === "hidden") {
            console.log("Lost focus");
        } else {
            console.log("Got focus");
        }
    }

    FocusChange();
    document.addEventListener("visibilitychange", FocusChange);*/

    function GotFocus() {
        input.focus();
        focused = true;
        blinkstate = 51;
        BlinkStep();
        //console.log("[I");
    }

    function LostFocus() {
        focused = false;
        BlinkStep();
        //console.log("[O");
    }

    var popup_counter = 0;

    isOpera = navigator.userAgent.indexOf("OPR") > -1 || navigator.userAgent.indexOf("Opera") > -1;

    function PopupWindow(argv) {
        let url = window.location.protocol + "//" + window.location.host + window.location.pathname
        let query = new URLSearchParams();
        let argv_str = JSON.stringify(argv);
        query.append("argc",argv.length);
        query.append("argv",argv_str);
        if (isOpera) document.open(url+"?"+query.toString(),`popup${gameid}-${++popup_counter}`,'width=auto,height=auto');
        else document.open(url+"?"+query.toString(),`popup${gameid}-${++popup_counter}`,'width=700,height=450');
    }

    window.addEventListener("contextmenu", (e) => e.preventDefault());
    GotFocus();
    window.addEventListener("focus", GotFocus);
    window.addEventListener("blur", LostFocus);

    imports = Main(SendOutput,GetScreenDimensions);
}

document.addEventListener("DOMContentLoaded",WebTerm);