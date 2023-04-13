from flask import Flask 
from flask_cors import CORS
from flask import request
from flask import redirect
import json
import warnings
import contextlib
import requests
from urllib3.exceptions import InsecureRequestWarning


#Import Biblioteca do OpenID Connect
from oic.oic import Client
from oic.utils.authn.client import CLIENT_AUTHN_METHOD
from oic import rndstr
from oic.utils.http_util import Redirect
from oic.oic.message import ProviderConfigurationResponse
from oic.oic.message import RegistrationResponse
from oic.oic.message import AuthorizationResponse

from urllib.parse import parse_qs

import sys
sys.path.insert(0,"..")
from db import userDB
from db import politicaDB

# Environment variables 
from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = Path("./.env")
load_dotenv(dotenv_path)

FREEIPA_DOMAIN = os.getenv('FREEIPA_DOMAIN')
FREEIPA_ROOT_USERNAME = os.getenv('FREEIPA_ROOT_USERNAME')
FREEIPA_ROOT_PASSWORD = os.getenv('FREEIPA_ROOT_PASSWORD')
GITLAB_DOMAIN = os.getenv('GITLAB_DOMAIN')
GITLAB_ROOT_USERNAME = os.getenv('GITLAB_ROOT_USERNAME')
GITLAB_ROOT_PASSWORD = os.getenv('GITLAB_ROOT_PASSWORD')
OAUTH_CLIENT_KEY = os.getenv('OAUTH_CLIENT_KEY')
OAUTH_CLIENT_SECRET = os.getenv('OAUTH_CLIENT_SECRET')


# Services
from services.freeIPA  import FreeIPA
from services.gitLab import GitLab

IPA = FreeIPA(FREEIPA_DOMAIN, FREEIPA_ROOT_USERNAME, FREEIPA_ROOT_PASSWORD )
GL  = GitLab(GITLAB_DOMAIN, GITLAB_ROOT_USERNAME, GITLAB_ROOT_PASSWORD)



old_merge_environment_settings = requests.Session.merge_environment_settings

#Criar objeto cliente
client = Client(client_authn_method=CLIENT_AUTHN_METHOD)

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
info = {"client_id": OAUTH_CLIENT_KEY, 
        "client_secret": OAUTH_CLIENT_SECRET
        }


client_reg = RegistrationResponse(**info)

client.store_registration_info(client_reg)



# Após realizar o registro do cliente, é possível solicitar que o OP autentique usuários e obtenha informações sobre eles.
# O Fluxo de Autenticação Utilizado é Authorization Code Grant, definido pela RFC 6749 do OAuth 2.0
# Para mais informações sobre o fluxo de autenticação: https://tools.ietf.org/html/rfc6749#section-4.1

# Nesta etapa, ao fim é gerado a URL a qual o usuário deve ser direcionado para realizar o Login.
session = {}
environ = {}
session["state"] = rndstr()
session["nonce"] = rndstr()

args = {
    "client_id": 'gVXPQX0P0ffBUn2gs9aG9LGGRtsa',
    "response_type": ['code'], # Determina o fluxo de autorização OAuth 2.0 que será utilizado
    "scope": ["openid email"], #Por padrão é inserido 'openid', mas também pode ser inserido informações a qual deseja ter do usuário, como exemplo, email.
    "nonce": session["nonce"], #É um valor de string usado para associar uma sessão de cliente a um token de ID e para mitigar ataques de repetição
    "redirect_uri": ['http://localhost:5000/callback'], #URL que o Provedor OpenID deve retornar após autenticação ser realizada
    "state": session["state"] #É utilizado para controlar as respostas às solicitações pendentes
    
}

auth_req = client.construct_AuthorizationRequest(request_args=args)
login_url = auth_req.request(client.authorization_endpoint)



app = Flask("PAPA - Backend")
CORS(app)


@app.route("/")
def home():
    return "<h1>Hello Word</h1>"

@app.route("/login", methods=['GET'])
def login():
    return login_url
        

#Rota que trata informações retornadas pela provedor OpenID (OP - WSO2 IS)
@app.route("/callback")
def callback():
   
    # If you're in a WSGI environment
    # Coleta as informações da URL que foram retornadas pelo Provedor OpenID (OP - WSO2 IS)
    response = environ["QUERY_STRING"]
    print(response)
'''
    response = response.decode('ascii')
    aresp = client.parse_response(AuthorizationResponse, info=response, sformat="urlencoded")
    code = aresp["code"]
    assert aresp["state"] == session["state"]   #Verifica se o state enviado na solicitação de autenticação é o mesmo retornado pelo Provedor Open ID (OP - WSO2 IS)

  
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
'''

app.run(debug=True)


@app.route("/user", methods= ['GET', 'POST', 'PUT', 'DELETE'])
def user():
        
    if request.method == 'GET':
        username = request.args.get("username")
        
        if username == None:
            users = userDB.getAllUsers()
            return users
        else:
            user = userDB.getUser(username)
            return json.dumps(user)

    if request.method == 'POST':

        data = request.get_json()

        firstName = (data['firstName']).capitalize()
        lastName  = (data['lastName']).capitalize()
        fullName = firstName + " " + lastName
        email = data['email']
        userName = data['username']

        result = userDB.insertUser(userName, firstName, lastName, fullName, email)

        return result

    if request.method == 'PUT':
        
        data = request.get_json()

        firstName = (data['firstName']).capitalize()
        lastName  = (data['lastName']).capitalize()
        fullName = firstName + " " + lastName
        email = data['email']
        userName = data['username']
        userUpdate = data['userupdate']

        result = userDB.updateUser(userUpdate, userName, firstName, lastName, fullName, email)

        return result

    if request.method == 'DELETE':
        data = request.get_json()

        userToDelete = data['usertodelete']

        result = userDB.deleteUser(userToDelete)

        return result


