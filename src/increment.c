#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

int incrementcount()
{
  FILE *f;
  int i;

  f=fopen("/home/k24_a/stasbadzi/.homepage/server.dat", "r+w");
  if (!f)
  {
     sleep(1);
     f=fopen("/home/k24_a/stasbadzi/server.dat", "r+w");
     if (!f)
       return -1;
  }

  fscanf(f, "%d", &i);
  i++;
  fseek(f,0,SEEK_SET);
  fprintf(f, "%d", i);
  fclose(f);
  return i;
}

char * getargs() {
  char* cookies = getenv("HTTP_COOKIE");
  if (!cookies) return NULL;
  int i = 0, j = 0;
  char *args = malloc(strlen(cookies) + 1);
  while (cookies[i] != '\0') {
    if (cookies[i] == ';') {
      if (j >= 5 &&
        args[0] == 's' &&
        args[1] == 'e' &&
        args[2] == 'n' &&
        args[3] == 'd' &&
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
    args[0] == 's' &&
    args[1] == 'e' &&
    args[2] == 'n' &&
    args[3] == 'd' &&
    args[4] == '='
  )) {
    free(args);
    return NULL;
  }
  args[j] = '\0';
  return args+5;
}

int main(int argc, char **argv, char **envp)
{
  char *argsm = getargs();
  char* args = (!argsm || !argsm[0]) ? "NULL" : argsm;
  srand(time(NULL));
  printf("Set-Cookie: send=; SameSite=Strict; domain=%s; path=%s\r\n", getenv("HTTP_HOST"),"/");
  printf("Content-type: text/html\n\n");
  printf("<!DOCTYPE html>\n<html>\n");
  printf("<body>\n");
  printf("<p>%d<br>%s</p>\n", incrementcount(), args);
  printf("</body>\n");
  printf("</html>\n");
  if (argsm) free(argsm-5);
  printf("<br>");
  printf("<br>");
  for (int i = 0; i < argc; i++)
    printf("%s<br>", argv[i]);
  printf("<br>");
  for (int i = 0; envp[i]; i++)
    printf("%s<br>", envp[i]);
  return 0;
}
