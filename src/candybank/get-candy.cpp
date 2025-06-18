#include <iostream>
#include "account-handle.hpp"

using namespace std;
using namespace candybank;

int main() {
    struct account acc = get_account();
    cout << "Content-type: text/plain\n\n" << acc.candy;
    return 0;
}