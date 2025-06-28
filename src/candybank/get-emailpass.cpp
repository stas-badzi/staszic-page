#include <iostream>
#include <string>
#include <vector>
#include "../urihandle.hpp"

using namespace std;

int main() {
    char* cookies = getenv("HTTP_COOKIE");
    if (cookies == nullptr)
        return 1;
    string cookies_str(cookies);
    string email, pass;
    vector<string> cookies_vec = split(cookies_str, ';');
    for (auto& cookie : cookies_vec) {
        vector<string> cookie_vec = split(cookie, '=');
        if (cookie_vec[0] == "email")
            email = uri_decode(cookie_vec[1]);
        else if (cookie_vec[0] == "pass")
            pass = uri_decode(cookie_vec[1]);
    }
    if (email.empty() || pass.empty())
        return 1;
    cout << "Content-type: application/json\n\n"
        "{\"email\":\"" << email << "\",\"pass\":\"" << pass << "\"}";
    return 0;
}