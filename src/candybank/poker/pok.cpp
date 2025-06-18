// ignore, not used for now mastly in "hand-compare.hpp"

#include <bits/stdc++.h>
using namespace std;

#define CLUBS 0
#define DIAMONDS 1
#define HEARTS 2
#define SPADES 3

#define make_percent(x, y) to_string((long double)(x)/(long double)(y)*100.0)+'%'

bool constexpr lesscrd(char& i1,char&i2) {
    return (i1%13) < (i2%13);
}

constexpr const char* const suitstrs[] = {"♣", "♦", "♥", "♠"};
constexpr const char rankstrs[] = {'2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'};

#define T 10
#define J 11
#define Q 12
#define K 13
#define A 14

// 0b00[rrrrr] HIGH CARD
// 0b010[prrr] PAIR
// 0b0110[pqr] 2 PAIR
// 0b0111[00/01/10][prr] TRIPS
// 0b011111[r] STRAIGHT
// 0b10[rrrrr] FLUSH
// 0b110[pq] FULL HOUSE
// 0b1110[pr] QUADS
// 0b1111[11][r] STRAIGHT FLUSH
// last one so STRAIGHT FLUSH == STRAIGHT | FLUSH

    bool constexpr cardcmp(size_t& i1,size_t&i2) {
        return i1 > i2;
    }
class hand {
public:
    typedef size_t card_t;
private:
    array<card_t,5> a;
    unsigned int level; // 0b[P4HFS321][cccccccccccccccccccc]
    //card_t card; // 0brrrrrrrrrrrrrrcccc (r - rank, c - suit) A's begin and end 'cause strait A-5 and T-A
    #define SUIT_MASK 0b1111
    #define STRAIGHT_MASK 0b11111
    #define RANK_SHIFT 4
    #define GET_CARD(r,s) hand::getcard(s,r)
public:
    constexpr static card_t getcard(uint8_t s, uint8_t r) {
        return (0b100000ul << (r-2)) | (0b1ul << s) | ((r == 14) << 4);
    }
    static uint8_t constexpr getsuit(uint8_t i) {
        return i/13;
    }
    static uint8_t constexpr getrank(uint8_t i) {
        return i%13;
    }
    static string getcardstring(uint8_t card) {
        return rankstrs[getrank(card)] + string(suitstrs[getsuit(card)]);
    }
    void printcerr();
        
