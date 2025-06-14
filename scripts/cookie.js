function set_cookie(name, value) {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; SameSite=Strict; domain=${window.location.host}; path=/`
}

function get_cookie(name) {
    let cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
    if (cookie) {
        return decodeURIComponent(cookie.split('=')[1]);
    }
    return null;
}

function pair_to_utf8(val1, val2) {
    return String.fromCharCode(val1, val2);
}