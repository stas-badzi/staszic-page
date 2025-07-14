let xmlname = new XMLHttpRequest();
xmlname.onreadystatechange = function() {
    if (xmlname.readyState == 4 && xmlname.status == 200) {
        if (xmlname.responseText[0] != '{') {
            switch (xmlname.responseText) {
                case "Not logged in":
                case "Account not found":
                case "Incorrect password":
                    window.location.href = "../login/";
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
            }
            console.log(xmlname.responseText);
            return;
        }
        document.getElementById("greeting-name").innerText = JSON.parse(xmlname.responseText).username;
    }
};
xmlname.open("GET",window.location.origin + "/cgi-bin/candybank/account-data.cgi" + window.location.search);
xmlname.send();

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

function change_password(e) {

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
    } else if (password.value.length > 0) {
        let password2 = document.getElementById('input100confpass');
        if (password.value != password2.value) {
            showValidate2(password2);
            check = false;
        }
    }

    if (!check) {
        e.preventDefault();
        return false;
    }
    document.getElementsByClassName('login100-form')[0].submit();
    return true;
}