@app.route("/user/create", methods = ['POST'])
def createUser():

    try:
        data = request.get_json()
        userName = data['username']
    
        result = userDB.getUser(userName)
        
        userName = result['username']
        firstName = result['firstname']
        lastName  = result['lastname']
        
        #email = result[5]
        
        # The full name is the same as the username because LDAP uses full name as cn
        fullName = result['username']
    
        # Add user in FreeIPA
        userIPA = IPA.addUserIPA(firstName, lastName, fullName, userName)
        randonPassword = userIPA['result']['randompassword']
        print("A senha e: ", randonPassword)
    
        # Authenticate to GitLab to create a user
        GL.createUserGitLab(userName, randonPassword)
        
        # TO DO
        # UPDATE USER IN DB
        userDB.updateServicesFlags(userName)
        
        return "Sucesso ao criar o usuário: " + userName

    except Exception as erro:
        return "Failed to create user: " + str(erro)



@app.route("/user/policy", methods = ['POST'])
def userPolicy():

    try:
        data = request.get_json()
        userNames = data['usernames']
        policyID = data['policyid']
    
        for user in userNames:
            userDB.updatePolicyID(user, policyID)

        politicaDB.updatePolicyMembers(policyID, userNames)

        return "Sucesso ao atribuir uma política para o(s) usuário(s)" 

    except Exception as erro:
        return "Failed to update policy id of user: " + str(erro)

    
@app.route("/gitlab")
@app.route("/gitlab/project", methods = ['GET', 'POST'])
def projectGitLab():
    

    if request.method == 'GET':
        return GL.getProjectsGitLab()

    if request.method == 'POST':

        data = request.get_json()

        usernames  = data['usernames']
        projects = data['projects']
        accessLevel= 'Developer'

        
        for user in usernames:
            for project in projects:
                projectID = projects[project]['id']
                GL.putUserInAProject(user, projectID, accessLevel)

        return 'Sucesso ao associar os usuários aos projetos do GitLab'


@app.route("/ipa")
@app.route("/ipa/getGroups", methods = ['GET'])
def getGroupsIPA():
    return IPA.getGroupsIPA()

@app.route("/ipa/group", methods = ['POST'])
def groupIPA():

    try:
        if request.method == 'POST':

            data = request.get_json()

            usernames  = data['usernames']
            groupIPA = data['grupoIPA']

            print(data)
           
            for user in usernames:
                IPA.putUserInGroupIPA(user, groupIPA)
            
            return 'Sucesso ao associar os usuários no grupo do FreeIPA'
        
    except Exception as error:
             return "Failed to put users in a FreeIPA group" + str(error)



@app.route("/policy", methods = ['GET', 'POST', 'PUT', 'DELETE'])
def policiesPIPA():

    if request.method == 'GET': 
        policyID = request.args.get("policyid")

        if policyID == None:
            try:
                policies = politicaDB.getAllPolicies()
                return policies
            except Exception as error:
                return "Failed to get the policy from database: " + str(error)
        else:
            try:
                policy = politicaDB.getPolicy(policyID)
                return json.dumps(policy)
            except Exception as error:
                return "Failed to get the policy from database: " + str(error)

    if request.method == 'POST':

        try:
            data = request.get_json()
            
            policyName = data['policyname']
                 
            projectsGitLab = {}
            for p in data['projectsgitlab']:
                pID = p['value']
                pName = p['label']
                pGL = {pName: {"id": pID, "name": pName}}
                projectsGitLab.update(pGL)
                
            groupIPA = data['groupipa']['name']

            result = politicaDB.insertPolicy(policyName, projectsGitLab, groupIPA)
            
            return result

        except Exception as error:
             return "Failed to insert the policy into database:" + str(error)

    if request.method == 'PUT':
        try:
            data = request.get_json()

            policyID   = data['policyid'] 
            policyName = data['policyname']
            projectsGitLab  = data['projectsgitlab']
            groupIPA = data['groupipa']

            result = politicaDB.updatePolicy(policyID, policyName, projectsGitLab, groupIPA)

            return result

        except Exception as error:
            return "Failed to update policy data in database: " + str(error)

    if request.method == 'DELETE':
        try:
            data = request.get_json()

            policyToDelete = data['policytodelete']
            result = politicaDB.deletePolicy(policyToDelete)

            return result

        except Exception as error:
            return "Failed to delete the policy in database: " + str(error)



@app.route("/policy/members", methods = ['GET', 'POST'])
def policyMembers():


    if request.method == 'GET': 
        policyID = request.args.get("policyid")
        
        try:
            result = politicaDB.getMemberPolicy(policyID)
            return result
        
        except Exception as error:
            return "Failed to get the members of a policy from the database: " + str(error)
       

app.run(debug=True)