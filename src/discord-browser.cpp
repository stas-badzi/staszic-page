#include <iostream>
#include <curl/curl.h>
#include <cstdlib>
#include <cstring>

struct cstring {
    char* buf;
    std::size_t siz;
    cstring() {}
    cstring(const char* str) {
        this->siz = strlen(str);
        buf = (char*)malloc(siz);
        memcpy(buf,str,siz);
    }
    ~cstring() {
        free(buf);
    }
    std::string cpp() {return std::string(buf,siz);};
};

static size_t mem_write(void *contents, size_t size, size_t nmemb, void *userp) {
    size_t realsize = size * nmemb;
    struct cstring *mem = (struct cstring *)userp;
    
    char *ptr = (char*)realloc (mem->buf, mem->siz + realsize + 1);
    mem->buf = ptr;
    memcpy (mem->buf + mem->siz, contents, realsize);
    mem->siz += realsize;
    mem->buf[mem->siz] = 0;

    return realsize;

}

int main() {

    std::string requrl = "https://stasbadzi.w.staszic.waw.pl";
    CURLcode ret;
    CURL *hnd;
    struct cstring *str = (struct cstring*)calloc(1,sizeof(struct cstring));
    str->buf = (char*)malloc(0);
    struct curl_slist *headers;

    headers = NULL;
    headers = curl_slist_append(headers, "Accept: application/json, text/javascript, */*; q=0.01");
    headers = curl_slist_append(headers, "Accept-Language: en-US,en;q=0.5");
    headers = curl_slist_append(headers, "Accept-Encoding: gzip, deflate, br, zstd");
    headers = curl_slist_append(headers, "Content-Type: application/json; charset=utf-8");
    headers = curl_slist_append(headers, "X-Requested-With: XMLHttpRequest");
    headers = curl_slist_append(headers, "Origin: https://webtopdf.com");
    headers = curl_slist_append(headers, "Alt-Used: webtopdf.com");
    headers = curl_slist_append(headers, "Connection: keep-alive");
    headers = curl_slist_append(headers, "Cookie: SKYNET=acfzythuhcmafmjpleqy43ex; cfzs_google-analytics_v4=%7B%22KqtC_pageviewCounter%22%3A%7B%22v%22%3A%224%22%7D%7D; cfz_google-analytics_v4=%7B%22KqtC_engagementDuration%22%3A%7B%22v%22%3A%220%22%2C%22e%22%3A1785280493449%7D%2C%22KqtC_engagementStart%22%3A%7B%22v%22%3A%221753744493449%22%2C%22e%22%3A1785280493449%7D%2C%22KqtC_counter%22%3A%7B%22v%22%3A%226%22%2C%22e%22%3A1785280493449%7D%2C%22KqtC_ga4sid%22%3A%7B%22v%22%3A%22431884890%22%2C%22e%22%3A1753746293449%7D%2C%22KqtC_session_counter%22%3A%7B%22v%22%3A%221%22%2C%22e%22%3A1785280493449%7D%2C%22KqtC_ga4%22%3A%7B%22v%22%3A%229a745c6a-e7cc-4d21-8c59-c6e37a2e9073%22%2C%22e%22%3A1785280493449%7D%2C%22KqtC__z_ga_audiences%22%3A%7B%22v%22%3A%229a745c6a-e7cc-4d21-8c59-c6e37a2e9073%22%2C%22e%22%3A1785280082075%7D%2C%22KqtC_let%22%3A%7B%22v%22%3A%221753744493449%22%2C%22e%22%3A1785280493449%7D%7D");
    headers = curl_slist_append(headers, "Sec-Fetch-Dest: empty");
    headers = curl_slist_append(headers, "Sec-Fetch-Mode: cors");
    headers = curl_slist_append(headers, "Sec-Fetch-Site: same-origin");
    headers = curl_slist_append(headers, "Priority: u=0");
    headers = curl_slist_append(headers, "Pragma: no-cache");
    headers = curl_slist_append(headers, "Cache-Control: no-cache");

    hnd = curl_easy_init();
    curl_easy_setopt(hnd, CURLOPT_BUFFERSIZE, 102400L);
    curl_easy_setopt(hnd, CURLOPT_URL, "https://webtopdf.com/Controllers/Convert.ashx");
    curl_easy_setopt(hnd, CURLOPT_NOPROGRESS, 1L);
    std::string reqstring = "{\"filepath\":\""+requrl+"\",\"pagesize\":\"A4\",\"width\":\"0\",\"height\":\"0\",\"landscape\":\"true\",\"leftmargin\":\"12\",\"topmargin\":\"12\",\"rightmargin\":\"12\",\"bottommargin\":\"14\",\"htmlzoom\":\"100\",\"header\":\"\",\"footer\":\"\",\"pw\":\"\",\"permissions\":\"011\",\"type\":\"GIF\",\"useprintmedia\":\"false\",\"noscript\":\"false\",\"nolink\":\"false\",\"pagenumber\":\"false\",\"grayscale\":\"false\",\"bookmark\":\"false\",\"minloadwaittime\":\"8\",\"wmtext\":\"\",\"wmfonttype\":\"0\",\"wmfontsize\":\"14\",\"wmfontbold\":\"false\",\"wmfontitalic\":\"false\",\"wmfontcolor\":\"000000\",\"wmprefixtype\":\"0\",\"wmopacity\":\"100\",\"wmrotationtype\":\"0\",\"wmbkmode\":\"0\",\"curUrl\":\"/webpage-to-image\",\"zipmode\":\"1\",\"convertemode\":\"07\"}";
    curl_easy_setopt(hnd, CURLOPT_POSTFIELDS, reqstring.c_str());
    curl_easy_setopt(hnd, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(hnd, CURLOPT_REFERER, "https://webtopdf.com/webpage-to-image");
    curl_easy_setopt(hnd, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Linux x86_64; rv:138.0) Gecko/20100101 Firefox/138.0");
    curl_easy_setopt(hnd, CURLOPT_MAXREDIRS, 50L);
    curl_easy_setopt(hnd, CURLOPT_HTTP_VERSION, (long)CURL_HTTP_VERSION_2TLS);
    curl_easy_setopt(hnd, CURLOPT_ACCEPT_ENCODING, "");
    curl_easy_setopt(hnd, CURLOPT_FTP_SKIP_PASV_IP, 1L);
    curl_easy_setopt(hnd, CURLOPT_TCP_KEEPALIVE, 1L);

    curl_easy_setopt(hnd, CURLOPT_WRITEFUNCTION, mem_write);
    curl_easy_setopt(hnd, CURLOPT_WRITEDATA, (void*)str);

    ret = curl_easy_perform(hnd);

    auto res = str->cpp();
    auto begit = res.find("\"fileName\":\"");
    auto endit = res.find("\",\"desFileFormat\"");
    auto str2 = res.substr(begit+12,endit-begit-12);
    std::cerr << str2 << '\n';

    realloc(str->buf,0); str->siz=0;

    curl_easy_setopt(hnd, CURLOPT_URL, "https://webtopdf.com/download");
    curl_easy_setopt(hnd, CURLOPT_POSTFIELDS, NULL);

    ret = curl_easy_perform(hnd);
    std::cerr << (str->cpp());

    curl_easy_cleanup(hnd);
    hnd = NULL;
    curl_slist_free_all(headers);
    headers = NULL;
    

   /*std::ifstream is;
    is.open(imagePath.c_str(), std::ios::in | std::ios::binary);
    if (is.is_open()) {
        std::cout << is.rdbuf();
    
    }*/
}