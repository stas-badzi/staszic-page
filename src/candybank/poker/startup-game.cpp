#include <iostream>
#include <string>
#include <cassert>
#include <fcntl.h>
#include <unistd.h>
#include <array>
#include <vector>
#include <algorithm>
#include <cstdint>
#include <queue>
#include <poll.h>
#include "hand-compare.hpp"

using namespace std;

int readblock(int __fd, void *__buf, size_t __nbytes, int __timeout = -1) {
    pollfd pfd;
    pfd.fd = __fd;
    pfd.events = POLLIN;
    int ret = poll(&pfd, 1, __timeout);
    if (ret == -1) return -1;
    else if (ret == 0) return 0;
    return read(__fd, __buf, __nbytes);
}

enum class game_action : uint8_t {
    player_join,
    player_leave,

    play_fold,
    play_call,
    play_bet,
};

enum class game_stage : uint8_t {
    none,
    pre_flop,
    flop,
    turn,
    river,
    showdown,
};

game_stage operator++(game_stage& val, int) {
   const uint8_t i = static_cast<uint8_t>(val);
   return val = static_cast<game_stage>(i + 1);
}

game_stage operator++(game_stage& val) {
   const uint8_t i = static_cast<uint8_t>(val);
   return val = static_cast<game_stage>(i + 1);
}

