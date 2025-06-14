#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
#include <clocale>
#include <fstream>
#include <random>
#include <unistd.h>
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
   string email, password, username;

   //cout << "Content-type: text/html\n\n";
   for (auto& param : params) {
      vector<string> key_value = split(param, '=');
      pair<string, string> key_value_pair(key_value[0], searchparam_decode(key_value[1]));
      if (key_value_pair.first == "email")
         email = key_value_pair.second;
      else if (key_value_pair.first == "pass")
         password = key_value_pair.second;
      else if (key_value_pair.first == "user")
         username = key_value_pair.second;
   }
   if (email.empty() || password.empty() || username.empty())
      return 0;
   
   FILE* usednames;

   FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "r");
   bool skipusercheck = false;
   if (userfile) {
      getnext(userfile); // password
      string oldusername = getnext(userfile); // username
      uint32_t code;
      fread(&code, sizeof(uint32_t), 1, userfile);
      fclose(userfile);
      if (code == 0) {
         cout << "Set-Cookie: emailerror=" << uri_encode("An account with this email already exists") << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
         cout << "Location: ../../candybank/back.html\n\n";
         return 0;
      }
      // if it's unverified we can overwrite it
      if (unlink(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str()) == -1) {
         cout << "Set-Cookie: othererror=" << uri_encode("Internal server error [1]: " + to_string(errno)) << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
         cout << "Location: ../../candybank/back.html\n\n";
         return 0;
      }

      if (oldusername == username) skipusercheck = true;
      else {
         vector<string> usernames;
         usednames = fopen("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/.usednames", "r");
         if (usednames == 0) {
            cout << "Set-Cookie: othererror=" << uri_encode("Internal server error [2]: " + to_string(errno)) << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
            cout << "Location: ../../candybank/back.html\n\n";
            return 0;
         }
         string next;
         while ((next = getnext(usednames)).size())
            if (next != oldusername)
               usernames.push_back(next);
         fclose(usednames);

         usednames = fopen("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/.usednames", "w");
         for (auto& usernameit : usernames)
            fwrite(usernameit.c_str(), 1, usernameit.size()+1, usednames);
         fclose(usednames);
      }
   } else if (errno != ENOENT) {
      cout << "Set-Cookie: othererror=" << uri_encode("Internal server error [4]: " + to_string(errno)) << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
      cout << "Location: ../../candybank/back.html\n\n";
      return 0;
   }

   if (!skipusercheck) {
      usednames = fopen("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/.usednames", "r");
      if (usednames == 0) {
         cout << "Set-Cookie: othererror=" << uri_encode("Internal server error [5]: " + to_string(errno)) << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
         cout << "Location: ../../candybank/back.html\n\n";
         return 0;
      }
      string next;
      while ((next = getnext(usednames)).size())
         if (next == username) {
            cout << "Set-Cookie: usererror=" << uri_encode("This username is already taken") << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
            cout << "Location: ../../candybank/back.html\n\n";
            return 0;
         }
      fclose(usednames);

      usednames = fopen("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/.usednames", "a");
      if (usednames == 0) {
         cout << "Set-Cookie: othererror=" << uri_encode("Internal server error [6]: " + to_string(errno)) << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
         cout << "Location: ../../candybank/back.html\n\n";
         return 0;
      }
      fwrite(username.c_str(), 1, username.size()+1, usednames);
      fclose(usednames);
   }

   userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "w");
   if (userfile == 0) {
      cout << "Set-Cookie: othererror=" << uri_encode("Internal server error [7]: " + to_string(errno)) << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
      cout << "Location: ../../candybank/back.html\n\n";
      return 0;
   }

   fwrite(password.c_str(), 1, password.size()+1, userfile);
   fwrite(username.c_str(), 1, username.size()+1, userfile);
   srand(time(NULL));
   uint32_t code = 100000 + (rand() % 900000); // 100k - 999k
   fwrite(&code, sizeof(uint32_t), 1, userfile); // verification code [0 means verified]
   fclose(userfile);

   if (int err = send_mail(email, code)) {
      cout << "Set-Cookie: othererror=" << uri_encode("Sending verification code failed with error " + to_string(err)) << "; SameSite=Strict; domain=" << getenv("HTTP_HOST") << "; path=/candybank\n";
      cout << "Location: ../../candybank/back.html\n\n";
      return 0;
   }

   cout << "Location: ../../candybank/verify-account?email=" << email << "&pass=" << password << "\n\n";
   return 0;
}