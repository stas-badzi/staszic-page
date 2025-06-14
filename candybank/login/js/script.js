let params = new URLSearchParams(window.location.search);
let email = params.get("email");
let password = params.get("pass");
if (email && password)
    window.location.pathname = window.location.pathname + "../../cgi-bin/candybank/login-account.cgi";

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