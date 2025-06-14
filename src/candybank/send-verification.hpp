#include <stdio.h>
#include <string.h>
#include <string>
#include <iostream>
#include <cassert>
#include <curl/curl.h>

using namespace std;

constexpr const char* HTML = R"(
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            body, #body {
                display: grid;
                width: fit-content;
            }

            #header {
                display: grid;
                text-align: center;
                margin-top: 0.5em;
                align-items: center;
            }

            .msg {
                text-align: center;
                margin-top: 0.5em;
                align-items: center;
            }

            #main {
                padding-left: 0.5em;
                padding-right: 0.5em;
                width: 100%;
                text-align: center;
                display: grid;
            }

            .msg {
                border: 0.1em solid black;
                width: fit-content;
                margin: 0.8em;
                padding: 0.3em;
            }

            h1,h2,h3,h4,h5,h6,p,a,button{
                font-family: sans-serif;
                margin: unset;
            }

            .menu {
                display: block ruby;
                width: 100%;
            }

            .company {
                display: flex;
            }

            .name {
                margin-left: 0.4em;
            }

            .num { /* div pretend to be button, so it's selectable (other methods don't work in gmail) */
                display: inline-block;
                color:#444;
                border:1px solid #CCC;
                border-radius: 6%;
                background:#DDD;
                box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
                text-align: center;
            }

            .num {
                width: 50%;
                font-size: 2em;
                user-select:text;
            }

            .numjs { /* disable text selection if js is enabled */
                cursor:pointer;
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
                user-select: none; /* Standard syntax */
            }

            .numjs:active { /* animate button (div) press if js is enabled */
                box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
            }

            .logo {
                width: 2.5em;
                height: fit-content;
            }

            .text1 {
                font-size: 1.2em;
                margin-bottom: 0.2em;
            }

            .text2 {
                font-size: 0.8em;
                text-wrap: wrap;
                max-width: 22em;
                margin-top: 0.4em;
                text-align: left;
                padding-left: 0.5em;
            }

            .footer {
                color: lightgray;
                font-size: 0.6em;
                text-align: left;
                padding-left: 1.5em;
            }

            #copy {
                /* visibility: hidden; doesn't work in gmail */
                height: 0;
                width: 0;
            }

            #invis {
                font-size: 0;
            }
        </style>
    </head>
    <body>
        <p id="invis">Your code is $$$$$$.&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;&#x2800;</p>
        <div id="body"> <!--- <body> styles don't work in gmail --->
            <div id="header"> <!--- <header> might not work in some mail services --->
                <div class="menu">
                    <div class="company">
                        <img src="https://stasbadzi.w.staszic.waw.pl/candybank/images/logo.png" class="logo">
                        <h1 class="name">
                            <span style="color: darkmagenta;">C</span><span style="color: red;">a</span><span style="color: yellow;">n</span><span style="color: blue;">d</span><span style="color: lime;">y</span><span> </span><span style="color: red;">B</span><span style="color: blue;">a</span><span style="color: lime;">n</span><span style="color: darkmagenta;">k</span>
                        </h1>
                    </div>
                </div>
            </div>
            <div id="main"> <!--- <main> doesn't work in gmail --->
                <div class="msg">
                    <p class="text1">Your account verification code is:</p>
                    <div id="num" class="num" onclick="navigator.clipboard.writeText(this.innerText); document.getElementById('copy').innerHTML = 'Copied!';">$$$$$$</div>
                    <h6 id="copy"></h6>
                    <p class="text2">If it wasn't you trying to create a Candy Bank account, please ignore this message</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>Stanis&#x0142;aw Badziak, CEO of Candy Bank</p>
                    <p>Contact: <a href="mailto:stasbadzi@staszic.waw.pl">stasbadzi@staszic.waw.pl</a></p>
                </div>
            </div>
        </div>
        <script>
            // if js is enables show the `Click to copy` text (because otherwise copying won't work)
            document.getElementById('copy').style.width = 'auto';
            document.getElementById('copy').style.height = 'auto';
            document.getElementById('copy').innerText = 'Click to copy';
            document.getElementById('num').classList.add('numjs');
        </script>
    </body>
    </html>
)""\r\n";

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

    string html_str = HTML;
    int it=0;
    while (html_str[it]) {
        while(html_str[it] && html_str[it] != '$') ++it;
        int jt = 0;
        while (html_str[it] == '$' && num[jt]) {
            html_str[it] = num[jt];
            ++it; ++jt;
        }
    }

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