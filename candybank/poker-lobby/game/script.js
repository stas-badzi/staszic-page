let __last__pot = -1;
let __last_this_player = -1;
let __last2_this_player = -1;


let pot = 0;
let raised = 0;
let inserted = [
    0,
    0,
    0,
    0,
    0,
    0
];
let this_player = -1;
let user_exists = false;
let block_joinleave = false;

function joinleave() {
    if (block_joinleave) return;
    block_joinleave = true;
    if (user_exists) {
        client.open("GET",window.location.origin + "/cgi-bin/candybank/poker/leave-game.cgi" + window.location.search);
        client.send();
        isourturn = false;
        document.getElementById("joinleave").innerText = "Leaving after this hand";
    } else {
        client.open("GET",window.location.origin + "/cgi-bin/candybank/poker/join-game.cgi" + window.location.search);
        client.send();
        document.getElementById("joinleave").innerText = "Joining next hand";
        isourturn = false;
    }
}

let __last__inserted = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
];

let cards = [
    [null,null,null,null,null],
    [null,null],
    [null,null],
    [null,null],
    [null,null],
    [null,null],
    [null,null],
]
let __last__cards = [
    [null,null,null,null,null],
    [null,null],
    [null,null],
    [null,null],
    [null,null],
    [null,null],
    [null,null],
]

let money = [
    0,
    0,
    0,
    0,
    0,
    0
];

let names = [
   "Player 1",
   "Player 2",
   "Player 3",
   "Player 4",
   "Player 5",
   "Player 6"
];

let icons = [
   "images/user.svg",
   "images/user.svg",
   "images/user.svg",
   "images/user.svg",
   "images/user.svg",
   "images/user.svg"
];

let __last__money = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
];

let __last__names = [
    "",
    "",
    "",
    "",
    "",
    ""
];

let __last__icons = [
    "images/user.svg",
    "images/user.svg",
    "images/user.svg",
    "images/user.svg",
    "images/user.svg",
    "images/user.svg"
];

let __last__players_active = [
    true,
    true,
    true,
    true,
    true,
    true
];

let players_active = [
    false,
    false,
    false,
    false,
    false,
    false
]

let __last__players_exist = [
    true,
    true,
    true,
    true,
    true,
    true
];

let players_exist = [
    false,
    false,
    false,
    false,
    false,
    false
]

let zeropot = false;

let mutex = false;
function run_locked(func, ...args) {
    if (mutex) setTimeout(run_locked, 1, func, ...args);
    else {
        mutex = true;
        func(...args);
        mutex = false;
    }
}

var server = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

server.onreadystatechange = () => {
  if (server.readyState === XMLHttpRequest.DONE) {
    const status = server.status;
    if (status === 0 || (status >= 200 && status < 400)) {
        switch (server.responseText) {
            case "Not logged in":
            case "Account not found":
            case "Incorrect passord":
                window.location.href = "../../login";
                return;
            case "Account not verified":
                let xml = new XMLHttpRequest();
                xml.open("GET",window.location.origin + "/cgi-bin/candybank/get-emailpass.cgi" + window.location.search, false);
                xml.send();
                let emailpass = JSON.parse(xml.responseText);
                let params = new URLSearchParams();
                params.append("email", emailpass.email);
                params.append("pass", emailpass.pass);
                window.location.href = "../../verify-account/" + params.toString();
                return;
            case "Game not found":
                window.location.href = window.location.origin + window.location.pathname + "../";
                return;
        }

        if (server.responseText.length > 0) {

            run_locked((game_state) => {
                if (zeropot = (game_state.pot == null))
                    pot = 0;
                else pot = game_state.pot;
                if (raised == null) raised = 0;
                else raised = game_state.raised;
                if (game_state.last_bet == null) lastbet = 0;
                else lastbet = game_state.last_bet;

                if (this_player != game_state.active_player || user_exists != game_state.user_exists || (game_state.active_player == 0 && game_state.user_exists)) {
                    if (user_exists && !game_state.user_exists)
                        document.getElementById("joinleave").innerText = "Join Game";
                    else if (!user_exists && game_state.user_exists)
                        document.getElementById("joinleave").innerText = "Leave Game";
                    if (user_exists != game_state.user_exists)
                        block_joinleave = false;
                    user_exists = game_state.user_exists;
                    this_player = game_state.active_player;
                    if (user_exists && this_player == 0)
                        isourturn = true;
                    else
                        isourturn = false;
                }

                cards[0] = game_state.community_cards;
                for (let i=0; i<6; ++i)
                    if (players_exist[i] = (game_state.players[i] != null)) {
                        cards[i+1] = game_state.players[i].cards;
                        money[i] = game_state.players[i].money;
                        names[i] = game_state.players[i].username;
                        inserted[i] = game_state.players[i].bet;
                        players_active[i] = game_state.players[i].active;
                    } else inserted[i] = 0;
                
            },JSON.parse(server.responseText));
        }
    }
      
    setTimeout(() => {
        server.open("GET",window.location.origin + "/cgi-bin/candybank/poker/get-state.cgi" + window.location.search);
        server.send();
    }, 100);
  }
};

