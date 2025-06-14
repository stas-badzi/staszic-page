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
    sleep(4290000000u);
    exit(127);
  } else if (pid < 0) {
    exit(127);
  } else {
    int fd_stdin = open(stdin_path.c_str(), O_WRONLY);
    int fd_stderr = open(stderr_path.c_str(), O_RDONLY);
    int fd_stdout = open(stdout_path.c_str(), O_RDONLY);
    int fd_keyboard = open(keyboard_path.c_str(), O_WRONLY);
    int fd_screen = open(screen_path.c_str(), O_WRONLY);

    int returnStatus;    
    waitpid(pid, &returnStatus, 0);
    if (returnStatus == 0)
    {
       printf("The child process terminated normally.");    
    }
    if (returnStatus == 1)      
    {
       printf("The child process terminated with an error!.");    
    }

    close(fd_stdin);
    close(fd_stderr);
    close(fd_stdout);
    close(fd_keyboard);
    close(fd_screen);
    return 0;
  }

}