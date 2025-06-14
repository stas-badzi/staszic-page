#!/bin/sh

gcc -Ofast -o cgi-bin/increment.cgi src/increment.c && chmod 700 cgi-bin/increment.cgi

g++ -Ofast -o cgi-bin/new-game.cgi src/new-game.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/new-game.cgi
g++ -Ofast -o bin/startup-game.bin src/startup-game.cpp -Wno-write-strings && chmod 700 bin/startup-game.bin
g++ -Ofast -o cgi-bin/update-game.cgi src/update-game.cpp -Wno-write-strings -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/update-game.cgi

mkdir -p obj/candybank/sha256
g++ -Ofast -c src/candybank/sha256/sha256.cpp -o obj/candybank/sha256/sha256.o
g++ -Ofast -c -o obj/candybank/login-hash.o src/candybank/login-hash.cpp -I /home/k24_a/stasbadzi/.local/include
g++ -Ofast -o cgi-bin/candybank/login-hash.cgi obj/candybank/sha256/sha256.o obj/candybank/login-hash.o -L /home/k24_a/stasbadzi/.local/lib  -lcurl && chmod 700 cgi-bin/candybank/login-hash.cgi

g++ -Ofast -o cgi-bin/candybank/create-account.cgi src/candybank/create-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/create-account.cgi
g++ -Ofast -o cgi-bin/candybank/verify-account.cgi src/candybank/verify-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/verify-account.cgi
g++ -Ofast -o cgi-bin/candybank/resend-email.cgi src/candybank/resend-email.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/resend-email.cgi
g++ -Ofast -o cgi-bin/candybank/login-account.cgi src/candybank/login-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/login-account.cgi
g++ -Ofast -o cgi-bin/candybank/get-candy.cgi src/candybank/get-candy.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/get-candy.cgi
g++ -Ofast -o bin/candybank/add-candy.cgi src/candybank/add-candy.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 bin/candybank/add-candy.cgi
g++ -Ofast -o bin/candybank/set-candy.cgi src/candybank/set-candy.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 bin/candybank/set-candy.cgi

rm -rf obj