server.open("GET",window.location.origin + "/cgi-bin/candybank/poker/get-state.cgi" + window.location.search);
server.send();

var client = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
client.onreadystatechange = () => {
    if (client.readyState === XMLHttpRequest.DONE) {
        const status = client.status;
        if (status === 0 || (status >= 200 && status < 400)) {
            switch (client.responseText) {
                case "Not logged in":
                case "Account not found":
                case "Incorrect passord":
                    window.location.href = "../../login";
                    return;
                case "Account not verified":
                    let params = new URLSearchParams();
                    params.append("email", email);
                    params.append("pass", pass);
                    window.location.href = "../../verify-account/" + params.toString();
                    return;
            }
            console.log(client.responseText);
        }
    }
};

let lastbet = 1;
let ourraised = 0;
let isourturn = false;

let ourcards = [
    3, 48
]

let raiseamount = 1;
let israising = false;
let ourmoney = 1000;
let isallin = false;

var loadedImages = [];
var img;
for (let i = 0; i < 52; i++) {
    var card1_suit = Math.floor(i / 13);
    var card1_suit_str = ["clubs", "diamonds", "hearts", "spades"][card1_suit];
    let card1_value = i % 13;
    let card1_value_str = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"][card1_value];
    let imgname = "images/" + card1_value_str + "_of_" + card1_suit_str + ".svg";
    img = new Image(); img.src = imgname;
    loadedImages[i] = img;
}
for (let i = 0; i < 6; i++) {
    let imgname = icons[i];
    img = new Image(); img.src = imgname;
    loadedImages[52+i] = img;
}

