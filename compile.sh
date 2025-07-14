#!/bin/sh

rm cgi-bin/candybank/poker/*.cgi cgi-bin/candybank/*.cgi cgi-bin/*.cgi bin/*.bin bin/candybank/*.bin bin/candybank/poker/*.bin obj/*.o obj/candybank/*.o obj/candybank/sha256/*.o 2>/dev/null || true

gcc -Ofast -o cgi-bin/increment.cgi src/increment.c && chmod 700 cgi-bin/increment.cgi

g++ -Ofast -o cgi-bin/new-game.cgi src/new-game.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/new-game.cgi
g++ -Ofast -o bin/startup-game.bin src/startup-game.cpp -Wno-write-strings && chmod 700 bin/startup-game.bin
g++ -Ofast -o bin/startup-game2.bin src/startup-game2.cpp -Wno-write-strings && chmod 700 bin/startup-game2.bin
g++ -Ofast -o cgi-bin/update-game.cgi src/update-game.cpp -Wno-write-strings -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/update-game.cgi

mkdir -p obj/candybank/sha256
g++ -Ofast -c src/candybank/sha256/sha256.cpp -o obj/candybank/sha256/sha256.o
g++ -Ofast -c -o obj/candybank/login-hash.o src/candybank/login-hash.cpp -I /home/k24_a/stasbadzi/.local/include

ld --relocatable --format=binary --output=obj/candybank/mail.tmp.o candybank/mail.html
objcopy --rename-section .data=.rodata,alloc,load,readonly,data,contents obj/candybank/mail.tmp.o obj/candybank/mail.o

g++ -Ofast -c -o obj/candybank/create-account.o -fPIC src/candybank/create-account.cpp -I /home/k24_a/stasbadzi/.local/include
g++ -Ofast -c -o obj/candybank/resend-email.o -fPIC src/candybank/resend-email.cpp -I /home/k24_a/stasbadzi/.local/include

g++ -o cgi-bin/candybank/login-hash.cgi obj/candybank/sha256/sha256.o obj/candybank/login-hash.o -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/login-hash.cgi

# bruh... why the hell does it matter if mail.o is before or after the other .o file?... (plot twist: it doesn't matter, the problem was somewhere else)
g++ -o cgi-bin/candybank/create-account.cgi obj/candybank/mail.o obj/candybank/create-account.o -L /home/k24_a/stasbadzi/.local/lib -lcurl -Wl,-z,noexecstack && chmod 700 cgi-bin/candybank/create-account.cgi
g++ -o cgi-bin/candybank/resend-email.cgi obj/candybank/mail.o obj/candybank/resend-email.o -L /home/k24_a/stasbadzi/.local/lib -lcurl -Wl,-z,noexecstack && chmod 700 cgi-bin/candybank/resend-email.cgi

g++ -o cgi-bin/candybank/change-password.cgi src/candybank/change-password.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/change-password.cgi
g++ -Ofast -o cgi-bin/candybank/verify-account.cgi src/candybank/verify-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/verify-account.cgi
g++ -Ofast -o cgi-bin/candybank/login-account.cgi src/candybank/login-account.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/login-account.cgi
g++ -Ofast -o cgi-bin/candybank/get-emailpass.cgi src/candybank/get-emailpass.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/get-emailpass.cgi
g++ -Ofast -o cgi-bin/candybank/account-data.cgi src/candybank/account-data.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/account-data.cgi
g++ -Ofast -o bin/candybank/add-candy.bin src/candybank/add-candy.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 bin/candybank/add-candy.bin
g++ -Ofast -o bin/candybank/set-candy.bin src/candybank/set-candy.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 bin/candybank/set-candy.bin

g++ -Ofast -o bin/candybank/poker/startup-game.bin src/candybank/poker/startup-game.cpp -std=c++20 -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 bin/candybank/poker/startup-game.bin
g++ -Ofast -o cgi-bin/candybank/poker/new-game.cgi src/candybank/poker/new-game.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/poker/new-game.cgi
g++ -Ofast -o cgi-bin/candybank/poker/join-game.cgi src/candybank/poker/join-game.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/poker/join-game.cgi
g++ -Ofast -o cgi-bin/candybank/poker/leave-game.cgi src/candybank/poker/leave-game.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/poker/leave-game.cgi
g++ -Ofast -o cgi-bin/candybank/poker/send-action.cgi src/candybank/poker/send-action.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/poker/send-action.cgi
g++ -Ofast -o cgi-bin/candybank/poker/get-state.cgi src/candybank/poker/get-state.cpp -I /home/k24_a/stasbadzi/.local/include -L /home/k24_a/stasbadzi/.local/lib -lcurl && chmod 700 cgi-bin/candybank/poker/get-state.cgi

#rm -rf obj