    constexpr hand(array<card_t,7> cards) : a(), level(0) {
        bool flush = false;
        int8_t pair1 = -1, pair2 = -1; array<int8_t,7> sides({0,0,0,0,0,0,0}); int8_t sideit = -1;
        char straight = 0; // 0 - no straight (1-10) begins with A23456789T
        unsigned long ranks = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4] | cards[5] | cards[6]) >> RANK_SHIFT;
        bool nothing = false;
        for (char i = 1; i <= 10; ++i)
            if ((ranks & STRAIGHT_MASK) == STRAIGHT_MASK) {
                straight = i;
                break;
            } else ranks >>= 1;

        array<uint8_t,14+4> cardsums = {0};
        for (uint8_t i = 0; i < 14+4; i++) {
            cardsums[i] = (cards[0] & (0b1ul << i)) + (cards[1] & (0b1ul << i)) + (cards[2] & (0b1ul << i)) + (cards[3] & (0b1ul << i)) + (cards[4] & (0b1ul << i)) + (cards[5] & (0b1ul << i)) + (cards[6] & (0b1ul << i)) >> i;
            if (i < 4) {
                if (cardsums[i] > 4 && !flush) {
                    flush = true;
                    for (int8_t it = 0; it < 7; ++it)
                        if (!(cards[i] & (0b1 << i)))
                            cards[i] = 0;
                }
            } else if (straight) break;
            else if (i > 4 && cardsums[i] > 1)
                if (pair1 == -1) pair1 = i-5;
                else if (pair2 == -1) {
                    if (cardsums[pair1+5] <= cardsums[i]) {
                        pair2 = pair1;
                        pair1 = i-5;
                    } else pair2 = i-5;
                } else {
                    if (cardsums[pair1+5] <= cardsums[i]) {
                        pair2 = pair1;
                        pair1 = i-5;
                    } else if (cardsums[pair2+5] <= cardsums[i]) {
                        int it=0; while (it <= sideit, sides[it] < pair2) ++it;
                        for (int jt=sideit;jt>=it;--jt) sides[jt+1] = sides[jt];
                        sides[it] = pair2;
                        ++sideit;
                        pair2 = i-5;
                    }
                }
            else if (i > 4 && cardsums[i]) sides[++sideit] = i-5;
        }
        //cerr << cards[0] << '~' << cards[1] << '~' << cards[2] << '~' << cards[3] << '~' << cards[4] << '~';
        //cerr << level << '-';
        if (flush) level = 0b10'000000000000000000;
        if (straight) level |= 0b0111110000000000'0000;
        //cerr << level << '-';
        if (!(straight || flush)) {
            if (pair1 == -1) {
                level =         0b00'000000000000000000 ;
                nothing = true;
            } else {
                if (cardsums[pair1+5] >= 4) {
                    // quads
                    level =     0b111000000000'00000000 | (pair1*12+sides[sideit]-(sides[sideit]>pair1));
                } else if (cardsums[pair1+5] == 3)
                    if (pair2 != -1) {
                        // full house
                        level = 0b110000000000'00000000 | (pair1*12+pair2-(pair2 > pair1));
                    } else {
                        // trips
                        level = 0b011100000'00000000000 | ((pair1*12+sides[sideit]-(sides[sideit]>pair1))*11+sides[sideit-1]-(sides[sideit-1]>pair1));
                    }
                else if (cardsums[pair1+5] == 2) 
                    if (pair2 != -1) {
                        // 2 pair
                        uint8_t remove = (sides[sideit] > pair2) + (sides[sideit] > pair1);
                        level = 0b011000000'00000000000 | ((pair1*12+pair2)*11+sides[sideit]-remove);
                    } else {
                        // pair
                        level = 0b01000'000000000000000 | (((pair1*12+sides[sideit]-(sides[sideit]>pair1))*11+sides[sideit-1]-(sides[sideit-1]>pair1))*10+sides[sideit-2]-(sides[sideit-2]>pair1));
                    }
            }
        }

        if (straight)
            level |= straight-1;
        else if (flush || nothing)
            level |= ((((sides[sideit]*12+sides[sideit-1])*11+sides[sideit-2])*10+sides[sideit-3])*9+sides[sideit-4]);
        //cerr << bitset<20>(level) << ':';
    }
    constexpr hand(array<card_t,5> cards) : a(cards), level(0) {
        *this = hand(array<card_t,7>({cards[0],cards[1],cards[2],cards[3],cards[4],0,0}));
        this->a[0] = cards[0];
        this->a[1] = cards[1];
        this->a[2] = cards[2];
        this->a[3] = cards[3];
        this->a[4] = cards[4];
        //printcerr();
        /*bool flush = cards[0] & cards[1] & cards[2] & cards[3] & cards[4] & SUIT_MASK;
        char straight = 0; // 0 - no straight (1-10) begins with A23456789T
        unsigned long ranks = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> RANK_SHIFT;
        bool nothing = false;
        for (char i = 1; i <= 10; ++i)
            if ((ranks & STRAIGHT_MASK) == STRAIGHT_MASK) {
                straight = i;
                break;
            } else ranks >>= 1;
        //cerr << cards[0] << '~' << cards[1] << '~' << cards[2] << '~' << cards[3] << '~' << cards[4] << '~';
        //cerr << level << '-';
        if (flush) level = 0b10'00000000000000000;
        if (straight) level |= 0b011111000000000'0000;
        //cerr << level << '-';
        unsigned long pair = 0;
        if (!(straight || flush)) {
            pair = ( (cards[0] & (cards[1] | cards[2] | cards[3] | cards[4])) | (cards[1] & (cards[2] | cards[3] | cards[4])) | (cards[2] & (cards[3] | cards[4])) | (cards[3] & cards[4]) ) >> RANK_SHIFT;
            char8_t pairnum = ((pair & (cards[0] >> RANK_SHIFT)) > 0) + ((pair & (cards[1] >> RANK_SHIFT)) > 0) + ((pair & (cards[2] >> RANK_SHIFT)) > 0) + ((pair & (cards[3] >> RANK_SHIFT)) > 0) + ((pair & (cards[4] >> RANK_SHIFT)) > 0);
            if (!pair) {
                level = 0b00'00000000000000000;
                nothing = true;
            } else if (pair & (pair-1)) {
                switch (pairnum) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        exit(16);
                    case 4:
                        // 2 pair
                        level = 0b0110'000000000000000;
                        {

                            unsigned long mask = 0b10000000000000;
                            int8_t rankit = 12;
                            uint8_t cardnum = 0;
                            unsigned long rankmult = 0; // not most effective; could use 9^5 instead of 13!/(13-5)!
                            do
                                if (pair & mask) {
                                    rankmult *= 13-cardnum;
                                    rankmult += rankit;
                                    ++cardnum;
                                }
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            assert(cardnum == 2);

                            auto ranks = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> RANK_SHIFT;
                            ranks &= ~pair;
                            mask = 0b10000000000000;
                            rankit = 12;
                            
                            int beforepair = 2;
                            do
                                if (ranks & mask) {
                                    rankmult *= 12-cardnum;
                                    rankmult += rankit-beforepair;
                                    ++cardnum;
                                } else if (pair & mask) --beforepair;
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            assert((cardnum == 3) && (rankit == -1));
                            level |= rankmult;
                        }
                        break;
                    case 5:
                        // full house
                        level = 0b11000000000'00000000;
                        {
                            unsigned long trips = ( ( cards[0] & ( (cards[1] & (cards[2] | cards[3] | cards[4])) | (cards[2] & (cards[3] | cards[4])) | (cards[3] & cards[4]) ) ) | ( cards[1] & ( (cards[2] & (cards[3] | cards[4])) | (cards[3] & cards[4]) ) ) | (cards[2] & cards[3] & cards[4]) ) >> RANK_SHIFT;
                            if (!trips) exit(19);

                            unsigned long mask = 0b10000000000000;
                            int8_t rankit = 12;
                            uint8_t cardnum = 0;
                            unsigned long rankmult = 0; // not most effective; could use 9^5 instead of 13!/(13-5)!
                            do
                                if (trips & mask) {
                                    rankmult *= 13-cardnum;
                                    rankmult += rankit;
                                    ++cardnum;
                                }
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            assert(cardnum == 1);

                            auto rankspair = pair;
                            rankspair &= ~trips;
                            mask = 0b10000000000000;
                            rankit = 12;
                            
                            int beforepair = 1;
                            do
                                if (rankspair & mask) {
                                    rankmult *= 12-cardnum;
                                    rankmult += rankit-beforepair;
                                    ++cardnum;
                                } else if (trips & mask) --beforepair;
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            assert((cardnum == 2) && (rankit == -1));
                            level |= rankmult;
                        }
                        break;
                    default:
                        exit(17);
                }
            } else {
                switch (pairnum) {
                    case 0:
                    case 1:
                        exit(15);
                    case 2:
                        // pair
                        level = 0b0100'000000000000000;
                        {
                            unsigned long mask = 0b10000000000000;
                            int8_t rankit = 12;
                            uint8_t cardnum = 0;
                            unsigned long rankmult = 0; // not most effective; could use 9^5 instead of 13!/(13-5)!
                            do
                                if (pair & mask) {
                                    rankmult *= 13-cardnum;
                                    rankmult += rankit;
                                    ++cardnum;
                                    break;
                                }
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            if (cardnum != 1) {
                                cerr << "Error pair1: " << pair << " cardnum: " << (unsigned)cardnum << '\n' << "cards: " << cards[0] << "," << cards[1] << ',' << cards[2] << ',' << cards[3] << ',' << cards[4] << '\n';
                                printcerr();
                                exit(1);
                            }

                            auto ranks = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> RANK_SHIFT;
                            ranks &= ~pair;
                            mask = 0b10000000000000;
                            rankit = 12;
                            
                            bool beforepair = 1; 
                            do
                                if (ranks & mask) {
                                    rankmult *= 12-cardnum;
                                    rankmult += rankit-beforepair;
                                    ++cardnum;
                                } else if (pair & mask) beforepair = 0;
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice

                            if (cardnum != 4 || rankit != -1) {
                                cerr << "Error pair2: " << pair << " cardnum: " << (unsigned)cardnum << '\n' << "cards: " << cards[0] << "," << cards[1] << ',' << cards[2] << ',' << cards[3] << ',' << cards[4] << '\n';
                                printcerr();
                                exit(1);
                            }
                            level |= rankmult;
                        }
                        break;
                    case 3:
                        // trips
                        level = 0b0111'000000000000000;
                        {
                            unsigned long mask = 0b10000000000000;
                            int8_t rankit = 12;
                            uint8_t cardnum = 0;
                            unsigned long rankmult = 0; // not most effective; could use 9^5 instead of 13!/(13-5)!
                            do
                                if (pair & mask) {
                                    rankmult *= 13-cardnum;
                                    rankmult += rankit;
                                    ++cardnum;
                                    break;
                                }
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            assert(cardnum == 1);

                            auto ranks = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> RANK_SHIFT;
                            ranks &= ~pair;
                            mask = 0b10000000000000;
                            rankit = 12;
                            
                            bool beforepair = 1; 
                            do
                                if (ranks & mask) {
                                    rankmult *= 12-cardnum;
                                    rankmult += rankit-beforepair;
                                    ++cardnum;
                                } else if (pair & mask) beforepair = 0;
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            assert((cardnum == 3) && (rankit == -1));
                            level |= rankmult;
                        }
                        break;
                    default:
                        // quads >= 4
                        level = 0b11100000000'00000000;
                        {
                            unsigned long mask = 0b10000000000000;
                            int8_t rankit = 12;
                            uint8_t cardnum = 0;
                            unsigned long rankmult = 0; // not most effective; could use 9^5 instead of 13!/(13-5)!
                            do
                                if (pair & mask) {
                                    rankmult *= 13-cardnum;
                                    rankmult += rankit;
                                    ++cardnum;
                                    break;
                                }
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            assert(cardnum == 1);

                            auto ranks = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> RANK_SHIFT;
                            ranks &= ~pair;
                            mask = 0b10000000000000;
                            rankit = 12;
                            
                            bool beforepair = 1; 
                            do
                                if (ranks & mask) {
                                    rankmult *= 12-cardnum;
                                    rankmult += rankit-beforepair;
                                    ++cardnum;
                                } else if (pair & mask) beforepair = 0;
                            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
                            if (cardnum != 2 || rankit != -1) {
                                cerr << "Error pair3: " << pair << " cardnum: " << (unsigned)cardnum << '\n' << "cards: " << cards[0] << "," << cards[1] << ',' << cards[2] << ',' << cards[3] << ',' << cards[4] << '\n';
                                printcerr();
                                exit(1);
                            }
                            level |= rankmult;
                        }
                        break;
                }
            }
        }

        if (straight)
            level |= straight-1;
        else if (flush || nothing) {
            auto ranks = (cards[0] | cards[1] | cards[2] | cards[3] | cards[4]) >> RANK_SHIFT;
            unsigned long mask = 0b10000000000000;
            int8_t rankit = 12;
            uint8_t cardnum = 0;
            unsigned long rankmult = 0; // not most effective; could use 9^5 instead of 13!/(13-5)!
            do
                if (ranks & mask) {
                    rankmult *= 13-cardnum;
                    rankmult += rankit;
                    ++cardnum;
                }
            while ((mask >>= 1) && (--rankit >= 0)); // don't do Aces twice
            if (cardnum != 5 || rankit != -1) {
                cerr << "Error flush-nothing: " << ranks << " cardnum: " << (unsigned)cardnum << '\n' << "cards: " << cards[0] << "," << cards[1] << ',' << cards[2] << ',' << cards[3] << ',' << cards[4] << '\n';
                printcerr();
                exit(1);
            }
            level |= rankmult;
        }
        //cerr << level << ',' << (int)straight << ' ' << flush << ' ' << pair << '\n';
        */
    }
    hand(array<bitset<14+4>,5> cards) {
        *this = hand(array<card_t,5>({cards[0].to_ulong(), cards[1].to_ulong(), cards[2].to_ulong(), cards[3].to_ulong(), cards[4].to_ulong()}));
    }

    hand& operator=(const array<card_t,5>& arr) {
        return (*this)=hand(arr);
    }
    bool constexpr operator>(const hand& other) const {
        return (this->level > other.level);
    }
    bool constexpr operator>=(const hand& other) const {
        return (this->level >= other.level);
    }
    bool constexpr operator<(const hand& other) const {
        return (this->level < other.level);
    }
    bool constexpr operator<=(const hand& other) const {
        return (this->level <= other.level);
    }
};