function Tick() {
    if (__last__pot != pot || __last__inserted[0] != inserted[0] || __last__inserted[1] != inserted[1] || __last__inserted[2] != inserted[2] || __last__inserted[3] != inserted[3] || __last__inserted[4] != inserted[4] || __last__inserted[5] != inserted[5]) {
        __last__pot = pot;
        let potx = document.getElementById("pot");
        let realpot = pot;
        for (let i = (6*zeropot); i < 6; i++)
            realpot -= inserted[i];
        potx.children[0].innerText = realpot.toString() + "🍬";
        potx.style.transform = `translate(-${(Math.max(1,Math.floor(Math.log10(realpot)))+2.8)*7/24}em,0)`;
    }
    for (let i = 0; i < 6; i++) {
        var player = document.getElementById("player" + (i+1).toString());
        if (__last__inserted[i] != inserted[i]) {
            __last__inserted[i] = inserted[i];
            player.getElementsByClassName("bet")[0].children[0].innerText = inserted[i].toString() + "🍬";
        }
        if (__last__money[i] != money[i]) {
            __last__money[i] = money[i];
            player.getElementsByClassName("money")[0].innerText = money[i].toString() + "🍬";
        }
        if (__last__names[i] != names[i]) {
            __last__names[i] = names[i];
            player.getElementsByClassName("identity")[0].getElementsByClassName("name")[0].innerText = names[i];
        }
        if (__last__icons[i] != icons[i]) {
            __last__icons[i] = icons[i];
            player.getElementsByClassName("identity")[0].getElementsByClassName("icon")[0].src = icons[i];
        }
        if (__last__players_active[i] != players_active[i]) {
            __last__players_active[i] = players_active[i];
            if (players_active[i])
                player.classList.remove("nonactive");
            else
                player.classList.add("nonactive");
        }
        if (__last__players_exist[i] != players_exist[i]) {
            __last__players_exist[i] = players_exist[i];
            if (players_exist[i])
                player.classList.remove("nonexistent");
            else
                player.classList.add("nonexistent");
        }
        if (__last__cards[i+1][0] != cards[i+1][0]) {
            __last__cards[i+1][0] = cards[i+1][0];
            var pi = document.getElementById("player" + (i+1).toString());
            var cardi1 = pi.getElementsByClassName("hand")[0].getElementsByClassName("img1")[0];
            if (cards[i+1][0] == null)
                cardi1.src = "images/card_reverse.svg";
            else cardi1.src = loadedImages[cards[i+1][0]].src;
        }            
        if (__last__cards[i+1][1] != cards[i+1][1]) {
            __last__cards[i+1][1] = cards[i+1][1];
            var pi = document.getElementById("player" + (i+1).toString());
            var cardi2 = pi.getElementsByClassName("hand")[0].getElementsByClassName("img2")[0];
            if (cards[i+1][1] == null)
                cardi2.src = "images/card_reverse.svg";
            else cardi2.src = loadedImages[cards[i+1][1]].src;
        }
    }
    let comcards = document.getElementById("comcards").getElementsByClassName("cards")[0].children;
    for (let i=0; i<5; ++i)
        if (__last__cards[0][i] != cards[0][i]) {
            __last__cards[0][i] = cards[0][i];
            if (cards[0][i] == null) comcards[4-i].src = "images/card_reverse.svg";
            else comcards[4-i].src = loadedImages[cards[0][i]].src;
        }


    if (__last_this_player != this_player) {
        if (__last_this_player >= 0)
            document.getElementById("player" + (__last_this_player+1).toString()).classList.remove("thisturn");
	    if (this_player >= 0)
            document.getElementById("player" + (this_player+1).toString()).classList.add("thisturn");
	    __last_this_player = this_player;
    }

    var frame = document.getElementById("betting").getElementsByClassName("frame")[0];
    if (isourturn)
        frame.style.visibility = "";
    else {
        frame.style.visibility = "hidden";
        return;
    }

    if (!israising) {
        let call = document.getElementById("call");
        if (raised > inserted[0])
            if (ourmoney <= raised - inserted[0])
                call.innerHTML = "Call <span style='color:red'>ALL IN</span>";
            else call.innerText = "Call " + (raised - inserted[0]).toString() + "🍬";
        else
            call.innerText = "Check";
        let raisebutton = document.getElementById("bet");
        bet.innerHTML = (money[0] <= raised - inserted[0] + lastbet) ? "Bet <span style='color:red'>ALL IN</span>" : "Bet " + lastbet.toString() + "🍬";
    } else {
        var cancel = document.getElementById("fold");
        var confirm = document.getElementById("call");
        var double = document.getElementById("bet");
        cancel.innerText = "Back";
        confirm.innerHTML = "Confirm Bet " + raiseamount.toString() + "🍬 (" + (raiseamount + raised - inserted[0]).toString() + "🍬)";
        double.innerHTML = (money[0] <= raiseamount*2 - inserted[0] + raised) ? `Bet <span style='color:red'>ALL IN</span> [${money[0]+inserted[0]-raised}🍬]` : "Bet \u00d72 [" + raiseamount.toString()*2 + "🍬]";
        if (isallin)
            double.style.visibility = "hidden";
    }
}

function call() {
    if (israising) {
        israising = false;
        let cancel = document.getElementById("fold");
        cancel.innerText = "Fold";
        raised += raiseamount;
        client.open("GET",window.location.origin + "/cgi-bin/candybank/poker/send-action.cgi" + window.location.search + "&bet=" + raiseamount);
    } else client.open("GET",window.location.origin + "/cgi-bin/candybank/poker/send-action.cgi" + window.location.search + "&bet=0");
    client.send();
    isourturn = false;
    money[0] = (money[0] -= raised - inserted[0]);
    inserted[0] = raised;
}

function raise() {
    if (!israising) {
        israising = true;
        raiseamount = lastbet;
    } else {
        raiseamount *= 2;
    }
    if (money[0] <= raised - inserted[0] + raiseamount) {
        raiseamount = money[0]- raised + inserted[0];
        call();
    }
}


function fold() {
    if (israising) {
        israising = false;
        let cancel = document.getElementById("fold");
        cancel.innerText = "Fold";
        let raisebutton = document.getElementById("bet");
        raisebutton.style.visibility = "";
        isallin = false;
        return;
    } else {
        client.open("GET",window.location.origin + "/cgi-bin/candybank/poker/send-action.cgi" + window.location.search + "&bet=-1");
        client.send();
        isourturn = false;
    }
}

setInterval(run_locked,1,Tick);
