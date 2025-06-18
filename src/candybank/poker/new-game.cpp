#include <iostream>
#include <string>
#include <algorithm>
#include <vector>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include "../../urihandle.hpp"

using namespace std;

int startupgame(int buyin_amount, int small_blind) {
    FILE* userfile = fopen("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/.nextgame", "r");
    if (userfile == 0)
        return -1;
    int gameid = 0;
    fscanf(userfile, "%d", &gameid);
    fclose(userfile);
    userfile = fopen("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/.nextgame", "w");
    if (userfile == 0)
        return -1;
    fprintf(userfile, "%d", gameid+1);
    fclose(userfile);

    userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".dat").c_str(), "w");
    if (userfile == 0)
        return -1;
    fchmod(fileno(userfile), 0600);
    fclose(userfile);

    userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".info").c_str(), "w");
    if (userfile == 0)
        return -1;
    fchmod(fileno(userfile), 0600);
    fwrite(&buyin_amount, sizeof(int), 1, userfile);
    fwrite(&small_blind, sizeof(int), 1, userfile);
    fclose(userfile);


    userfile = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".log").c_str(), "w");
    if (userfile == 0)
        return -1;
    fchmod(fileno(userfile), 0600);
    fclose(userfile);

    mkfifo(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".pipe").c_str(), 0600);
    
    //exec ...
    pid_t pid = fork();
    if (pid == 0) {
        int fd = open("/dev/null", O_RDONLY);
        dup2(fd, STDIN_FILENO);
        close(fd);
        fd = open("/dev/null", O_WRONLY);
        dup2(fd, STDERR_FILENO);
        close(fd);
        fd = open(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".log").c_str(), O_WRONLY);
        dup2(fd, STDOUT_FILENO);
        close(fd);

        string gamestr = to_string(gameid), buystr = to_string(buyin_amount), smallstr = to_string(small_blind);
        const char **args2 = (const char**)calloc(5,sizeof(const char*));
        args2[0] = "startup-game.bin";
        args2[1] = gamestr.c_str();
        args2[2] = buystr.c_str();
        args2[3] = smallstr.c_str();
        pid_t cpid = fork();
        if (cpid == 0) {
        execv("/home/k24_a/stasbadzi/.homepage/bin/candybank/poker/startup-game.bin", (char*const*)args2);
        exit(127);
        } else if (cpid < 0) {
            exit(127);
        } else {
            exit(0);
        }
    } else if (pid < 0) {
        return -1;
    } else {
        int status;
        waitpid(pid, &status, 0);
        if (status != 0) return -1;
    }
    while (1) {
        FILE* infofl = fopen(("/home/k24_a/stasbadzi/.homepage/candybank/storage/poker/games/" + to_string(gameid) + ".info").c_str(), "r");
        if (infofl) {
            fclose(infofl);
            break;
        } else if (errno == ENOENT) usleep(10);
        else return -1;
    }
    return gameid;
}

int main() {
    setlocale(LC_ALL,"UTF-8");
    auto query_cstr = getenv("QUERY_STRING");
    if (query_cstr == nullptr) return 0;
    string query(query_cstr);
    if (query.empty()) return 0;
    vector<string> params = split(query, '&');
    int buyin_amount = 0, small_blind = 0;

    for (auto& param : params) {
        vector<string> key_value = split(param, '=');
        pair<string, string> key_value_pair(key_value[0], searchparam_decode(key_value[1]));
        if (key_value_pair.first == "buyin")
            buyin_amount = stoi(key_value_pair.second);
        else if (key_value_pair.first == "blind")
            small_blind = stoi(key_value_pair.second);
    }

    if (buyin_amount <= small_blind) return 0;

    int gameid = startupgame(buyin_amount, small_blind);
    if (gameid < 0) return 1;
    cout << "Location: ../../../candybank/poker-lobby/game?gameid=" << gameid << "\n\n";
    return 0;
}