void hand::printcerr() {
    sort(a.begin(),a.end(),cardcmp);
    array<size_t,5> ranks = {a[0] >> RANK_SHIFT, a[1] >> RANK_SHIFT, a[2] >> RANK_SHIFT, a[3] >> RANK_SHIFT, a[4] >> RANK_SHIFT};
    //cerr << ranks[0] << '-' << ranks[1] << '-' << ranks[2] << '-' << ranks[3] << '-' << ranks[4] << '\n';
    for (char j = 0; j < 5; ++j) {
        for (char i = 1; i <= 13; ++i)
            if (ranks[j] & (0b1 << i))
                if (i < 9) cerr << (i+1);
                else if (i == 9) cerr << 'T';
                else if (i == 10) cerr << 'J';
                else if (i == 11) cerr << 'Q';
                else if (i == 12) cerr << 'K';
                else cerr << 'A';
        for (char i = 0; i < 4; ++i) 
            if (a[j] & (0b1 << i))
                if (i == 0) cerr << '%';
                else if (i == 1) cerr << '&';
                else if (i == 2) cerr << '^';
                else if (i == 3) cerr << '@';
                else cerr << '~';
    }
    cerr << '\n';
}

template<typename t,typename u>
size_t constexpr count_begin(const vector<t>& el, u it) {
    if (it == el.end()) return el.size();
    size_t out = 0;
    while (it != el.begin()) {
        ++out; --it;
    }
    return out;
}

