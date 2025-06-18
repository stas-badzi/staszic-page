let __last__pot = -1;

let pot = 0;
let raised = 0;
let inserted = [
    0,
    0,
    0,
    0,
    0,
    0
]

let __last__inserted = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1
]

let money = [
    1000,
    1000,
    1000,
    1000,
    1000,
    1000
]

let names = [
   "Player 1",
   "Player 2",
   "Player 3",
   "Player 4",
   "Player 5",
   "Player 6"
]

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
    img = new Image().src = imgname;
    loadedImages[i] = img
}
for (let i = 0; i < 6; i++) {
    let imgname = icons[i];
    img = new Image().src = imgname;
    loadedImages[52+i] = img;
}

setInterval(function() {
    if (__last__pot != pot) {
        __last__pot = pot;
        var potx = document.getElementById("pot");
        potx.children[0].innerText = pot.toString() + "🍬";
        potx.style.transform = `translate(-${(Math.max(1,Math.floor(Math.log10(pot)))+2.8)*7/24}em,0)`;
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
    }

    var frame = document.getElementById("betting").getElementsByClassName("frame")[0];
    if (isourturn)
        frame.style.visibility = "";
    else {
        frame.style.visibility = "hidden";
        return;
    }

    if (!israising) {
        var call = document.getElementById("call");
        if (raised > ourraised)
            if (ourmoney <= raised - ourraised)
                call.innerHTML = "Call <span style='color:red'>ALL IN</span>";
            else call.innerText = "Call " + (raised - ourraised).toString() + "🍬";
        else
            call.innerText = "Check";
        let raisebutton = document.getElementById("bet");
        bet.innerHTML = (ourmoney <= raised - ourraised + lastbet) ? "Bet <span style='color:red'>ALL IN</span>" : "Bet " + lastbet.toString() + "🍬";
    } else {
        var cancel = document.getElementById("fold");
        var confirm = document.getElementById("call");
        var double = document.getElementById("bet");
        cancel.innerText = "Back";
        confirm.innerHTML = "Confirm Bet " + raiseamount.toString() + "🍬 (" + (raiseamount + raised - ourraised).toString() + "🍬)";
        double.innerHTML = (ourmoney <= raiseamount*2 - ourraised + raised) ? `Bet <span style='color:red'>ALL IN</span> [${ourmoney+ourraised-raised}🍬]` : "Bet \u00d72 [" + raiseamount.toString()*2 + "🍬]";
        if (isallin)
            double.style.visibility = "hidden";
    }

    var p1 = document.getElementById("player1");
    var card11 = p1.getElementsByClassName("hand")[0].getElementsByClassName("img1")[0];
    var card12 = p1.getElementsByClassName("hand")[0].getElementsByClassName("img2")[0];
    var card1_suit = Math.floor(ourcards[0] / 13);
    var card1_suit_str = ["clubs", "diamonds", "hearts", "spades"][card1_suit];
    let card1_value = ourcards[0] % 13;
    let card1_value_str = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"][card1_value];
    card11.src = "images/" + card1_value_str + "_of_" + card1_suit_str + ".svg";

    let card2_value = ourcards[1] % 13;
    let card2_value_str = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"][card2_value];
    let card2_suit = Math.floor(ourcards[1] / 13);
    let card2_suit_str = ["clubs", "diamonds", "hearts", "spades"][card2_suit];
    card12.src = "images/" + card2_value_str + "_of_" + card2_suit_str + ".svg";
}, 1);

function call() {
    if (israising) {
        israising = false;
        let cancel = document.getElementById("fold");
        cancel.innerText = "Fold";
        raised += raiseamount;
        // send(raised);
    } 
    isourturn = false;
    money[0] = (ourmoney -= raised - ourraised);
    inserted[0] = ourraised = raised;
}

function raise() {
    if (!israising) {
        israising = true;
        raiseamount = lastbet;
    } else {
        raiseamount *= 2;
    }
    if (ourmoney <= raised - ourraised + raiseamount) {
        raiseamount = ourmoney - raised + ourraised;
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
        isourturn = false;
    }
}