int main(int argc, char *argv[]) {
    assert(argc > 3);
    int gameid = atoi(argv[1]);
    int buyin_amount = atoi(argv[2]);
    int small_blind = atoi(argv[3]);

    FILE* infofd = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".info").c_str(), "w");
    assert(infofd != nullptr);
    fwrite(&buyin_amount, sizeof(int), 1, infofd);
    fwrite(&small_blind, sizeof(int), 1, infofd);
    fclose(infofd);

    int pipefd = open(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".pipe").c_str(), O_RDWR | O_NONBLOCK);
    assert(pipefd >= 0);

    string gamedata_path = "/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".dat";
    FILE* gamedata = fopen(gamedata_path.c_str(), "w");
    size_t min1 = -1;
    game_stage zero = game_stage::none;
    fwrite(&min1, sizeof(size_t), 1, gamedata); // no-player
    fwrite(&min1, sizeof(size_t), 1, gamedata); // no-player
    fwrite(&min1, sizeof(size_t), 1, gamedata); // no-player
    fwrite(&min1, sizeof(size_t), 1, gamedata); // no-player
    fwrite(&min1, sizeof(size_t), 1, gamedata); // no-player
    fwrite(&min1, sizeof(size_t), 1, gamedata); // no-player
    fwrite(&zero, sizeof(uint8_t), 1, gamedata); // none-stage
    fclose(gamedata);

    int playernum = 0;
    array<int, 6> players_candy{-1,-1,-1,-1,-1,-1}; // [0] -> empty slot
    array<string, 6> players_email{"","","","","",""}; 
    array<pair<uint8_t,uint8_t>, 6> players_cards{pair<uint8_t,uint8_t>(0,0),pair<uint8_t,uint8_t>(0,0),pair<uint8_t,uint8_t>(0,0),pair<uint8_t,uint8_t>(0,0),pair<uint8_t,uint8_t>(0,0),pair<uint8_t,uint8_t>(0,0)};
    array<int, 6> players_bets{0,0,0,0,0,0};

    game_action action;
    readblock(pipefd, &action, sizeof(game_action));
    assert(action == game_action::player_join);
    size_t player_email_len;
    readblock(pipefd, &player_email_len, sizeof(size_t));
    char* player_email = new char[player_email_len+1];
    readblock(pipefd, player_email, player_email_len);
    player_email[player_email_len] = '\0';
    players_email[0] = player_email;
    players_candy[0] = buyin_amount;
    cout << "Player " << player_email << " joined" << endl;
    delete[] player_email;

    playernum = 1;

    game_stage gamestage = game_stage::none;

    array<bool, 52> cards_used;
    srandom(time(NULL));

    int blind_player = 0, this_small_blind = -1;
    int current_bet = 0;
    int last_bet = 0;
    int thisturn = 0; // small blind always begins

    array<bool, 6> players_active;
    array<uint,6> players_maxwin;
    array<uint,6> players_allinbet;
    uint8_t active_player_num = 0;
    uint8_t nonallin_player_num = 0;
    int lastbet_player = -1;
    uint pot = 0;
    vector<uint8_t> community_cards;
    array<bool, 6> just_left = {0,0,0,0,0,0};
    bool finishedstage = false;
    int oldpot = 0;

    queue<string> player_queue;

    while (1) {
        if (gamestage == game_stage::showdown) {

            auto getscore = [community_cards](uint8_t card1, uint8_t card2) {
                hand h1(array<hand::card_t,7>{{hand::getcard(card1), hand::getcard(card2), hand::getcard(community_cards[0]), hand::getcard(community_cards[1]), hand::getcard(community_cards[2]), hand::getcard(community_cards[3]), hand::getcard(community_cards[4])}});
                return h1.score();
            };

            vector<pair<uint,uint8_t>> maxwins;
            for (int i = 0; i < 6; ++i)
                if (players_active[i])
                    maxwins.push_back({players_maxwin[i], i});
            sort(maxwins.begin(), maxwins.end());

            for (int i = 1; i < maxwins.size(); ++i)
                if (maxwins[i].first == maxwins[i-1].first) {
                    maxwins.erase(maxwins.begin()+i);
                    --i;  
                    continue;
                }
            for (int i = 0; i < maxwins.size(); ++i) {
                int win = min(pot, maxwins[i].first);
                pot -= win;
                vector<pair<uint,uint8_t>> players_win;
                if (active_player_num == 1) { // there might not be 5 community cards so getscore() will crash
                    for (int j = 0; j < 6; ++j)
                        if (players_active[j])
                            players_win.push_back({0, j});
                } else 
                    for (int j = 0; j < 6; ++j)
                        if (players_active[j] && players_maxwin[j] >= maxwins[i].first)
                            players_win.push_back({getscore(players_cards[j].first, players_cards[j].second), j});
                sort(players_win.begin(), players_win.end(),greater<pair<uint,uint8_t>>());
                int wincards = players_win.front().first;
                vector<int> winners;
                for (int j = 0; j < players_win.size(); ++j)
                    if (players_win[j].first == wincards)
                        winners.push_back(players_win[j].second);
                    else break;
                cout << "Part-Pot: " << win << " out of " << (pot+win) << " split into " << winners.size() << " players" << endl;
                int perwin = win/winners.size();
                int leftover = win - perwin*winners.size();
                for (int j = 0; j < winners.size(); ++j)
                    if (leftover > 0) {
                        players_candy[winners[j]] += perwin + 1;
                        cout << "Player " << players_email[winners[j]] << " wins " << perwin+1 << " candy" << endl;
                        leftover--;
                    } else {players_candy[winners[j]] += perwin; 
                        cout << "Player " << players_email[winners[j]] << " wins " << perwin << " candy" << endl;}
                if (pot == 0) break;
            }
            int oldpot = pot = 0;

            gamedata = fopen(gamedata_path.c_str(), "w");
            for (int i = 0; i < 6; ++i)
                if (players_candy[i] >= 0) {
                    auto strsiz = players_email[i].size();
                    fwrite(&strsiz, sizeof(size_t), 1, gamedata);
                    fwrite(players_email[i].c_str(), sizeof(char), strsiz, gamedata);
                    fwrite(&players_cards[i].first, sizeof(uint8_t), 1, gamedata);
                    fwrite(&players_cards[i].second, sizeof(uint8_t), 1, gamedata);
                    fwrite(&players_candy[i], sizeof(int), 1, gamedata);
                    fwrite(&players_bets[i], sizeof(int), 1, gamedata);
                } else fwrite(&min1, sizeof(size_t), 1, gamedata);
            fwrite(&gamestage, sizeof(game_stage), 1, gamedata);
            for (int i = 0; i < community_cards.size(); ++i)
                fwrite(&community_cards[i], sizeof(uint8_t), 1, gamedata);

            // ... print cards
            for (int i = 0; i < 6; ++i)
                if (players_candy[i] >= 0) {
                    fwrite(&players_cards[i].first, sizeof(uint8_t), 1, gamedata);
                    fwrite(&players_cards[i].second, sizeof(uint8_t), 1, gamedata);
                } else fwrite(&min1, sizeof(uint8_t), 1, gamedata);

            fclose(gamedata);

            sleep(10);
            for (int i = 0; i < 6; ++i)
                if (players_candy[i] == 0) {
                    players_candy[i] = -1; // kick players with no candy
                    cout << "Player " << players_email[i] << " run out of candy" << endl;
                }

            vector<string> dont_join;

            // check for join events and discard the rest
            while (1) {
                game_action action;
                int siz = read(pipefd, &action, sizeof(game_action));
                if (siz == -1)
                    if (errno == EAGAIN || errno == EWOULDBLOCK)
                        break;
                    else
                        return 1;

                switch (action) {
                    case game_action::player_join: {
                        size_t email_len;
                        read(pipefd, &email_len, sizeof(size_t));
                        char* email = new char[email_len+1];
                        read(pipefd, email, email_len);
                        email[email_len] = '\0';
                        player_queue.push(email);
                        delete[] email;
                        }break;
                    case game_action::player_leave: {
                        size_t email_len;
                        readblock(pipefd, &email_len, sizeof(size_t));
                        char* email = new char[email_len+1];
                        readblock(pipefd, email, email_len);
                        email[email_len] = '\0';
                        for (int i = 0; i < 6; ++i)
                            if (players_email[i] == email) {
                                just_left[i] = true;
                                break;
                            }
                        dont_join.push_back(email);
                        delete[] email;
                        }break;
                    default:
                        break;
                }
            }

            // leave queue
            for (int i = 0; i < 6; ++i)
                if (just_left[i]) {
                    just_left[i] = false;
                    if (players_candy[i] == -1) continue;
                    // add candy to bank account
                    // ...
                    players_candy[i] = -1; // make slot empty
                    cout << "Player " << players_email[i] << " left the game" << endl;
                }
            
            // join queue
            while (!player_queue.empty()) {
                string email = player_queue.front();
                player_queue.pop();
                if (find(dont_join.begin(), dont_join.end(), email) != dont_join.end())
                    continue;
                char joined = false;
                for (int i = 0; i < 6; ++i)
                    if (players_email[i] == email)
                        joined = -1;
                    else if (!joined && players_candy[i] == -1)
                        joined = i+1;
                if (!joined)
                    cout << "No player slots available for " << email << endl;
                else if (joined > 0) {
                    players_email[joined-1] = email;
                    players_candy[joined-1] = buyin_amount;
                    cout << "Player " << email << " joined" << endl;
                } else cout << "Player already joined (" << email << ")" << endl;
            }

            community_cards.clear();
            gamestage = game_stage::none;
            cout << endl;
            cout << endl;
            cout << endl;
        } else if (gamestage > game_stage::none) {
            gamedata = fopen(gamedata_path.c_str(), "r+");
            for (int i = 0; i < 6; ++i)
                if (players_candy[i] >= 0) {
                    auto strsiz = players_email[i].size();
                    fwrite(&strsiz, sizeof(size_t), 1, gamedata);
                    fwrite(players_email[i].c_str(), sizeof(char), strsiz, gamedata);
                    fwrite(&players_cards[i].first, sizeof(uint8_t), 1, gamedata);
                    fwrite(&players_cards[i].second, sizeof(uint8_t), 1, gamedata);
                    fwrite(&players_candy[i], sizeof(int), 1, gamedata);
                    fwrite(&players_bets[i], sizeof(int), 1, gamedata);
                } else fwrite(&min1, sizeof(size_t), 1, gamedata);
            fwrite(&gamestage, sizeof(game_stage), 1, gamedata);
            fwrite(&thisturn, sizeof(int), 1, gamedata);
            fwrite(&pot, sizeof(int), 1, gamedata);
            for (int i = 0; i < community_cards.size(); ++i)
                fwrite(&community_cards[i], sizeof(uint8_t), 1, gamedata);

            fclose(gamedata);

            cout << players_email[thisturn] << ": " << flush;

        actionagain:
            game_action action;
            if ((nonallin_player_num > 1 || (!finishedstage && players_bets[thisturn] != current_bet)) && nonallin_player_num > 0 && !just_left[thisturn] && active_player_num > 1)
                int siz = readblock(pipefd, &action, sizeof(game_action));
            else if (just_left[thisturn]) action = game_action::play_fold;
            else action = game_action::play_call;
            switch (action) {
                case game_action::player_join:
                   {size_t email_len;
                    readblock(pipefd, &email_len, sizeof(size_t));
                    char* email = new char[email_len+1];
                    readblock(pipefd, email, email_len);
                    email[email_len] = '\0';
                    player_queue.push(email);
                    delete[] email;
                    goto actionagain;}
                case game_action::player_leave:
                   {size_t email_len;
                    readblock(pipefd, &email_len, sizeof(size_t));
                    char* email = new char[email_len+1];
                    readblock(pipefd, email, email_len);
                    email[email_len] = '\0';
                    for (int i = 0; i < 6; ++i)
                        if (players_email[i] == email) {
                            just_left[i] = true;
                            break;
                        }
                    delete[] email;
                    goto actionagain;}
                case game_action::play_fold:
                    cout << "Fold" << endl;
                    players_active[thisturn] = false;
                    --active_player_num;
                    --nonallin_player_num;
                    if (active_player_num <= 1) {
                        gamestage = game_stage::showdown;
                        continue;
                    }
                    break;
                case game_action::play_call:
                    {int call_amount = min(players_candy[thisturn], current_bet - players_bets[thisturn]);
                    cout << "Call " << call_amount << endl;
                    players_candy[thisturn] -= call_amount;
                    players_bets[thisturn] += call_amount;
                    pot += call_amount;
                    if (players_candy[thisturn] == 0 && call_amount > 0) --nonallin_player_num;}
                    break;
                case game_action::play_bet:
                    {int bet_amount = 0;
                    int siz = readblock(pipefd, &bet_amount, sizeof(int));
                    assert(siz == sizeof(int));
                    if (bet_amount < last_bet)
                        bet_amount = last_bet;
                    if (bet_amount > players_candy[thisturn] + players_bets[thisturn] - current_bet)
                        bet_amount = players_candy[thisturn] + players_bets[thisturn] - current_bet;
                    if (bet_amount > last_bet)
                        last_bet = bet_amount;

                    cout << "Bet " << bet_amount << '(' << (bet_amount + current_bet - players_bets[thisturn]) << ')' << endl;
                    players_candy[thisturn] -= bet_amount + current_bet - players_bets[thisturn];
                    pot += bet_amount + current_bet - players_bets[thisturn];
                    players_bets[thisturn] += bet_amount + current_bet - players_bets[thisturn];;
                    
                    if (bet_amount > 0) {
                        current_bet += bet_amount;
                        lastbet_player = thisturn;
                    }
                    
                    if (players_candy[thisturn] == 0) --nonallin_player_num;}
                    break;

                default:
                    exit(1);
            }
            if (lastbet_player == -1)
                lastbet_player = thisturn;
        nextplayer:
            thisturn = (thisturn + 1) % 6;
            while (players_active[thisturn] == false)
                thisturn = (thisturn + 1) % 6;
            if (thisturn == lastbet_player || (nonallin_player_num <= 1 && finishedstage)) {
                ++gamestage;
                thisturn = this_small_blind;
                for (int i = 0; i < 6; ++i)
                    if (players_active[i] && players_candy[i] == 0 && players_bets[i] > 0) {
                        players_maxwin[i] = oldpot;
                        for (int j = 0; j < 6; ++j)
                            if (players_active[j])
                                players_maxwin[i] += min(players_bets[i], players_bets[j]);
                    }

                oldpot = pot;
                if (nonallin_player_num <= 1) {finishedstage = true; goto dontsetplayer;}
                while (players_active[thisturn] == false || players_candy[thisturn] == 0)
                    thisturn = (thisturn + 1) % 6;
            dontsetplayer:
                lastbet_player = -1;
                for (int i = 0; i < 6; ++i)
                    players_bets[i] = 0;
                last_bet = small_blind*2;
                current_bet = 0;
                if (gamestage != game_stage::showdown) { // showdown no new cards else >= +1 cards
                    uint8_t community_card = random() % 52;
                    while (cards_used[community_card])
                        community_card = random() % 52;
                    cards_used[community_card] = true;
                    cout << "\nCommunity card: " << hand::getcardstring(community_card);
                    community_cards.push_back(community_card);
                    if (gamestage == game_stage::flop) { // flop +3->+1+2 cards
                        community_card = random() % 52;
                        while (cards_used[community_card])
                            community_card = random() % 52;
                        cards_used[community_card] = true;
                        community_cards.push_back(community_card);
                        cout << hand::getcardstring(community_card);

                        community_card = random() % 52;
                        while (cards_used[community_card])
                            community_card = random() % 52;
                        cards_used[community_card] = true;
                        community_cards.push_back(community_card);
                        cout << hand::getcardstring(community_card);
                    }
                    cout << endl;
                }

            } else if (players_candy[thisturn] == 0) goto nextplayer;

        } else {
            for (int i = 0; i < 52; ++i)
                cards_used[i] = false;
            active_player_num = finishedstage = false;
            for (int i = 0; i < 6; ++i)
                if (players_candy[i] >= 0)
                    players_bets[i] = 1+(players_maxwin[i] = -(uint)(players_active[i] = ++active_player_num));
                else
                    players_active[i] = false;
            nonallin_player_num = active_player_num;
            if (active_player_num == 0) break;

            for (int i = 0; i < 6; ++i)
                if (players_candy[i] >= 0) {
                    int card1 = random() % 52;
                    while (cards_used[card1])
                        card1 = random() % 52;
                    cards_used[card1] = true;
                    int card2 = random() % 52;
                    while (cards_used[card2])
                        card2 = random() % 52;
                    cards_used[card2] = true;
                    players_cards[i].first = card1;
                    players_cards[i].second = card2;
                    std::cout << "Player " << players_email[i] << " got cards: " << hand::getcardstring(card1) << hand::getcardstring(card2) << "\n";
                }

            if (active_player_num > 1) {

                while(players_candy[blind_player] < 0)
                    blind_player = (blind_player + 1) % 6;
                
                players_bets[this_small_blind = blind_player] = min(small_blind, players_candy[this_small_blind]);
                cout << players_email[this_small_blind] << ": Small blind " << players_bets[this_small_blind] << endl;
                pot += players_bets[this_small_blind];
                players_candy[this_small_blind] -= players_bets[this_small_blind];
                if (players_candy[this_small_blind] == 0) --nonallin_player_num;

                thisturn = blind_player = (blind_player + 1) % 6;
                while (players_candy[thisturn] < 0)
                    thisturn = (thisturn + 1) % 6;
                
                players_bets[thisturn] = min(2*small_blind, players_candy[thisturn]);
                cout << players_email[thisturn] << ": Big blind " << players_bets[thisturn] << endl;
                players_candy[thisturn] -= players_bets[thisturn];
                pot += players_bets[thisturn];
                if (players_candy[thisturn] == 0 && players_bets[thisturn] > 0) --nonallin_player_num; // if he bet 0 that means he was already all-in
                current_bet = max(players_bets[thisturn], players_bets[this_small_blind]);
            } else {
                this_small_blind = blind_player;
                while (players_candy[this_small_blind] < 0)
                    this_small_blind = (this_small_blind + 1) % 6;
            }

            thisturn = (thisturn + 1) % 6;
            while (players_candy[thisturn] < 0)
                thisturn = (thisturn + 1) % 6;

            gamestage = game_stage::pre_flop;
            last_bet = small_blind*2;
            lastbet_player = -1;
        }
    }
    cout << "All players left" << endl;

    close(pipefd);

    unlink(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".info").c_str());
    unlink(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".pipe").c_str());
    unlink(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".dat").c_str());
    return 0;
}