var candyCount = 0;

let xml = new XMLHttpRequest();
xml.onreadystatechange = function() {
    if (xml.readyState == 4 && xml.status == 200) {
        if (xml.responseText.charCodeAt(0) < 48 || xml.responseText.charCodeAt(0) > 57) {
            switch (xml.responseText) {
                case "Not logged in":
                case "Account not found":
                case "Incorrect password":
                    window.location.href = "../login/";
                    return;
                case "Account not verified":
                    let params = new URLSearchParams();
                    params.append("email", email);
                    params.append("pass", pass);
                    window.location.href = "../verify-account/" + params.toString();
                    return;
            }
            console.log(xml.responseText);
            return;
        }
        candyCount = parseInt(xml.responseText);
        updateCandyCount();
    }
};
let lastCandy = -1;
function updateCandyCount() {
    if (lastCandy != candyCount) {
        lastCandy = candyCount;
        if (candyCount > 999) {
            if (candyCount/1000 == Math.floor(candyCount/1000))
                document.getElementById("candy-count").getElementsByClassName("value")[0].innerText = Math.floor(candyCount/1000);
            else
                document.getElementById("candy-count").getElementsByClassName("value")[0].innerText = (candyCount/1000).toFixed(3);
            document.getElementById("candy-count").getElementsByClassName("currency")[0].innerText = "🍭";
        } else {
            document.getElementById("candy-count").getElementsByClassName("value")[0].innerText = candyCount;
            document.getElementById("candy-count").getElementsByClassName("currency")[0].innerText = "🍬";
        }
    }
}
updateCandyCount();

function refresh() {
    xml.open("GET", "../../cgi-bin/candybank/get-candy.cgi", true);
    xml.send();
}
refresh();