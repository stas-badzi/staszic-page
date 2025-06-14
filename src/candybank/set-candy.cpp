#include <iostream>
#include <cassert>
#include <string>
#include <unistd.h>
#include "../urihandle.hpp"

using namespace std;

// not cgi-script, so we use arg[c,v]

int main(int argc, char *argv[]) {
    assert(argc > 1);
    string email = argv[1];
    uint32_t money = (argc > 2) ? atoi(argv[2]) : 0;

    FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "r");
    if (userfile == 0) {
        if (errno == ENOENT){
            cout << "Account not found\n";
            return 0;
        }
        cout << "Internal server error " << errno << '\n';
        return 0;
    }
    size_t candy_offset = getnext(userfile).size() + getnext(userfile).size() + 6; // password + '\0' + username + '\0' + sizeof(uint32_t)

    uint32_t code;
    fread(&code, sizeof(uint32_t), 1, userfile);
    if (code > 1) { // 0 - verified, 1 - admin
        cout << "Account not verified\n";
        fclose(userfile);
        return 0;
    }
    fread(&code, sizeof(uint32_t), 1, userfile); // money
    fclose(userfile);

    userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email).c_str(), "r+");
    if (userfile == 0) {
        cout << "Internal server error " << errno << '\n';
        return 0;
    }

    fseek(userfile, candy_offset, SEEK_SET);
    fwrite(&money, sizeof(uint32_t), 1, userfile);
    fclose(userfile);
    
    return 0;
}