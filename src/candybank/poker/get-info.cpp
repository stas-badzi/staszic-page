#include <iostream>
#include <string>
#include <cassert>
#include <fcntl.h>
#include <unistd.h>
#include <cstdint>
#include <deque>
#include <optional>
#include "../account-handle.hpp"

using namespace std;

int main() {
    candybank::get_account(); // throw if not logged in
    int gameid = -1;
    int bet = -2;
    if (candybank::query.find("gameid") == candybank::query.end()) {
        cout << "Content-type: text/plain\n\nNo game id specified" << flush;
        return 0;
    } else gameid = stoi(candybank::query["gameid"]);

    FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".info").c_str(), "r");
    if (userfile == 0) {
        cout << "Content-type: text/plain\n\nGame not found" << flush;
        return 0;
    }
    int buyin, smallblind;
    fread(&buyin,sizeof(int),1,userfile);
    fread(&smallblind,sizeof(int),1,userfile);
    fclose(userfile);
    cout << "Content-type: application/json\n\n"
    "{\"buyin\":" << buyin << ",\"blind\":" << smallblind << "}";
    return 0;
}