vector<hand> genhands(void) {
    vector<hand> hands;
    long long x = 0;
    for (char i1 = 0; i1 < 52; i1++) { //52
        for (char i2 = i1+1; i2 < 52; i2++) { //51
            for (char i3 = i2+1; i3 < 52; i3++) { //49
                for (char i4 = i3+1; i4 < 52; i4++) {
                    for (char i5= i4+1; i5 < 52; i5++) {
                        //cerr << (int)i1 << ',' << (int)i2 << ',' << (int)i3 << ',' << (int)i4 << ',' << (int)i5 << '\n';
                        array<hand::card_t,5> cards = {
                            GET_CARD(hand::getcard(i1)+2,hand::getcol(i1)),
                            GET_CARD(hand::getcard(i2)+2,hand::getcol(i2)),
                            GET_CARD(hand::getcard(i3)+2,hand::getcol(i3)),
                            GET_CARD(hand::getcard(i4)+2,hand::getcol(i4)),
                            GET_CARD(hand::getcard(i5)+2,hand::getcol(i5))
                        };

                        hands.push_back(hand(cards));
                    }
                }
            }
        }
    }
    sort(hands.begin(),hands.end());
    return hands;
}



int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    auto hands = genhands();
    cout << hands.size() << '\n' << endl;
    while (true) {
        char q;
        cin >> q;
        if (q == '0') {
            array<char,5> ns, cols, ot0,ot1; cin >> ns[0] >> cols[0] >> ns[1] >> cols[1] >> ns[2] >> cols[2] >> ns[3] >> cols[3] >> ns[4] >> cols[4];
            array<hand::card_t,5> ot;
            for (char it = 0; it < 5; ++it)
                ot0[it] = (ns[it]=='A') ? A : (ns[it]=='K') ? K : (ns[it]=='Q') ? Q : (ns[it]=='J') ? J : (ns[it]=='T') ? T : ns[it]-'0';
            for (char it = 0; it < 5; ++it)
                ot1[it] = ( (cols[it]=='@') ? SPADES : (cols[it]=='&') ? HEARTS : (cols[it]=='^') ? DIAMONDS : CLUBS );
            for (char it = 0; it < 5; ++it)
                ot[it] = GET_CARD(ot0[it],ot1[it]);
            hand this_hand(ot);
            auto f1 = lower_bound(hands.begin(),hands.end(),this_hand);
            auto f2 = upper_bound(hands.begin(),hands.end(),this_hand);
            auto a = hands.size() - count_begin(hands,f2), b = hands.size() - count_begin(hands,f1);
            cout << make_percent(b,hands.size()) << '-' <<  make_percent(a,hands.size()) << '\n' << endl;
        } else if (q == '1') {
            array<char,7> ns, cols, ot0,ot1; cin >> ns[0] >> cols[0] >> ns[1] >> cols[1] >> ns[2] >> cols[2] >> ns[3] >> cols[3] >> ns[4] >> cols[4] >> ns[5] >> cols[5] >> ns[6] >> cols[6];
            array<hand::card_t,7> ot;
            for (char it = 0; it < 7; ++it)
                ot0[it] = (ns[it]=='A') ? A : (ns[it]=='K') ? K : (ns[it]=='Q') ? Q : (ns[it]=='J') ? J : (ns[it]=='T') ? T : ns[it]-'0';
            for (char it = 0; it < 7; ++it)
                ot1[it] = ( (cols[it]=='@') ? SPADES : (cols[it]=='&') ? HEARTS : (cols[it]=='^') ? DIAMONDS : CLUBS );
            for (char it = 0; it < 7; ++it)
                ot[it] = GET_CARD(ot0[it],ot1[it]);
            hand this_hand(ot);
            auto f1 = lower_bound(hands.begin(),hands.end(),this_hand);
            auto f2 = upper_bound(hands.begin(),hands.end(),this_hand);
            auto a = hands.size() - count_begin(hands,f2), b = hands.size() - count_begin(hands,f1);
            cout << make_percent(b,hands.size()) << '-' <<  make_percent(a,hands.size()) << '\n' << endl;
        } else if (q == 'q') return 0;

    }
    
}
// kier  &
// karo  ^
// trefl %
// pik   @