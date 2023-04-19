from flask import Flask, redirect, session, url_for
from flask import request
from flask import redirect
from flask_cors import CORS
from flask.json import jsonify
import json
import requests
from urllib3.exceptions import InsecureRequestWarning

from oauthlib.oauth2 import WebApplicationClient
from requests_oauthlib import OAuth2Session

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

# Informação para autenticação com OAuth e WSO2
client_id = OAUTH_CLIENT_KEY
client_secret = OAUTH_CLIENT_SECRET
redirect_uri=  "http://localhost:5000/callback"

scope = ['openid email']
oauth = OAuth2Session(client_id, redirect_uri=redirect_uri, scope=scope)
authorization_base_url= oauth.authorization_url('https://150.164.10.89:9443/oauth2/authorize')
token_url = 'https://150.164.10.89:9443/oauth2/token'


app = Flask("PAPA - Backend")
CORS(app)

app.run(debug=True)

@app.route("/")
def home():
    return "<h1>Hello Word</h1>"

@app.route("/login", methods=['GET'])
def login():
    wso2 = OAuth2Session(client_id)
    authorization_url, state = wso2.authorization_url(authorization_base_url)

    # State is used to prevent CSRF, keep this for later.
    session['oauth_state'] = state
    print ('Please go to %s and authorize access.' % authorization_url)
    return redirect(authorization_url)

@app.route("/callback")
def callback():
    wso2 = OAuth2Session(client_id, state=session['oauth_state'])
    token = wso2.fetch_token(token_url, client_secret=client_secret,
                               authorization_response=request.url)

    session['oauth_token'] = token
    print (token)
    return redirect('http://localhost:3000/home')



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