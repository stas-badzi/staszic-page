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
#include <sys/ioctl.h>
#include <wchar.h>
#include <assert.h>
#include "urihandle.hpp"
using namespace std;

bool strbegwith(const char* str, const char* beg, const char* beg2 = NULL) {
  int i,j;
  for (i=0; str[i] && beg[i]; ++i)
    if (str[i] != beg[i]) break;
  if (beg[i]) return false;
  if (!beg2) return true;
  for (j=0; str[i+j] && beg2[j]; ++j)
    if (str[i+j] != beg2[j]) break;
  if (beg2[j]) return false;
  return true;
}

bool dodie(const char* id) {
  char* cookies = getenv("HTTP_COOKIE");
  if (!cookies) return false;
  int i = 0, j = 0;
  char *args = (char*)malloc(strlen(cookies) + 1);
  while (cookies[i] != '\0') {
    if (cookies[i] == ';') {
      if (args[j]='\0',strbegwith(args,"die",id)) break;
      j = 0;
    }
    else if (j != 0 || cookies[i] != ' ') {
      args[j] = cookies[i];
      j++;
    }
    i++;
  }
  args[j] = '\0';
  if (!cookies[i] && !strbegwith(args,"die",id)) {
    free(args);
    return false;
  }
  bool ret = args[j-1] == '1';
  free(args);
  return ret;
}

char * getstdin(const char* id) {
  char* cookies = getenv("HTTP_COOKIE");
  if (!cookies) return NULL;
  int i = 0, j = 0;
  char *args = (char*)malloc(strlen(cookies) + 1);
  while (cookies[i] != '\0') {
    if (cookies[i] == ';') {
      if (args[j]='\0',strbegwith(args,"stdin",id)) break;
      j = 0;
    }
    else if (j != 0 || cookies[i] != ' ') {
      args[j] = cookies[i];
      j++;
    }
    i++;
  }
  args[j] = '\0';
  if (!cookies[i] && !strbegwith(args,"stdin",id)) {
    free(args);
    return NULL;
  }
  return args+6+strlen(id);
}

char * getscreen(const char* id) {
  char* cookies = getenv("HTTP_COOKIE");
  if (!cookies) return NULL;
  int i = 0, j = 0;
  char *args = (char*)malloc(strlen(cookies) + 1);
  while (cookies[i] != '\0') {
    if (cookies[i] == ';') {
      if (args[j]='\0',strbegwith(args,"screen",id)) break;
      j = 0;
    }
    else if (j != 0 || cookies[i] != ' ') {
      args[j] = cookies[i];
      j++;
    }
    i++;
  }
  args[j] = '\0';
  if (!cookies[i] && !strbegwith(args,"screen",id)) {
    free(args);
    return NULL;
  }
  return args+7+strlen(id);
}

char * getkeyboard(const char* id) {
  char* cookies = getenv("HTTP_COOKIE");
  if (!cookies) return NULL;
  int i = 0, j = 0;
  char *args = (char*)malloc(strlen(cookies) + 1);
  while (cookies[i] != '\0') {
    if (cookies[i] == ';') {
      if (args[j]='\0',strbegwith(args,"keyboard",id)) break;
      j = 0;
    }
    else if (j != 0 || cookies[i] != ' ') {
      args[j] = cookies[i];
      j++;
    }
    i++;
  }
  args[j] = '\0';
  if (!cookies[i] && !strbegwith(args,"keyboard",id)) {
    free(args);
    return NULL;
  }
  return args+9+strlen(id);
}

string getstderr(const char* id) {
  string path = "/home/k24_a/stasbadzi/.homepage/internal/" + string(id) + "/stderr";
  int fd = open(path.c_str(), O_RDONLY);
  if (fd < 0) exit(1);

  int bytes = 0;
  ioctl(fd, FIONREAD, &bytes);
  if (!bytes) return string();
  char *buf = (char*)malloc(bytes+1);
  bytes = read(fd, buf, bytes);
  buf[bytes] = '\0';
  close(fd);
  string result = string(buf);
  free(buf);
  return result+getstderr(id); // pipes have transfer limits
}

string getstdout(const char* id) {
  string path = "/home/k24_a/stasbadzi/.homepage/internal/" + string(id) + "/stdout";
  int fd = open(path.c_str(), O_RDONLY);
  if (fd < 0) exit(1);

  int bytes = 0;
  ioctl(fd, FIONREAD, &bytes);
  if (!bytes) return string();
  char *buf = (char*)malloc(bytes+1);
  bytes = read(fd, buf, bytes);
  buf[bytes] = '\0';
  close(fd);
  string result = string(buf);
  free(buf);
  return result+getstdout(id); // pipes have transfer limits
}

void sendstdin(const char* id, string send) {
  if (!send.size()) return;
  string path = "/home/k24_a/stasbadzi/.homepage/internal/" + string(id) + "/stdin";
  int fd = open(path.c_str(), O_WRONLY);
  int siz = write(fd, send.c_str(), send.size());
  close(fd);
  if (siz != send.size()) exit(1);
  return;
}

enum class event_type : uint8_t {
  key_down,
  key_up,
  toggle_on,
  toggle_off,
};

