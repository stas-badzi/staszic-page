#include <iostream>
#include "account-handle.hpp"

using namespace std;
using namespace candybank;

int main() {
    struct account acc = get_account();
    cout << "Content-type: application/json\n\n"
        "{\"username\":\"" << acc.username << "\",\"candy\":" << acc.candy << "}";
    return 0;
}