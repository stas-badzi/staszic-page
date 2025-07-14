#include <iostream>
#include "account-handle.hpp"

using namespace std;
using namespace candybank;

int main() {
    struct account acc = get_account();
    auto query_cstr = getenv("QUERY_STRING");
    if (query_cstr == nullptr) return 0;
    string query(query_cstr);
    if (query.empty()) return 0;
    vector<string> params = split(query, '&');
    string newpassword;

    //cout << "Content-type: text/html\n\n";
    for (auto& param : params) {
        vector<string> key_value = split(param, '=');
        pair<string, string> key_value_pair(key_value[0], searchparam_decode(key_value[1]));
        if (key_value_pair.first == "pass")
            newpassword = key_value_pair.second;
    }
    if (newpassword.empty() || newpassword.size() != 64)
        return 0;

    FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + acc.email).c_str(), "r+");
    if (userfile == 0) {
        cout << "Location: ../../candybank/login?errortype=internal&errorval=" << errno << "\n\n";
        return 0;
    }
    fwrite(newpassword.c_str(), 1, 64, userfile);
    fclose(userfile);
    cout << "Set-Cookie: email=; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/cgi-bin/candybank\n";
    cout << "Set-Cookie: pass=; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/cgi-bin/candybank\n";
    cout << "Location: ../../candybank/\n\n";
    return 0;
}