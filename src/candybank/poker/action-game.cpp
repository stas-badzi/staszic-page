#include <iostream>
#include <string>
#include <cassert>
#include <fcntl.h>
#include <unistd.h>

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
    int gameid = atoi(argv[1]);
    int pipefd = open(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".pipe").c_str(), O_WRONLY);
    assert(pipefd >= 0);
    game_action action;
    switch (argv[2][0]) {
    case 'f':
        action = game_action::play_fold;
        write(pipefd, &action, sizeof(game_action));
        return 0;
    case 'c':
        action = game_action::play_call;
        write(pipefd, &action, sizeof(game_action));
        return 0;
    case 'b':
        assert(argc > 3);
        action = game_action::play_bet;
        {int bet = atoi(argv[3]);
        write(pipefd, &action, sizeof(game_action));
        write(pipefd, &bet, sizeof(int));
        return 0;}
    }
    return 1;
}
