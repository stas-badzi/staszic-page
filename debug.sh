#!/bin/sh

gcc -g -o cgi-bin/increment.cgi src/increment.c && chmod 700 cgi-bin/increment.cgi

g++ -g -o cgi-bin/new-game.cgi src/new-game.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/new-game.cgi
g++ -g -o bin/startup-game.bin src/startup-game.cpp -Wno-write-strings && chmod 700 bin/startup-game.bin
g++ -g -o cgi-bin/update-game.cgi src/update-game.cpp -Wno-write-strings -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/update-game.cgi

mkdir -p obj/candybank/sha256
g++ -g -c src/candybank/sha256/sha256.cpp -o obj/candybank/sha256/sha256.o
g++ -g -c -o obj/candybank/login-hash.o src/candybank/login-hash.cpp -I /home/k24_a/stasbadzi/.local/include
g++ -g -o cgi-bin/candybank/login-hash.cgi obj/candybank/sha256/sha256.o obj/candybank/login-hash.o -L /home/k24_a/stasbadzi/.local/lib  -lcurl && chmod 700 cgi-bin/candybank/login-hash.cgi

g++ -g -o cgi-bin/candybank/create-account.cgi src/candybank/create-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/create-account.cgi
g++ -g -o cgi-bin/candybank/verify-account.cgi src/candybank/verify-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/verify-account.cgi
g++ -g -o cgi-bin/candybank/resend-email.cgi src/candybank/resend-email.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/resend-email.cgi
g++ -g -o cgi-bin/candybank/login-account.cgi src/candybank/login-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/login-account.cgi
g++ -g -o cgi-bin/candybank/get-money.cgi src/candybank/get-money.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/get-money.cgi

rm -rf obj
