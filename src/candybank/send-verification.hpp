#include <stdio.h>
#include <string.h>
#include <string>
#include <iostream>
#include <cassert>
#include <curl/curl.h>

using namespace std;

extern "C" const char _binary_candybank_mail_html_start;
extern "C" const char _binary_candybank_mail_html_end;

static const char *payload_text[] = {
    "From: Candy Bank <noreply@stasbadzi.w.staszic.waw.pl> \r\n",
    nullptr,
    "CC: \r\n"
    "Subject: Account verification code\r\n",
    "MIME-Version: 1.0\r\n",
    "Content-Type: multipart/alternative; boundary=CONTENT\r\n",
    "--CONTENT\r\n",
    "Content-Type: text/plain; charset=UTF-8\r\n",
    "Content-Transfer-Encoding: 7bit\r\n",
    "\r\n",

    "\t\t🍭 Candy Bank\n"
    "Your account verification code is:\n",
    "\n\t",
    nullptr,
    "\n\n",
    "If it wasn't you trying to create a Candy Bank account, please ignore this message\n",
    "\nBest regards,\nStanisław Badziak, CEO of Candy Bank\n",
    "Contact: stasbadzi@staszic.waw.pl""\r\n",

    "\r\n",
    "--CONTENT\r\n",
    "Content-Type: text/html; charset=UTF-8\r\n",
    "Content-Transfer-Encoding: 7bit\r\n",
    
    nullptr,

    "\r\n"
    "--CONTENT--\r\n",
    NULL
};
 
struct upload_status {
  int lines_read;
};
 
static inline size_t payload_source(void *ptr, size_t size, size_t nmemb, void *userp)
{
  struct upload_status *upload_ctx = (struct upload_status *)userp;
  const char *data;
 
  if((size == 0) || (nmemb == 0) || ((size*nmemb) < 1)) {
    return 0;
  }
 
  data = payload_text[upload_ctx->lines_read];
 
  if(data) {
    cerr << data;
    size_t len = strlen(data);
    memcpy(ptr, data, len);
    upload_ctx->lines_read++;
 
    return len;
  }
 
  return 0;
}
 
inline int send_mail(string to, uint32_t code) {
    string to_str = "To: " + to + "\r\n";

    string num = to_string(code);
    while (num.size() < 6) num = "0" + num;
    while (num.size() > 6) num.pop_back();

    string html_str_tmp(&_binary_candybank_mail_html_start,&_binary_candybank_mail_html_end);
    string html_str; 
    html_str.reserve(html_str_tmp.size()+num.size()*3+html_str_tmp.size()/10);
    html_str.push_back('\n');
    for (int i = 0; i < html_str_tmp.size(); ++i) {
        if (!i || html_str_tmp[i-1] == '\n') html_str.push_back('\t');
        html_str.push_back(html_str_tmp[i]);
    }

    int it=0;
    while (html_str[it]) {
        while(html_str[it] && html_str[it] != '$') ++it;
        int jt = 0;
        while (html_str[it] == '$' && num[jt]) {
            html_str[it] = num[jt];
            ++it; ++jt;
        }
    }
    html_str.append("\r\n");

    payload_text[1] = to_str.c_str();
    payload_text[11] = num.c_str();
    payload_text[20] = html_str.c_str();

    CURL *curl;
    CURLcode res = CURLE_OK;
    struct curl_slist *recipients = NULL;
    struct upload_status upload_ctx;

    upload_ctx.lines_read = 0;

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "smtp://listonosz.staszic.waw.pl:587");
        recipients = curl_slist_append(NULL, to.c_str());
        curl_easy_setopt(curl, CURLOPT_MAIL_RCPT, recipients);

        curl_easy_setopt(curl, CURLOPT_READFUNCTION, payload_source);
        curl_easy_setopt(curl, CURLOPT_READDATA, &upload_ctx);
        curl_easy_setopt(curl, CURLOPT_UPLOAD, 1L);
        curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

        curl_easy_setopt(curl, CURLOPT_USERNAME, "stasbadzi@staszic.waw.pl");
        curl_easy_setopt(curl, CURLOPT_PASSWORD, "Sbtaadszziic!");

        curl_easy_setopt(curl, CURLOPT_USE_SSL, (long)CURLUSESSL_ALL);

        res = curl_easy_perform(curl);

        if(res != CURLE_OK)
            return res;

        curl_slist_free_all(recipients);
        curl_easy_cleanup(curl);
    }
 
    return (int)res;
}