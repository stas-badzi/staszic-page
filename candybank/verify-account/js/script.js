const params = new URLSearchParams(window.location.search);
let email = document.getElementById("your-email").innerText = params.get("email");
let password = params.get("pass");

document.getElementById("resend").href = "../../cgi-bin/candybank/resend-email.cgi" + window.location.search;

function iscorrect(str) {
    for (let i=0; i<str.length; ++i)
        if (str[i] > '\x7f') return false;
    return true;
}


function validate (input) {
    if(input.type == 'email' || input.name == 'email') {
        if(input.value.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    }
    else {
        if(input.value.trim() == ''){
            return false;
        }
    }
}

function showValidate(input) {
    var thisAlert = input.parentElement;

    thisAlert.classList.add('alert-validate');
}

function showValidate2(input) {
    var thisAlert = input.parentElement;

    thisAlert.classList.add('alert-validate-2');
}

function confirm_login(e) {

    var input = document.getElementsByClassName('input100');
    var check = true;

    for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
            showValidate(input[i]);
            e.preventDefault();
            return false;
        }
    }

    let password = document.getElementById('input100pass');
    if (!iscorrect(password.value)) {
        showValidate2(password);
        e.preventDefault();
        return false;
    }
    document.getElementsByClassName('login100-form')[0].submit();
    return true;
}

let lastnums = [
    -1,-1,-1,-1,-1,-1
];

let lastfocused = 0;
var input = document.getElementsByClassName('input100');

let pressedfromlast = true;

for (let i=0; i<input.length; ++i) {
    input[i].addEventListener("keydown",function(e){
        if (e.key == 'Backspace' && input[lastfocused].value.length == 0)
            input[lastfocused = Math.max(0,lastfocused-1)].focus();
        if (e.key == 'ArrowLeft')
            input[lastfocused = Math.max(0,lastfocused-1)].focus();
        if (e.key == 'ArrowRight')
            input[lastfocused = Math.min(input.length,lastfocused+1)].focus();
        if (e.key == '0' || e.key == '1' || e.key == '2' || e.key == '3' || e.key == '4' || e.key == '5' || e.key == '6' || e.key == '7' || e.key == '8' || e.key == '9')
            pressedfromlast = true;
    });
    input[i].value = '';
}

function httpRequest(address, reqType, asyncProc) {
    var req = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    if (asyncProc) { 
      req.onreadystatechange = function() { 
        if (this.readyState == 4) {
          asyncProc(this);
        } 
      };
    }
    req.open(address, reqType, !(!asyncProc));
    req.send();
    return req;
  }

function iscorrectcode(code) {
    let request_params = new URLSearchParams();
    request_params.append("email", email);
    request_params.append("pass", password);
    request_params.append("code", code.join(''));
    let request_verifycode = httpRequest('GET', '../../cgi-bin/candybank/verify-account.cgi?' + request_params.toString(), false);
    if (request_verifycode.status == 200 && (request_verifycode.responseText == 'Verification successful' || request_verifycode.responseText == 'Account already verified'))
        return null;
    if (request_verifycode.status == 200)
        return request_verifycode.responseText;
    return "Server request failed with status " + request_verifycode.status;
}

let lastexitcode = "";

function Tick() {
    let focusedelem = document.activeElement;
    switch (focusedelem.id) {
        case "num1":
            lastfocused = 0;
            break;
        case "num2":
            lastfocused = 1;
            break;
        case "num3":
            lastfocused = 2;
            break;
        case "num4":
            lastfocused = 3;
            break;
        case "num5":
            lastfocused = 4;
            break;
        case "num6":
            lastfocused = 5;
            break;
    
        default:
            (focusedelem = input[lastfocused]).focus();
            break;
    }
    let isall = input.length;
    let moveout = false;
    for (let i=0; i<input.length; i++) {
        for (let j=0; j<input[i].value.length; j++)
            if (input[i].value[j].charCodeAt() < 48 || input[i].value[j].charCodeAt() > 57)
                input[i].value = input[i].value.substring(0, j) + input[i].value.substring(j+1);

        if (input[i].value.length == 0) {
            if (lastnums[i] != -1)
                lastnums[i] = -1;
            isall = false; continue;
        }
        if (input[i].value.length == 1 && (input[i].value[0].charCodeAt()-48) == lastnums[i] && !(pressedfromlast && lastfocused == i)) { --isall; continue; }
        while (input[i].value.length > 1) {
            if (i < input.length - 1) {
                input[i+1].value = input[i].value.substring(1);
            }
            input[i].value = input[i].value.substring(0, 1);
        }
        if (i < input.length - 1)
            input[i+1].focus();
        else moveout = true;
        lastnums[i] = input[i].value[0].charCodeAt()-48;
    }
    pressedfromlast = false;
    focusedelem.selectionStart = 0;
    focusedelem.selectionEnd = 1;
    if (isall > 0) {
        let exitcode = iscorrectcode(lastnums);
        if (exitcode == null) {
            window.location.pathname = window.location.pathname + '../';
            return;
        }
        if (exitcode != lastexitcode) {
            document.getElementById('code-error').innerText = exitcode;
            if (lastexitcode != "")
                input[0].parentElement.parentElement.classList.remove('itemshake');
            else
                document.getElementById('code-error').style.visibility = 'visible';
            input[0].parentElement.parentElement.classList.add('itemshake');
            lastexitcode = exitcode;
        }
        if (moveout)
            input[lastfocused = 0].focus();
    }
}

setInterval(Tick, 1);

