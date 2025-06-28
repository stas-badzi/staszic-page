#include <iostream>
#include <string>
#include <cassert>
#include <fcntl.h>
#include <unistd.h>
#include <cstdint>
#include "../account-handle.hpp"

enum class game_stage : uint8_t {
    none,
    pre_flop,
    flop,
    turn,
    river,
    showdown,
};

enum class game_action : uint8_t {
    player_join,
    player_leave,

    play_fold,
    play_call,
    play_bet,
};

using namespace std;

int main() {
    auto acc = candybank::get_account();
    int gameid = -1;
    int bet = -2;
    if (candybank::query.find("gameid") == candybank::query.end()) {
        cout << "Content-type: text/plain\n\nNo game id specified" << flush;
        return 0;
    } else if (candybank::query.find("bet") == candybank::query.end()) {
        cout << "Content-type: text/plain\n\nNo bet specified" << flush;
        return 0;
    } else {
        gameid = stoi(candybank::query["gameid"]);
        bet = stoi(candybank::query["bet"]);
    }

    FILE* userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".info").c_str(), "r");
    if (userfile == 0) {
        cout << "Content-type: text/plain\n\nGame not found" << flush;
        return 0;
    }
    fclose(userfile);

    userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".dat").c_str(), "r");
    if (userfile == 0) {
        cout << "Content-type: text/plain\n\nGame data file not found" << flush;
        return 0;
    }
    int our_playerid = -1;
    for (int i=0; i<6; ++i) {
        size_t email_len;
        fread(&email_len, sizeof(size_t), 1, userfile);
        if (email_len == (size_t)-1) continue;
        char* email = new char[email_len+1];
        fread(email, sizeof(char), email_len, userfile);
        email[email_len] = '\0';
        if (acc.email == email)
            our_playerid = i;
        delete[] email;

        void* discard = malloc(sizeof(uint8_t)*2+sizeof(int)*2); // 2 cards + money + betted
        fread(discard, sizeof(uint8_t)*2+sizeof(int)*2, 1, userfile);
        free(discard);

        bool isactive;
        fread(&isactive, sizeof(bool), 1, userfile);
        if (!isactive && our_playerid == i) {
            cout << "Content-type: text/plain\n\nYou have already folded" << flush;
            return 0;
        }
    }
    if (our_playerid == -1) {
        cout << "Content-type: text/plain\n\nYou are not in this game" << flush;
        return 0;
    }

    game_stage thisstage;
    fread(&thisstage, sizeof(game_stage), 1, userfile);
    if (thisstage == game_stage::showdown || thisstage == game_stage::none) {
        cout << "Content-type: text/plain\n\nYou cannot act during the showdown" << flush;
        return 0;
    }
    int plid = -1;
    fread(&plid, sizeof(int), 1, userfile);
    if (plid != our_playerid) {
        cout << "Content-type: text/plain\n\nIt's not your turn" << flush;
        return 0;
    }
    fclose(userfile);

    int pipefd = open(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".pipe").c_str(), O_WRONLY);
    assert(pipefd >= 0);
    game_action action;
    switch (bet) {
    case -1:
        action = game_action::play_fold;
        cout << "Content-type: text/plain\n\nFold" << flush;
        write(pipefd, &action, sizeof(game_action));
        break;
    case 0:
        action = game_action::play_call;
        write(pipefd, &action, sizeof(game_action));
        cout << "Content-type: text/plain\n\nCall" << flush;
        break;
    default:
        action = game_action::play_bet;
        write(pipefd, &action, sizeof(game_action));
        write(pipefd, &bet, sizeof(int));
        cout << "Content-type: text/plain\n\nBet " << bet << flush;
        break;
    }
    close(pipefd);
    return 0;
}