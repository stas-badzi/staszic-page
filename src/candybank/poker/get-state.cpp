#include <iostream>
#include <string>
#include <cassert>
#include <fcntl.h>
#include <unistd.h>
#include <cstdint>
#include <deque>
#include <optional>
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

struct player {
    std::string username;
    int money;
    int bet;
    bool active;
    std::pair<uint8_t, uint8_t> cards;
};

using namespace std;

int main() {
    auto acc = candybank::get_account();
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
    fclose(userfile);

    userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".dat").c_str(), "r");
    if (userfile == 0) {
        cout << "Content-type: text/plain\n\nGame data file not found" << flush;
        return 0;
    }
    
    deque<optional<player>> players;
    int our_playerid = -1;
    for (int i=0; i<6; ++i) {
        size_t email_len;
        fread(&email_len, sizeof(size_t), 1, userfile);
        if (email_len == (size_t)-1) {
            players.push_back(nullopt);
            continue;
        }
        char* email = new char[email_len+1];
        fread(email, sizeof(char), email_len, userfile);
        email[email_len] = '\0';
        if (acc.email == email)
            our_playerid = i;
        string email_str(email);
        delete[] email;

        player thisplayer;
        FILE* playerfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/accounts/" + email_str).c_str(), "r");
        if (playerfile == nullptr) {
            cout << "Content-type: text/plain\n\nError reading player file" << flush;
            return 0;
        }
        getnext(playerfile); // skip password
        thisplayer.username = getnext(playerfile);

        fread(&thisplayer.cards.first, sizeof(uint8_t), 1, userfile);
        fread(&thisplayer.cards.second, sizeof(uint8_t), 1, userfile);
        fread(&thisplayer.money, sizeof(int), 1, userfile);
        fread(&thisplayer.bet, sizeof(int), 1, userfile);
        fread(&thisplayer.active, sizeof(bool), 1, userfile);

        players.push_back(thisplayer);
    }
    if (our_playerid >= 0) {
        for (int i=0; i<our_playerid; ++i){
            auto front = players.front();
            players.pop_front();
            players.push_back(front);
        }
    }

    game_stage thisstage;
    fread(&thisstage, sizeof(game_stage), 1, userfile);
    int pot = -1;
    int thisplayer = -1;
    vector<uint8_t> community_cards;
    if (thisstage != game_stage::none) {
        size_t comcardnum;
        if (thisstage != game_stage::showdown) {
            for (int i=(our_playerid >= 0); i<6; ++i) // hide other players' cards
                if (players[i].has_value())
                    players[i]->cards.first = players[i]->cards.second = -1;
            fread(&thisplayer, sizeof(int), 1, userfile);
            thisplayer = (thisplayer - our_playerid) % 6;
            fread(&pot, sizeof(int), 1, userfile);
            comcardnum = 3*(thisstage >= game_stage::flop) + (thisstage >= game_stage::turn) + (thisstage >= game_stage::river);
        } else fread(&comcardnum, sizeof(size_t), 1, userfile);
        for (int i=0; i<comcardnum; ++i) {
            uint8_t card; fread(&card, sizeof(uint8_t), 1, userfile);
            community_cards.push_back(card);
        }
    }
    fclose(userfile);

    cout << "Content-type: application/json\n\n";
    cout << "{\"players\":[";
    for (int i=0; i<6; ++i) {
        if (players[i].has_value()) {
            cout << "{\"username\":\"" << players[i]->username << "\",\"money\":" << players[i]->money << ",\"bet\":" << players[i]->bet << ",\"active\":" << players[i]->active << ",\"cards\":[";
            if (players[i]->cards.first != (uint8_t)-1) cout << (uint)players[i]->cards.first;
            else cout << "null";
            cout << ',';
            if (players[i]->cards.second != (uint8_t)-1) cout << (uint)players[i]->cards.second;
            else cout << "null";
            cout << "]}";
        } else cout << "null";
        if (i < 5) cout << ',';
    }
    cout << "],\"community_cards\":[";
    for (int i=0; i<5; ++i) {
        if (i < community_cards.size()) cout << (uint)community_cards[i];
        else cout << "null";
        if (i < 4) cout << ',';
    }
    cout << "],\"pot\":";
    if (pot > 0) cout << pot;
    else cout << "null";
    cout << ",\"active_player\":";
    if (thisplayer >= 0) cout << thisplayer;
    else cout << "null";
    cout << "}";
    return 0;
}