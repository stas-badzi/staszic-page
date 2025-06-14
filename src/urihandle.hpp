#pragma once

#include <string>
#include <utility>
#include <curl/curl.h>
#include <uchar.h>
#include <cstring>
#include <vector>

inline std::string trim(std::string s) {
    while (s.size() && (s[0] == ' ' || s[0] == '\t' || s[0] == '\n' || s[0] == '\r')) s.erase(0, 1);
    while (s.size() && (s[s.size()-1] == ' ' || s[s.size()-1] == '\t' || s[s.size()-1] == '\n' || s[s.size()-1] == '\r')) s.pop_back();
    return s;
}

inline std::vector<std::string> split(std::string s, const std::string& delimiter) {
    std::vector<std::string> tokens;
    size_t pos = 0;
    std::string token;
    while ((pos = s.find(delimiter)) != std::string::npos) {
        token = s.substr(0, pos);
        tokens.push_back(token);
        s.erase(0, pos + delimiter.length());
    }
    tokens.push_back(s);
    if (!tokens.back().size()) tokens.pop_back();
    return tokens;
}

inline std::vector<std::string> split(const std::string& s, char delimiter) {
   return split(s, std::string(1, delimiter));
}

inline std::string getnext(FILE* file) {
   char c;
   std::string next;
   while (!feof(file), c = fgetc(file), c != '\0' && c != EOF)
      next.push_back(c);
   return next;
}

inline std::string uri_encode(const std::string& decoded)
{
    const auto encoded_value = curl_easy_escape(nullptr, decoded.c_str(), static_cast<int>(decoded.length()));
    std::string result(encoded_value);
    curl_free(encoded_value);
    return result;
}

inline std::string uri_decode(const std::string& encoded)
{
    int output_length;
    const auto decoded_value = curl_easy_unescape(nullptr, encoded.c_str(), static_cast<int>(encoded.length()), &output_length);
    std::string result(decoded_value, output_length);
    curl_free(decoded_value);
    return result;
}

inline std::pair<char* const,size_t> uri_decode_cstr(const char* encoded) {
    int output_length;
    const auto decoded_value = curl_easy_unescape(nullptr, encoded, static_cast<int>(strlen(encoded)), &output_length);
    char* res = (char*)malloc(output_length+1);
    for (int i = 0; i < output_length; i++) res[i] = decoded_value[i];
    curl_free(decoded_value);
    return {res, output_length};
}

inline void read_code_point(char const* &pSrc, char32_t& cp) {
    char32_t u1, u2, u3, u4, nu = 0;
    if ((u1 = (char8_t)*pSrc++) <= 0x7F) {
        cp = u1; nu = 1;
    } else if ((u1 & 0xE0) == 0xC0) {
        u2 = (char8_t)*pSrc++; nu = 2;
        cp = ((u1 & 0x1F) << 6) | (u2 & 0x3F);
    } else if ((u1 & 0xF0) == 0xE0) {
        u2 = (char8_t)*pSrc++; u3 = (char8_t)*pSrc++; nu = 3;
        cp = ((u1 & 0x0F) << 12) | ((u2 & 0x3F) << 6) | (u3 & 0x3F);
    } else if ((u1 & 0xF8) == 0xF0) {
        u2 = (char8_t)*pSrc++; u3 = (char8_t)*pSrc++; u4 = (char8_t)*pSrc++; nu = 4;
        cp = ((u1 & 0x07) << 18) | ((u2 & 0x3F) << 12) | ((u3 & 0x3F) << 6) | (u4 & 0x3F);
    }
    return;
}

inline std::string searchparam_decode(std::string encoded) {
    for (size_t i = 0; i < encoded.length(); i++)
        if (encoded[i] == '+') encoded[i] = ' ';
    return uri_decode(encoded);
}

std::string searchparam_encode(std::string decoded) {
    std::vector<size_t> spaces;
    for (size_t i = 0; i < decoded.length(); i++)
        if (decoded[i] == ' ') {
            decoded[i] = '0'; // won't replace with '+' because of urlencode
            spaces.push_back(i);
        }
    std::string encoded = uri_encode(decoded);
    for (size_t i = 0; i < spaces.size(); i++)
        encoded[spaces[i]] = '+';
    return encoded;
}