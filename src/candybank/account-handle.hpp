#pragma once

#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
#include <clocale>
#include <fstream>
#include <random>
#include <unistd.h>
#include <unordered_map>
#include "../urihandle.hpp"

namespace candybank {

    struct account {
        std::string email;
        std::string username;
        std::string password;
        uint32_t candy;
        size_t username_offset;
        size_t candy_offset;

        bool isadmin; // cannot be changed
    };

    std::unordered_map<std::string,std::string> query;

    inline account get_account() {
        using namespace std;
        setlocale(LC_ALL,"UTF-8");
        auto cookies_cstr = getenv("HTTP_COOKIE");
        if (cookies_cstr == nullptr)
		cookies_cstr = (char *)"";
        string cookies(cookies_cstr);
        vector<string> params = split(cookies, ';');
        string email, password;
        for (auto& param : params) {
            vector<string> key_value = split(param, '=');
            pair<string, string> key_value_pair(trim(key_value[0]), uri_decode(trim(key_value[1])));
            if (key_value_pair.first == "email")
                email = key_value_pair.second;
            else if (key_value_pair.first == "pass")
                password = key_value_pair.second;
        }

        query.clear();
        auto query_cstr = getenv("QUERY_STRING");
        if (query_cstr == nullptr) goto noquery;
        {string querystr(query_cstr);
        vector<string> qparams = split(querystr, '&');
        for (auto& param : qparams) {
            vector<string> key_value = split(param, '=');
            query[searchparam_decode(key_value[0])] = searchparam_decode(key_value[1]);
        }}
    noquery:

        if (email.empty()) {
            cout << "Content-type: text/plain\n\nNot logged in" << flush;
            exit(0);
        }

        FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "r");
        if (userfile == 0) {
            if (errno == ENOENT){
                cout << "Content-type: text/plain\n\nAccount not found" << flush;
                exit(0);
            }
            cout << "Content-type: text/plain\n\nInternal server error " << errno << flush;
            exit(0);
        }
        string check_password = getnext(userfile);
        if (check_password != password) {
            cout << "Content-type: text/plain\n\nIncorrect password" << flush;
            fclose(userfile);
            exit(0);
        }

        struct account result;
        result.password = password;
        result.username_offset = check_password.size() + 1; // check_password + '\0'
        result.email = email;
        result.username = getnext(userfile);
        result.candy_offset = check_password.size() + result.username.size() + 6; // check_password + '\0' + username + '\0' + sizeof(uint32_t)

        uint32_t code;
        fread(&code, sizeof(uint32_t), 1, userfile);
        if (code > 1) {
            cout << "Content-type: text/plain\n\nAccount not verified" << flush;
            fclose(userfile);
            exit(0);
        }
        result.isadmin = code;

        fread(&result.candy, sizeof(uint32_t), 1, userfile);
        fclose(userfile);

        return result;
    }

    inline void set_account(account acc,account oldacc = account()) {
        if (acc.email == oldacc.email && acc.password == oldacc.password && acc.username == oldacc.username && acc.candy == oldacc.candy)
            return;
        using namespace std;
        if (acc.email == oldacc.email) {
            if (acc.password == oldacc.password) {
                FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + acc.email).c_str(), "r+");
                if (userfile == 0) {
                    if (errno == ENOENT){
                        cout << "Content-type: text/plain\n\nAccount not found" << flush;
                        fclose(userfile);
                        exit(0);
                    }
                    cout << "Content-type: text/plain\n\nInternal server error << " << errno << flush;
                    fclose(userfile);
                    exit(0);
                }
                if (acc.username == oldacc.username) {
                    fseek(userfile, acc.candy_offset, SEEK_SET);
                    fwrite(&acc.candy, sizeof(uint32_t), 1, userfile);
                    return;
                }
                fseek(userfile, acc.username_offset, SEEK_SET);
                fwrite(acc.username.c_str(), 1, acc.username.size()+1, userfile);
                if (acc.candy != oldacc.candy) {
                    uint32_t code = acc.isadmin;
                    fwrite(&code, sizeof(uint32_t), 1, userfile);
                    fwrite(&acc.candy, sizeof(uint32_t), 1, userfile);
                }
                return;
            }
        }
        FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + acc.email).c_str(), "w");
        fwrite(acc.password.c_str(), 1, acc.password.size()+1, userfile);
        fwrite(acc.username.c_str(), 1, acc.username.size()+1, userfile);
        uint32_t code = acc.isadmin;
        fwrite(&code, sizeof(uint32_t), 1, userfile);
        fwrite(&acc.candy, sizeof(uint32_t), 1, userfile);
        fclose(userfile);
    }
}
