#include <iostream>
#include <string>
#include <cassert>
#include <fcntl.h>
#include <unistd.h>
#include <cstdint>

enum class game_action : uint8_t {
    player_join,
    player_leave,

    play_fold,
    play_call,
    play_bet,
};

using namespace std;

int main(int argc, char *argv[]) {
    assert(argc > 2);
    string email = argv[2];
    int gameid = atoi(argv[1]);

    int pipefd = open(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".pipe").c_str(), O_WRONLY);
    assert(pipefd >= 0);

    size_t email_len = email.size();
    auto action = game_action::player_leave;
    write(pipefd, &action, sizeof(game_action));
    write(pipefd, &email_len, sizeof(size_t));
    write(pipefd, email.c_str(), email_len);
    return 0;
}
