function set_cookie(name, value, path, domain) {
    if (!path) path = window.location.pathname;
    if (!domain) domain = window.location.host;
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; SameSite=Strict; Secure; domain=${domain}; path=${path}`
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