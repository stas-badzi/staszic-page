#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
#include <clocale>
#include "../urihandle.hpp"
#include "sha256/sha256.h"
using namespace std;

int main() {
    setlocale(LC_ALL,"UTF-8");
    auto query_cstr = getenv("QUERY_STRING");
    if (query_cstr == nullptr) return 0;
    string query(query_cstr);
    if (query.empty()) return 0;
    vector<string> params = split(query, '&');
    string pass, redirect;
    vector<string> other_params;
    for (auto& param : params) {
        vector<string> key_value = split(param, '=');
        pair<string, string> key_value_pair(key_value[0], key_value[1]);
        if (key_value_pair.first == "pass")
            pass = searchparam_encode(sha256(searchparam_decode(key_value_pair.second)));
        else if (key_value_pair.first == "redirect")
            redirect = searchparam_decode(key_value_pair.second);
        else if (key_value_pair.first != "confpass") other_params.push_back(param);
    }
    cout << "Location: " << redirect << "?pass=" << pass;
    for (auto& param : other_params)
        cout << "&" << param;
    cout << "\n\n";
}