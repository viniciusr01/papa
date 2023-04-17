#Import Biblioteca do OpenID Connect
from oic.oic import Client
from oic.utils.authn.client import CLIENT_AUTHN_METHOD
from oic import rndstr
from oic.utils.http_util import Redirect
from oic.oic.message import ProviderConfigurationResponse
from oic.oic.message import RegistrationResponse
from oic.oic.message import AuthorizationResponse

@contextlib.contextmanager
def no_ssl_verification():
    opened_adapters = set()

    def merge_environment_settings(self, url, proxies, stream, verify, cert):
        # Verification happens only once per connection so we need to close
        # all the opened adapters once we're done. Otherwise, the effects of
        # verify=False persist beyond the end of this context manager.
        opened_adapters.add(self.get_adapter(url))

        settings = old_merge_environment_settings(self, url, proxies, stream, verify, cert)
        settings['verify'] = False

        return settings

    requests.Session.merge_environment_settings = merge_environment_settings

    try:
        with warnings.catch_warnings():
            warnings.simplefilter('ignore', InsecureRequestWarning)
            yield
    finally:
        requests.Session.merge_environment_settings = old_merge_environment_settings

        for adapter in opened_adapters:
            try:
                adapter.close()
            except:
                pass


#Registrando o Cliente (RP)
from oic.oic.message import ProviderConfigurationResponse

# Informações padrões sobre os end-points do Provedor OpenID (OP - WSO2 IS)
#client.handle_provider_config('https://150.164.10.89:9443/oauth2/token/.well-known/openid-configuration', ['issuer'])
op_info = ProviderConfigurationResponse( 
    version="1.0", 
    issuer= "https://150.164.10.89:9443/",
    authorization_endpoint="https://150.164.10.89:9443/oauth2/authorize",
    token_endpoint="https://150.164.10.89:9443/oauth2/token",
    jwks_uri= "https://150.164.10.89:9443/oauth2/jwks",
    userinfo_endpoint= "https://150.164.10.89:9443/oauth2/userinfo",
    revocation_endpoint= "https://150.164.10.89:9443/oauth2/revoke",
    introspection_endpoint= "https://150.164.10.89:9443/oauth2/introspect",
    end_session_endpoint= "https://150.164.10.89:9443/oidc/logout"
    )

client.handle_provider_config(op_info, op_info['issuer'])

# Client ID e Client Secret são geradas pelo Provedor OpenID (OP - WSO2 IS)
info = {"client_id": "######", 
        "client_secret": "########"
        }


client_reg = RegistrationResponse(**info)

client.store_registration_info(client_reg)

#Criar objeto cliente
client = Client(client_authn_method=CLIENT_AUTHN_METHOD)

# Após realizar o registro do cliente, é possível solicitar que o OP autentique usuários e obtenha informações sobre eles.
# O Fluxo de Autenticação Utilizado é Authorization Code Grant, definido pela RFC 6749 do OAuth 2.0
# Para mais informações sobre o fluxo de autenticação: https://tools.ietf.org/html/rfc6749#section-4.1

# Nesta etapa, ao fim é gerado a URL a qual o usuário deve ser direcionado para realizar o Login.

state = rndstr()
nonce = rndstr()

args = {
    "client_id": OAUTH_CLIENT_ID,
    "response_type": ['code'], # Determina o fluxo de autorização OAuth 2.0 que será utilizado
    "scope": ["openid email"], #Por padrão é inserido 'openid', mas também pode ser inserido informações a qual deseja ter do usuário, como exemplo, email.
    "nonce": nonce, #É um valor de string usado para associar uma sessão de cliente a um token de ID e para mitigar ataques de repetição
    "redirect_uri": ['http://localhost:5000/callback'], #URL que o Provedor OpenID deve retornar após autenticação ser realizada
    "state": state #É utilizado para controlar as respostas às solicitações pendentes
}

auth_req = client.construct_AuthorizationRequest(request_args=args)
login_url = auth_req.request(client.authorization_endpoint)

route("/login", methods=['GET'])
def login():
    return login_url
        

#Rota que trata informações retornadas pela provedor OpenID (OP - WSO2 IS)
route("/callback")
def callback():
   
    # If you're in a WSGI environment
    # Coleta as informações da URL que foram retornadas pelo Provedor OpenID (OP - WSO2 IS)
    response = request.query_string
  

    response = response.decode('ascii')
   
    
    aresp = client.parse_response(AuthorizationResponse, info=response, sformat="urlencoded")
    
   
    code = aresp["code"]
    assert aresp["state"] == state   #Verifica se o state enviado na solicitação de autenticação é o mesmo retornado pelo Provedor Open ID (OP - WSO2 IS)

  
    with no_ssl_verification():
        
        # Utiliza o Code Grant Type retornado pelo OP para solicitar ao OP o Access Token e ID Token
        args = {
        "code": aresp["code"]
        }
        resp = client.do_access_token_request(state=aresp["state"],
                                            request_args=args,
                                            authn_method="client_secret_basic")

    # Printa as informações sobre a autenticação realizada.
    # Informações como: Access Token, ID Token, Token Type, entre outras.
    print(resp)


    if(resp["access_token"]!= ""):
        return redirect("http://localhost:3000/home")
    
    else:
        return "ERRO DE AUTENTICAÇÃO"





