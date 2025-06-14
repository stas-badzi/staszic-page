#include <iostream>
#include <string>
#include <vector>
#include <unistd.h>
#include <spawn.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <sys/wait.h>
#include <time.h>
using namespace std;

int main(int argc, char **argv)
{
  sleep(5);
  char* curdir = (char*)malloc(1024);
  getcwd(curdir, 1024);
  string current_path = string(curdir);
  free(curdir);

  string stdin_path = current_path + "/stdin";
  string stderr_path = current_path + "/stderr";
  string stdout_path = current_path + "/stdout";
  string keyboard_path = current_path + "/keyboard";
  string screen_path = current_path + "/screen";
  string timeout_path = current_path + "/timeout";

  // input
  int res = mkfifo(stdin_path.c_str(), 0600);
  if (res < 0) return errno;
  res = mkfifo(keyboard_path.c_str(), 0600);
  if (res < 0) return errno;
  res = mkfifo(screen_path.c_str(), 0600);
  if (res < 0) return errno;

  // output
  res = mkfifo(stderr_path.c_str(), 0600);
  if (res < 0) return errno;
  res = mkfifo(stdout_path.c_str(), 0600); // not really used
  if (res < 0) return errno;

  // timeout
  res = open(timeout_path.c_str(), O_CREAT, 0600);
  if (res < 0) return errno;
  close(res);

  chdir("/home/k24_a/stasbadzi/.homepage/internal/localdata");
  pid_t pid = fork();
  if (pid == 0) {
    const char **args = (const char**)calloc(argc+4,sizeof(const char*));
    args[0] = "cpp-factoryrush";
    args[1] = "-c";
    args[2] = keyboard_path.c_str();
    args[3] = screen_path.c_str();
    for (int i = 1; i < argc; i++) args[i+3] = argv[i];
    args[argc+3] = NULL;
    int fd = open(stdin_path.c_str(), O_RDONLY);
    dup2(fd, STDIN_FILENO);
    close(fd);
    fd = open(stderr_path.c_str(), O_WRONLY);
    dup2(fd, STDERR_FILENO);
    close(fd);
    fd = open(stdout_path.c_str(), O_WRONLY);
    dup2(fd, STDOUT_FILENO);
    close(fd);
    char *envp[] =
    {
        "LANG=pl_PL.UTF-8","LANGUAGE=","LC_CTYPE=pl_PL.UTF-8","LC_NUMERIC=pl_PL.UTF-8","LC_TIME=pl_PL.UTF-8","LC_COLLATE=pl_PL.UTF-8","LC_MONETARY=pl_PL.UTF-8","LC_MESSAGES=pl_PL.UTF-8","LC_PAPER=pl_PL.UTF-8","LC_NAME=pl_PL.UTF-8","LC_ADDRESS=pl_PL.UTF-8","LC_TELEPHONE=pl_PL.UTF-8","LC_MEASUREMENT=pl_PL.UTF-8","LC_IDENTIFICATION=pl_PL.UTF-8","LC_ALL=","HOME=/home/k24_a/stasbadzi","LD_LIBRARY_PATH=/home/k24_a/stasbadzi/.local/lib",
        "PATH=/bin:/usr/bin",
        "USER=stasbadzi",
        0
    };
    execve("/home/k24_a/stasbadzi/.local/bin/cpp-factoryrush.bin", (char*const*)args, envp);
    exit(127);
  } else if (pid < 0) {
    exit(127);
  } else {

    pid_t pid2 = fork();
    if (pid2 == 0) {
      struct stat st;
      while (stat(timeout_path.c_str(), &st) != -1) { // file deleted == game dead -> we exits
        time_t t = st.st_mtime;
        time_t now = time(NULL);
        if (now - t > 10)
          break;
        sleep(1);
      }
      kill(pid, SIGQUIT);
      exit(0);
    } else if (pid2 < 0) exit(127);

    int fd_timeout = open(timeout_path.c_str(), O_WRONLY); // so pid2 can open it
    int fd_stdin = open(stdin_path.c_str(), O_WRONLY);
    int fd_stderr = open(stderr_path.c_str(), O_RDONLY);
    int fd_stdout = open(stdout_path.c_str(), O_RDONLY);
    int fd_keyboard = open(keyboard_path.c_str(), O_WRONLY);
    int fd_screen = open(screen_path.c_str(), O_WRONLY);

    int returnStatus;
    waitpid(pid, &returnStatus, 0);

    close(fd_stdin);
    close(fd_stderr);
    close(fd_stdout);
    close(fd_keyboard);
    close(fd_screen);

    // too lazy to add error handling
    unlink(stdin_path.c_str());
    unlink(keyboard_path.c_str());
    unlink(screen_path.c_str());
    unlink(stderr_path.c_str());
    unlink(stdout_path.c_str());
    unlink(timeout_path.c_str());
    if (rmdir(current_path.c_str()) < 0) {
      sleep(1);
      rmdir(current_path.c_str());
    }

    waitpid(pid2, &returnStatus, 0);
    return 0;
  }

}