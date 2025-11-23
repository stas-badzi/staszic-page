#include <stdio.h>
#include <sys/stat.h>
#include <string>
#include <unistd.h>
#include <spawn.h>
#include <stdlib.h>
#include <string.h>
#include <vector>
#include <sys/wait.h>
#include <fcntl.h>
#include "urihandle.hpp"
#include "security.h"
using namespace std;

bool startup_game(vector<string>& args, string path) {
  int res = chdir(path.c_str());
  if (res < 0) return false;
  pid_t pid = fork();
  if (pid == 0) {
    int fd = open("/dev/null", O_RDONLY);
    dup2(fd, STDIN_FILENO);
    close(fd);
    fd = open("/dev/null", O_WRONLY);
    dup2(fd, STDOUT_FILENO);
    dup2(fd, STDERR_FILENO);
    close(fd);

    const char **args2 = (const char**)calloc(args.size()+2,sizeof(const char*));
    args2[0] = "startup-game.bin";
    for (int i = 0; i < args.size(); i++) args2[i+1] = args[i].c_str();
    args2[args.size()+1] = NULL;
    pid_t cpid = fork();
    if (cpid == 0) {
      execv("/home/k24_a/stasbadzi/.homepage/bin/startup-game.bin", (char*const*)args2);
      exit(127);
    } else if (cpid < 0) {
      exit(127);
    } else {
      exit(0);
    }
  } else if (pid < 0) {
    return false;
  } else {
    int status;
    waitpid(pid, &status, 0);
    return status == 0;
  }
}

int newpid(vector<string>& args)
{
  FILE *f;
  unsigned long i = 0;

  f=fopen("/home/k24_a/stasbadzi/.homepage/internal/npid.dat", "r+w");
  if (!f)
  {
     sleep(1);
     f=fopen("/home/k24_a/stasbadzi/.homepage/internal/npid.dat", "r+w");
     if (!f)
       return -1;
  }

  fscanf(f, "%d", &i);
  struct stat sb;
nextpid:
  i++;
  string path = "/home/k24_a/stasbadzi/.homepage/internal/" + to_string(i);
  if (stat(path.c_str(), &sb) != -1)
     goto nextpid;
  fseek(f,0,SEEK_SET);
  fprintf(f, "%d", i);
  fclose(f);

  path = "/home/k24_a/stasbadzi/.homepage/internal/" + to_string(--i); 
  mkdir(path.c_str(),0700);

  link("/home/k24_a/stasbadzi/.homepage/cgi-bin/update-game.cgi",("/home/k24_a/stasbadzi/.homepage/cgi-bin/update-game/"+to_string(i)+".cgi").c_str());
  if (startup_game(args, path)) return i;
  rmdir(path.c_str());
  return -1;
}

char * getargs() {
  char* cookies = getenv("HTTP_COOKIE");
  if (!cookies) return NULL;
  int i = 0, j = 0;
  char *args = (char*)malloc(strlen(cookies) + 1);
  while (cookies[i] != '\0') {
    if (cookies[i] == ';') {
      if (j >= 5 &&
        args[0] == 'a' &&
        args[1] == 'r' &&
        args[2] == 'g' &&
        args[3] == 's' &&
        args[4] == '='
      ) break;
      j = 0;
    }
    else if (j != 0 || cookies[i] != ' ') {
      args[j] = cookies[i];
      j++;
    }
    i++;
  }
  if (!cookies[i] && !(j >= 5 &&
    args[0] == 'a' &&
    args[1] == 'r' &&
    args[2] == 'g' &&
    args[3] == 's' &&
    args[4] == '='
  )) {
    free(args);
    return NULL;
  }
  args[j] = '\0';
  return args+5;
}

vector<string> parseJSONarray(string json) {
  vector<string> result;
  int i = 0, search = 0;
  while (i < json.length()) {
    int j = json.find(',', search);
    if (j == -1) j = json.length();
    if (j > 0 && json[j-1] == '\\') {search = j+1; continue;}
    result.push_back(json.substr(i, j-i));
    int quotes = 0;
    if (result.back().front() == '[') result.back().erase(0, 1);
    if (result.back().front() == '"') {result.back().erase(0, 1); ++quotes;}
    if (result.back().back() == ']') result.back().pop_back();
    if (result.back().back() == '"') {result.back().pop_back(); ++quotes;}
    if (quotes < 2) return vector<string>();
    search = i = j+1;
  }
  return result;
}

int main(int argc, char **argv, char **envp)
{
  char *args = getargs();
  setlocale(LC_ALL, "UTF-8");
  auto argsv = (args) ? parseJSONarray(uri_decode(args)) : vector<string>();
  if (args) free(args-5);
  DefaultAccessControl();
  printf("Set-Cookie: args=; SameSite=Strict; domain=%s; path=%s\r\n", getenv("HTTP_HOST"),"/");
  printf("Content-type: text/html\n\n%d", newpid(argsv));
  return 0;
}
