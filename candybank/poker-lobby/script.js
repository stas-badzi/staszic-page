
var gameslist;

function findgames() {
    gameslist =document.getElementById("list");
    if (gameslist == null) {
        setTimeout(findgames, 1);
        return;
    }

    let xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("GET", "../storage/poker/games/.nextgame", false);
    xhr.send();
    let maxgame = parseInt(xhr.responseText);
    let gameid = 1;

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText[0] == '{') {
                let elem = document.createElement("button");
                elem.onclick = function () {
                    window.location.href = window.location.origin + window.location.pathname + "game/?gameid=" + this.classList[0];
                };
                let xhrJSON = JSON.parse(xhr.responseText);
                elem.classList.add(gameid);
                elem.innerText = "Game #" + gameid + " (buyin: " + xhrJSON.buyin + ", small blind: " + xhrJSON.blind + ")";
                gameslist.appendChild(elem);
            } else console.warn(xhr.responseText);
            gameid++;
            if (gameid <= maxgame) {xhr.open("GET", "../../cgi-bin/candybank/poker/get-info.cgi?gameid=" + gameid, true);xhr.send();}
        }
    }

    xhr.open("GET", "../../cgi-bin/candybank/poker/get-info.cgi?gameid=" + gameid, true);
    xhr.send();
}

function newgame() {
    let buyin = prompt("Enter the buyin amount in 🍬", "1000");
    if (buyin == null) return;
    let blind = prompt("Enter the blind amount in 🍬", "1");
    if (blind == null) return;
    window.location.href = window.location.origin + "/cgi-bin/candybank/poker/new-game.cgi?buyin=" + buyin + "&blind=" + blind;
}