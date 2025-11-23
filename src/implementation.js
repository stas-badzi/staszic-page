// This is an example of how you could connect the terminal with a server
// I am aware that using `GET` requests isn't the proper way to send large amounts of data, but this host only supports this type communication with cgi files
// I am also aware that I should use `https://example.com?data=data`, due to some bug at the time of creation that data had no been passed to the cgi files, that's why I use cookies to communicate


var xml = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
var gameid = -1;
var string = "";
var keys = "";

// typed text + '\b' = backspace; '\7f' = delete
function HandleInput(appendinput) {
    string += appendinput; // append to string and send as a batch later
}

function HandleKeys(event) {
    keys += pair_to_utf8(event.type, event.value); // append to keys (to send later) encoded in base-256
}

function OnUnload() {
    if (gameid == -1) return;
    let _xml = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    _xml.open("GET", `https://stasbadzi.w.staszic.waw.pl/cgi-bin/kill-game/${gameid}.cgi`,false);
    _xml.send();
}

var SendOutput = null;
var GetScreenDimensions = null;

// This will be called by script.js, when the terminal is initialized
function Main(SendOutputFunction,GetScreenDimensionsFunction) {
    SendOutput=SendOutputFunction;
    GetScreenDimensions=GetScreenDimensionsFunction;

    // initialize
    const params = new URLSearchParams(window.location.search);
    const argv_param = params.get("argv");
    const argv = (argv_param && argv_param.length > 0 && argv_param != 'undefined') ? JSON.parse(argv_param) : null;
    const argc = argv ? argv.length : 0;
    set_cookie("args", stringifyJSONarray(argv),"/");
    xml.open("GET", `https://stasbadzi.w.staszic.waw.pl/cgi-bin/new-game.cgi`);
    xml.send();

    // return functions (or null[s] to ignore) to be called when [0]standard input or [1]key states change,
    return {
        InputHandler: HandleInput,
        KeyboardHandler: HandleKeys,
        ExitHandler: OnUnload
    }
}

var gamelaunched = false;
var oldscreendims = null;

xml.onreadystatechange = function() {
    if (xml.readyState == 4 && xml.status == 200) {
        if (gameid == -1) {
            gameid = parseInt(xml.responseText);
            if (gameid == -1) console.error("Game launch failed");
            setTimeout(function() {xml.open("GET", `https://stasbadzi.w.staszic.waw.pl/cgi-bin/update-game/${gameid}.cgi`); xml.send();}, 1000);
        } else {
            if (!gamelaunched) {
                let die = get_cookie(`die${gameid}`);
                gamelaunched = die && die[0] == '1';
            }
            SendOutput(decodeURIComponent(xml.responseText));
            if (oldscreendims != GetScreenDimensions() || !gamelaunched) {
                oldscreendims = GetScreenDimensions();
                set_cookie(`screen${gameid}`, String.fromCharCode(oldscreendims.columns, oldscreendims.rows),"/");
            }
            set_cookie(`stdin${gameid}`, string,"/");
            string = "";
            set_cookie(`keyboard${gameid}`, keys, "/");
            keys = "";
            xml.open("GET", `https://stasbadzi.w.staszic.waw.pl/cgi-bin/update-game/${gameid}.cgi`);
            xml.send();
        }
    } else if (xml.readyState == 4 && (xml.status == 404 || xml.status == 500) && gameid != -1) {
        setTimeout(function() {xml.open("GET", `https://stasbadzi.w.staszic.waw.pl/cgi-bin/update-game/${gameid}.cgi`); xml.send();}, 250);
    }
};

// dunno if does anything so keeping it for now
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let str = xhr.responseText;
            SendOutput(str);
            UpdateWithServer();
        } else {
            console.log("Error: HTTP status " + xhr.status);
        }
    }
};

function UpdateWithServer() {
    let reqpath = window.location.protocol + "//" + window.location.hostname + "/cgi-bin/update.cgi";
    xhr.open("GET", window.location.host+"?"+string);
    xhr.send();
}