struct custom_event {
  event_type type;
  uint16_t value;
};

pair <char32_t* const,size_t> u8tou32(const char* u8, size_t len) {
  mbstate_t state = std::mbstate_t();
  auto u32 = (char32_t*)calloc(len,sizeof(wchar_t));
  auto u32now = u32;
  auto u8now = u8;
  while (u8now < u8 + len) {
    read_code_point(u8now, u32now[0]);
    ++u32now;
  }
  u32now[0] = L'\0';
  return {u32,u32now-u32};
}

void sendkeyboard(const char* id, pair<char* const,size_t> send) {
  if (!send.second) return;
  auto bytes = u8tou32(send.first, send.second);
  if (!bytes.first) return;
  vector<custom_event> events;

  for (int i = 0; i+1 < bytes.second; i+=2) {
    assert(bytes.first[i] <= static_cast<uint8_t>(event_type::toggle_off));
    assert(bytes.first[i+1] <= UINT16_MAX);
    events.push_back({static_cast<event_type>(bytes.first[i]), static_cast<uint16_t>(bytes.first[i+1])});
  }
  free(bytes.first);

  string path = "/home/k24_a/stasbadzi/.homepage/internal/" + string(id) + "/keyboard";
  int fd = open(path.c_str(), O_WRONLY);
  int siz = write(fd, events.data(), events.size()*sizeof(custom_event));
  close(fd);
  if (siz < 0) exit(1);
  return;
}

void sendscreen(const char* id, pair<char* const,size_t> send) {
  if (!send.second) return;
  auto bytes = u8tou32(send.first, send.second);
  if (!bytes.first) return;
  vector<uint16_t> resizes;

  for (int i = 0; i+1 < bytes.second; i+=2) {
    assert(bytes.first[i] <= UINT16_MAX);
    assert(bytes.first[i+1] <= UINT16_MAX);
    resizes.push_back(static_cast<uint16_t>(bytes.first[i]));
    resizes.push_back(static_cast<uint16_t>(bytes.first[i+1]));
  }
  free(bytes.first);

  string path = "/home/k24_a/stasbadzi/.homepage/internal/" + string(id) + "/screen";
  int fd = open(path.c_str(), O_WRONLY);
  int siz = write(fd, resizes.data(), resizes.size()*sizeof(uint16_t));
  close(fd);
  if (siz < 0) exit(1);
  return;
}

bool touch(const char* file) {
  int fd = open(file,O_WRONLY);
  if (fd < 0) return false;
  char c = 0;
  write(fd,&c,1);
  close(fd);
  return true;
}

int main(int argc, char **argv, char **envp)
{

  char* path = (char*)malloc(1024);
  int siz = readlink("/proc/self/exe",path,1023);
  path[siz-4] = '\0'; // .cgi
		      //-43210
  int x;for (x=siz-3; x >= 0 && path[x]!='/'; x--);
  char* num = path + x + 1;
  if (num[0] > '9' || num[0] < '0') {
    free(path);
    return EXIT_FAILURE;
  }

  printf("Set-Cookie: stdin%s=; SameSite=Strict; domain=%s; path=%s\r\n", num, getenv("HTTP_HOST"),"/");
  printf("Set-Cookie: keyboard%s=; SameSite=Strict; domain=%s; path=%s\r\n", num, getenv("HTTP_HOST"),"/");
  printf("Set-Cookie: screen%s=; SameSite=Strict; domain=%s; path=%s\r\n", num, getenv("HTTP_HOST"),"/");

  string timeoutfl = "/home/k24_a/stasbadzi/.homepage/internal/" + string(num) + "/timeout";

  if (!touch(timeoutfl.c_str())) {
    if (dodie(num)) printf("Content-type: text/html\n\n%s", uri_encode("\033[#").c_str());
    else printf("Content-type: text/html\n\n");
    return 0;
  }
  printf("Set-Cookie: die%s=1; SameSite=Strict; domain=%s; path=%s\r\n", num, getenv("HTTP_HOST"),"/");
  setlocale(LC_ALL, "UTF-8");

  char *__send0 = getstdin(num);
  char *__send1 = getkeyboard(num);
  char *__send2 = getscreen(num);

  auto send0 = (__send0) ? uri_decode(__send0) : "";
  auto send1 = (__send1) ? uri_decode_cstr(__send1) : pair<char* const,size_t>{"",0};
  auto send2 = (__send2) ? uri_decode_cstr(__send2) : pair<char* const,size_t>{"",0};
  
  sendstdin(num, send0);
  sendkeyboard(num, send1);
  sendscreen(num, send2);

  if (send1.second) free(send1.first);
  if (send2.second) free(send2.first);

  string get0 = getstdout(num);
  string get1 = getstderr(num);

  if (get0.length() || get1.length()) {
    printf("Content-type: text/html\n\n%s",uri_encode(get0+get1).c_str());
  } else {
    printf("Content-type: text/html\n\n");
  }

  if (__send0) free(__send0-6-strlen(num));
  if (__send1) free(__send1-9-strlen(num));
  if (__send2) free(__send2-7-strlen(num));
  free(path);
  return 0;
}
