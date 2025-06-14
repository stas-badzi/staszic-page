#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
#include <clocale>
#include <fstream>
#include <random>
#include "../urihandle.hpp"
#include "send-verification.hpp"
using namespace std;

int main() {
   setlocale(LC_ALL,"UTF-8");
   auto query_cstr = getenv("QUERY_STRING");
   if (query_cstr == nullptr) return 0;
   string query(query_cstr);
   if (query.empty()) return 0;
   vector<string> params = split(query, '&');
   string email, password;

   //cout << "Content-type: text/html\n\n";
   for (auto& param : params) {
      vector<string> key_value = split(param, '=');
      pair<string, string> key_value_pair(key_value[0], searchparam_decode(key_value[1]));
      if (key_value_pair.first == "email")
         email = key_value_pair.second;
      else if (key_value_pair.first == "pass")
         password = key_value_pair.second;
   }
   if (email.empty() || password.empty())
      return 0;

   FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "r");
   if (userfile == 0) {
      cout << "Content-type: text/plain\n\n";
      cout << "Internal server error: " << strerror(errno);
      return 0;
   }
   string check_password = getnext(userfile);
   if (check_password != password) {
      cout << "Content-type: text/plain\n\nIncorrect password";
      return 0;
   }
   int offset = check_password.size() + getnext(userfile).size() + 2; // ignore username
   uint32_t code;
   fread(&code, sizeof(uint32_t), 1, userfile);
   if (code == 0) { // account already verified
      cout << "Location: ../../candybank/?email=" << email << "&pass=" << password << "\n\n";
      fclose(userfile);
      return 0;
   }
   fclose(userfile);

   if (send_mail(email, code)) {
        cout << "Content-type: text/plain\n\n";
        cout << "Error sending verification email" << endl;
        return 0;
   }

   cout << "Location: ../../candybank/verify-account?email=" << email << "&pass=" << password << "\n\n";
   return 0;
}