var candyCount = 0;

let xml = new (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
xml.onreadystatechange = function() {
    if (xml.readyState == 4 && xml.status == 200) {
        if (xml.responseText[0] != '{') {
            switch (xml.responseText) {
                case "Not logged in":
                case "Account not found":
                case "Incorrect password":
                    window.location.href = "../login/";
                    return;
                case "Account not verified":
                    let xml = new (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                    xml.open("GET",window.location.origin + "/cgi-bin/candybank/get-emailpass.cgi" + window.location.search, false);
                    xml.send();
                    let emailpass = JSON.parse(xml.responseText);
                    let params = new URLSearchParams();
                    params.append("email", emailpass.email);
                    params.append("pass", emailpass.pass);
                    window.location.href = "../../verify-account/" + params.toString();
                    return;
            }
            console.log(xml.responseText);
            return;
        }
        let responseJSON = JSON.parse(xml.responseText);
        candyCount = parseInt(responseJSON.candy);
        document.getElementById("greeting-name").innerText = responseJSON.username;
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
    xml.open("GET", "../../cgi-bin/candybank/account-data.cgi", true);
    xml.send();
}
refresh();