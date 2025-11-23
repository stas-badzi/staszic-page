#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
#include <clocale>
#include <fstream>
#include <random>
#include "../urihandle.hpp"
using namespace std;

int main() {
   setlocale(LC_ALL,"UTF-8");
   auto query_cstr = getenv("QUERY_STRING");
   if (query_cstr == nullptr) return 0;
   string query(query_cstr);
   if (query.empty()) return 0;
   vector<string> params = split(query, '&');
   string email, password, verification_code;

   //cout << "Content-type: text/html\n\n";
   for (auto& param : params) {
      vector<string> key_value = split(param, '=');
      pair<string, string> key_value_pair(key_value[0], searchparam_decode(key_value[1]));
      if (key_value_pair.first == "email")
         email = key_value_pair.second;
      else if (key_value_pair.first == "pass")
         password = key_value_pair.second;
      else if (key_value_pair.first == "code")
         verification_code = key_value_pair.second;
   }
   if (email.empty() || password.empty() || verification_code.empty())
      return 0;

   FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "r");
   if (userfile == 0) {
      if (errno == ENOENT){
         cout << "Content-type: text/plain\n\nAccount not found";
         return 0;
      }
      cout << "Content-type: text/plain\n\n";
      cout << "Internal server error: " << strerror(errno);
      return 0;
   }
   string check_password = getchars<64>(userfile);
   if (check_password != password) {
      cout << "Content-type: text/plain\n\nIncorrect password";
      return 0;
   }
   int offset = 64 + getnext(userfile).size() + 2; // ignore username
   uint32_t code;
   fread(&code, sizeof(uint32_t), 1, userfile);
   if (code == 0) {
      cout << "Content-type: text/plain\n\nAccount already verified";
      fclose(userfile);
      return 0;
   }
   if (code != stoi(verification_code)) {
      cout << "Content-type: text/plain\n\nIncorrect verification code";
      fclose(userfile);
      return 0;
   }
   cout << "Content-type: text/plain\n\nVerification successful";
   fclose(userfile);
   userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "r+");
   fseek(userfile, offset, SEEK_SET);
   code = 0;
   fwrite(&code, sizeof(uint32_t), 1, userfile);
   fwrite(&code, sizeof(uint32_t), 1, userfile); // candy amount
   return 0;
}