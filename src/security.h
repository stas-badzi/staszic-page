#define AccessControlAllowOrigin "http://127.0.0.1"
#define AccessControlAllowCredentials true
#define AccessControlAllowHeaders "Access-Control-Allow-Credentials"



#define DefaultAccessControl() printf("Access-Control-Allow-Headers: %s\r\nAccess-Control-Allow-Origin: %s\r\nVary: Origin\r\nAccess-Control-Allow-Credentials: %s\r\n",AccessControlAllowHeaders,AccessControlAllowOrigin,AccessControlAllowCredentials?"true":"false")
#define SetAccessControl(ACAO,ACAC) printf("Access-Control-Allow-Origin: %s\r\nAccess-Control-Allow-Credentials: %s\r\n",ACAO,ACAC?"true":"false")