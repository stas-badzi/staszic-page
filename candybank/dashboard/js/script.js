var candyCount = 0;

function refresh() {
    candyCount = Math.floor(Math.random() * 100000);
    updateCandyCount();
}

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