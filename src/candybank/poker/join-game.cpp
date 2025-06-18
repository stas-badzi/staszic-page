#include <iostream>
#include <string>
#include <cassert>
#include <fcntl.h>
#include <unistd.h>
#include <cstdint>
#include "../account-handle.hpp"

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
    if (candybank::query.find("gameid") == candybank::query.end()) {
        cout << "Content-type: text/plain\n\nNo game id specified" << flush;
        return 0;
    } else gameid = stoi(candybank::query["gameid"]);

    int pipefd = open(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".pipe").c_str(), O_WRONLY);
    assert(pipefd >= 0);

    size_t email_len = acc.email.size();
    auto action = game_action::player_join;
    write(pipefd, &action, sizeof(game_action));
    write(pipefd, &email_len, sizeof(size_t));
    write(pipefd, acc.email.c_str(), email_len);
    close(pipefd);
    cout << "Content-type: text/plain\n\nJoin request sent" << flush;
    return 0;
}
